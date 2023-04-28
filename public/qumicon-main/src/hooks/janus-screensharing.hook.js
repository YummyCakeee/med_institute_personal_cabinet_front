import {useJanusConsts} from "./janus-consts.hook.js";
import Janus from "../utils/janus.js";
import {App} from "antd";
import {useJanusFunctions} from "./janus-functions.hook.js";
import {useContext} from "react";
import {RoomContext} from "../contexts/RoomContext.js";
import {JanusContext} from "../contexts/JanusContext.js";
import {useHubMethod} from "./hub-method.js";
import {useHubConsts} from "./hub-consts.hook.js";
import {useRoomConsts} from "./room-consts.hook.js";

export const useJanusScreenSharing = () => {
    const {videoRoomPlugin, opaqueId, msg, events, types, feedStatus} = useJanusConsts()
    const {hubMethods} = useHubConsts()
    const {screenSuffix} = useRoomConsts()

    const {message: antMessage} = App.useApp()
    const {handleOwnFeed, joinVideoRoom, leaveRoomAsPresenter, clearScreenSharing, clearWebMediaPlayer} = useJanusFunctions()
    const {invoke: ScreenSharingUpdated} = useHubMethod(hubMethods.ScreenSharingUpdated)

    const {self} = useContext(RoomContext)
    const {janus, plugin, feed} = useContext(JanusContext)

    /**
     * Start screen sharing
     */
    function startScreenSharing() {
        // Notify other participants that I'm about to start screen sharing
        ScreenSharingUpdated(self.current.room, self.current.id)

        // Attach new plugin
        attachScreenSharingPlugin()
    }

    /**
     * Stop screen sharing
     */
    function stopScreenSharing() {
        leaveRoomAsPresenter()
    }

    function attachScreenSharingPlugin() {
        janus.current.attach({
            plugin: videoRoomPlugin,
            opaqueId: opaqueId,
            // Успешное присоединение плагина
            success: pluginHandle => {
                plugin.current.presenter = pluginHandle

                joinVideoRoom(self.current.room, self.current.display + screenSuffix, plugin.current.presenter)
            },
            // Ошибка присоединения плагина
            error: (error) => {
                console.log('from error')
                // Notify other participants that there's no more screen sharing
                clearScreenSharing()

                Janus.log("  -- Error attaching plugin...", error);
                console.log("Ошибка присоединения плагина")
            },
            // Диалоговое окно на согласие включить камеру
            consentDialog: (on) => {
                Janus.log("Consent dialog should be " + (on ? "on" : "off") + " now");
            },
            // Изменение ICE состояния
            iceState: (state) => {
                Janus.log("ICE state changed to " + state);
            },
            // Изменение состояния медиа треков
            mediaState: (medium, on, mid) => {
                Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium + " (mid=" + mid + ")");
            },
            // Получение сообщения от сервера
            onmessage: (message, jsep) => {
                Janus.log(" ::: Got a message (screensharing) :::", message)

                if (!!message[msg.videoroom]) {
                    handleScreenSharingMessage(message)
                }

                if (jsep) {
                    Janus.log("Handling SDP as well...", jsep);
                    plugin.current.presenter.handleRemoteJsep({jsep: jsep});
                }
            },
            // Получение локального трека
            onlocaltrack: (track, on) => {
                Janus.log(" ::: Got a local track event (screensharing) :::");
                Janus.log("Local track " + (on ? "added" : "removed") + ":", track);

                const id = self.current.presenter.id

                // Try to get stream
                let stream = feed.current[id][types.video].stream

                // Track was removed
                if (!on && stream) {
                    if (track.kind === types.video) {
                        // Clear WebMediaPlayer
                        clearWebMediaPlayer(id, types.video, true)

                        // Update feed status
                        feed.current[id][types.video] = {
                            ...feed.current[id][types.video],
                            status: feedStatus.stopped,
                            track: null,
                            stream: null,
                        }

                        // Stop all tracks
                        Janus.stopAllTracks(stream)
                    }
                    return
                }

                if (stream) {
                    // I've been here before
                    return
                }

                // Audio track was added - ignore it
                if (track.kind === types.audio) {
                    return
                }
                // Video track (screen sharing) was added
                if (track.kind === types.video) {
                    // Create new stream from given video track
                    stream = new MediaStream([track])

                    // Add onended callback
                    track.onended = stopScreenSharing

                    Janus.log("Создан локальный стрим (screen sharing)", track.kind)

                    // Attach media stream
                    // We use interval here because attaching is starting earlier
                    // that the needed node is being provided
                    const interval = setInterval(() => {
                        if (feed.current[id]?.[types.video]?.node) {
                            clearInterval(interval)

                            // Attach stream
                            Janus.attachMediaStream(feed.current[id][types.video].node, stream)

                            // Play stream
                            feed.current[id][types.video].node.play()

                            // Update feed
                            feed.current[id][types.video] = {
                                ...feed.current[id][types.video],
                                track: track,
                                stream: stream,
                                status: feedStatus.attached
                            }
                        }
                    }, 100)
                }
            },
            // Очистка
            oncleanup: function () {
                Janus.log("Got screensharing cleanup notification")
            }
        })
    }

    function handleScreenSharingMessage(message) {
        const event = message[msg.videoroom];

        switch (event) {
            // Join the room
            case events.joined:
                self.current = {
                    ...self.current,
                    presenter: {
                        id: message[msg.id],
                        private_id: message[msg.private_id]
                    }
                }

                // Publisher screen feed
                handleOwnFeed(types.screen)
                break
            // The room has been destroyed
            case events.destroyed: // todo
                Janus.log("The room has been destroyed")
                break
            // Other events
            case events.event:
                Janus.log("Other event", message)
                // Any info on our streams or a new feed to attach to
                // Or there are other publishers in the room
                // Or somebody's leaving
                if (message[msg.streams] || message[msg.publishers]) {
                    break
                }
                // Somebody's leaving
                if (message[msg.leaving]) {
                    console.log('here', message[msg.leaving] === 'ok')
                    if (message[msg.leaving] === 'ok') {
                        // Notify other participants that there's no more screen sharing
                        clearScreenSharing()
                    }
                    break
                }
                // Error
                if (message[msg.error]) {
                    // Notify other participants that there's no more screen sharing
                    clearScreenSharing()

                    if (message[msg.error_code] === 426) {
                        antMessage.error("No such room")
                        break
                    }
                    antMessage.error(message[msg.error])
                }
        }
    }

    return {
        startScreenSharing,
        stopScreenSharing
    }
}