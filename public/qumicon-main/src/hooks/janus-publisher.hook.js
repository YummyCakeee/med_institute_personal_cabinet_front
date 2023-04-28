import {useContext} from "react";
import {JanusContext} from "../contexts/JanusContext.js";
import Janus from "../utils/janus.js";
import {useJanusSubscriber} from "./janus-subscriber.hook.js";
import {useJanusConsts} from "./janus-consts.hook.js";
import {RoomContext} from "../contexts/RoomContext.js";
import {useHubMethod} from "./hub-method.js";
import {AuthContext} from "../contexts/AuthContext.js";
import {useRoomConsts} from "./room-consts.hook.js";
import {App} from "antd";
import {useJanusFunctions} from "./janus-functions.hook.js";
import {useHubConsts} from "./hub-consts.hook.js";

/**
 * Use Janus publisher plugin
 */
export const useJanusPublisher = () => {
    const {feedStatus, videoRoomPlugin, opaqueId, events, msg, types} = useJanusConsts()
    const {mode, screenSuffix} = useRoomConsts()
    const {hubMethods} = useHubConsts()

    const {message: antMessage} = App.useApp()

    const {janus, plugin, feed, presenter} = useContext(JanusContext)
    const {setPublishers, self, roomState} = useContext(RoomContext)
    const {setUserState, userStates} = useContext(AuthContext)
    const {handleOwnFeed, joinAudioRoom, clearScreenSharing} = useJanusFunctions()

    const {invoke: joinedRoom} = useHubMethod(hubMethods.joinedRoom)
    const {invoke: ScreenSharingUpdated} = useHubMethod(hubMethods.ScreenSharingUpdated)


    const {subscribeTo, unsubscribeFrom} = useJanusSubscriber()

    /**
     * Attach publisher plugin
     */
    function attachPublisherPlugin() {
        janus.current.attach({
            plugin: videoRoomPlugin,
            opaqueId: opaqueId,
            // Успешное присоединение плагина
            success: (_pluginHandle) => {
                plugin.current.publisher = _pluginHandle
            },
            // Ошибка присоединения плагина
            error: (error) => {
                Janus.log("  -- Error attaching plugin...", error);
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

                feed.current[self.current.id][medium] = {
                    ...feed.current[self.current.id][medium],
                    status: on ? feedStatus.added : feedStatus.absent,
                    mid: mid
                }
            },
            // Изменение состояние WebRTC
            webrtcState: (on) => {
                Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
            },
            // Получение сообщения от сервера
            onmessage: (message, jsep) => {
                Janus.log(" ::: Got a message (publisher) :::", message)

                if (!!message[msg.videoroom]) {
                    handlePublisherMessage(message)
                }

                if (jsep) {
                    Janus.log("Handling SDP as well...", jsep);
                    plugin.current.publisher.handleRemoteJsep({jsep: jsep});
                }
            },
            // Получение локального трека
            onlocaltrack: (track, on) => {
                Janus.log(" ::: Got a local track event :::");
                Janus.log("Local track " + (on ? "added" : "removed") + ":", track);

                const id = self.current.id

                let stream = feed.current[id][track.kind].stream

                // Track was removed
                if (!on && stream) {
                    console.log('here')

                    // Update feed
                    feed.current[id][track.kind] = {
                        ...feed.current[id][track.kind],
                        status: feedStatus.stopped,
                        track: null,
                        stream: null
                    }

                    // Stop all tracks
                    Janus.stopAllTracks(stream)
                    return
                }

                if (stream) {
                    // I've been here before
                    return
                }

                // Audio track was added - ignore it
                if (track.kind === types.audio) {
                    feed.current[id][track.kind].status = feedStatus.added
                    return
                }
                // Video track was added
                if (track.kind === types.video) {
                    // Create new stream from given video track
                    stream = new MediaStream([track])

                    // Update feed
                    feed.current[id][track.kind] = {
                        ...feed.current[id][track.kind],
                        track: track,
                        stream: stream,
                        status: feedStatus.attached
                    }

                    // Attach media stream
                    Janus.attachMediaStream(feed.current[id][track.kind].node, stream)

                    // Play local stream
                    feed.current[id][track.kind].node.play()
                }
            },
            // Очистка
            oncleanup: function () {
                Janus.log("Got cleanup notification")
            }
        })
    }

    /**
     * Handle publisher event
     * @param message
     */
    function handlePublisherMessage(message) {
        const event = message[msg.videoroom];

        switch (event) {
            // Join the room
            case events.joined:
                Janus.log("Successfully joined room " + message["room"] + " with ID " + message["id"]);

                // Set self
                self.current = {
                    ...self.current,
                    id: message[msg.id],
                    room: message[msg.room],
                    private_id: message[msg.private_id]
                }

                // Update user state
                setUserState(userStates.joined)

                // Join room at Hub
                joinedRoom(message[msg.room])

                // Join audio room
                joinAudioRoom(self.current.room, self.current.display)

                // Update feed for self
                feed.current[self.current.id] = {
                    [types.data]: {
                        status: feedStatus.absent,
                        mid: null,
                    },
                    [types.video]: {
                        status: feedStatus.absent,
                        mid: null,
                        node: null,
                        stream: null,
                        track: null,
                    }
                }

                // Check if mode is subscriber
                if (self.current.mode === mode.subscriber) {
                    antMessage.info("You've joined in subscriber mode")
                }

                // Publish own data feed
                handleOwnFeed(types.data)

                // Check if other publishers are available
                checkPublishers(message[msg.publishers] || [], true)
                break
            // Somebody is talking
            case events.talking:
                break
            // Somebody stopped talking
            case events.stopped_talking:
                break
            // The room has been destroyed
            case events.destroyed: // todo
                Janus.log("The room has been destroyed")
                window.location.reload()
                break
            // Other events
            case events.event:
                Janus.log("Other event", message)
                // Any info on our streams or a new feed to attach to
                if (message[msg.streams]) {
                    break
                }
                // There are other publishers in the room
                if (message[msg.publishers]) {
                    checkPublishers(message[msg.publishers])
                    break
                }
                if (message[msg.leaving]) {
                    unsubscribeFrom(message[msg.leaving], true)
                    break
                }
                if (message[msg.unpublished]) {
                    if (message[msg.unpublished] === 'ok') {
                        plugin.current.publisher.hangup();
                    } else {
                        // If active screen presenter left us for some reason
                        if (presenter.current && presenter.current === message[msg.unpublished]) {
                            clearScreenSharing()
                        }

                        // Unsubscribe
                        unsubscribeFrom(message[msg.unpublished], true)
                    }
                    break
                }
                if (message[msg.error]) {
                    if (message[msg.error_code] === 426) {
                        antMessage.error("No such room")
                        break
                    }
                    antMessage.error(message[msg.error])
                }
                break
        }
    }

    /**
     * Check incoming publishers
     * @param list list of publishers
     * @param addSelf need to add self to publishers list
     */
    function checkPublishers(list, addSelf = false) {
        Janus.log('List of available publishers', list)

        let _publishers = roomState.current.publishers
        let index

        // Current slide
        const slide = roomState.current.slide

        // Add self to publishers list
        if (addSelf) {
            _publishers = [{
                id: self.current.id,
                display: self.current.display,
                streams: []
            }, ..._publishers]
        }


        list.forEach(publisher => {
                // Don't subscribe to dummy publisher
                if (publisher.dummy) {
                    return
                }

                const sharingScreen = publisher.display.includes(screenSuffix)

                // Check if publisher is sharing screen
                if (sharingScreen) {
                    ScreenSharingUpdated(self.current.room, publisher.id)
                }

                if (publisher.streams.length > 0) {
                    // Add publisher id to streams
                    const streams = publisher.streams.map(stream => ({
                        ...stream,
                        id: publisher.id,
                    }))

                    // Update publisher feed
                    // In VideoRoom we expect only video feed from publisher
                    feed.current[publisher.id] = {
                        [types.video]: {
                            node: feed.current[publisher.id]?.[types.video]?.node || null,
                            stream: feed.current[publisher.id]?.[types.video]?.stream || null,
                            // info: streams.find(stream => stream.type === types.video) || null,
                            track: null,
                            mid: null
                        },
                    }

                    // Update publishers
                    index = _publishers.findIndex(pub => pub.id === publisher.id)

                    // Publisher does not exist
                    if (index === -1) {
                        // We're sharing the screen
                        if (publisher.id === self.current.presenter?.id) {
                            _publishers.splice(1, 0, {
                                id: publisher.id,
                                display: publisher.display,
                                streams,
                            })
                        } else {
                            _publishers.push({
                                id: publisher.id,
                                display: publisher.display,
                                streams,
                            })
                        }

                    } else {
                        _publishers.splice(index, 1, {
                            ..._publishers[index],
                            streams: streams
                        })
                    }
                }
            }
        )

        // Update publishers list
        roomState.current.publishers = _publishers
        setPublishers([..._publishers])
    }

    return {
        attachPublisherPlugin,
    }
}