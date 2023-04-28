import {useContext} from "react";
import {JanusContext} from "../contexts/JanusContext.js";
import {useJanusConsts} from "./janus-consts.hook.js";
import Janus from "../utils/janus.js";
import {RoomContext} from "../contexts/RoomContext.js";
import {useJanusFunctions} from "./janus-functions.hook.js";
import {App} from "antd";

export const useJanusAudioBridge = () => {
    const {audioBridgePlugin, opaqueId, msg, events, types, mixedAudio} = useJanusConsts()

    const {message: notification} = App.useApp()
    const {handleOwnFeed} = useJanusFunctions()

    const {janus, plugin, feed} = useContext(JanusContext)
    const {self} = useContext(RoomContext)

    function attachAudioBridgePlugin() {
        janus.current.attach({
            plugin: audioBridgePlugin,
            opaqueId: opaqueId,
            success: (pluginHandle) => {
                plugin.current.audiobridge = pluginHandle
            },
            error: (error) => {
                Janus.log("  -- Error attaching AudioBridge plugin...", error);
                console.log("Ошибка присоединения плагина AudioBridge")
            },
            // Диалоговое окно на согласие включить камеру
            consentDialog: (on) => {
                Janus.log("Consent dialog should be " + (on ? "on" : "off") + " now");
            },
            // Изменение ICE состояния
            iceState: (state) => {
                Janus.log("ICE state changed to " + state);
            },
            mediaState: function (medium, on, mid) {
                Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium + " (mid=" + mid + ")");
            },
            webrtcState: function (on) {
                Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
            },
            onmessage: (message, jsep) => {
                Janus.log(" ::: Got a AudioBridge message :::", message);

                if (!!message[msg.audiobridge]) {
                    handleAudiobridgeEvent(message)
                }

                if (jsep) {
                    Janus.log("Handling SDP as well...", jsep)
                    plugin.current.audiobridge.handleRemoteJsep({jsep: jsep})
                }
            },
            onremotetrack: (track, mid, on, metadata) => {
                Janus.log(
                    "Remote track AudioBridge (mid=" + mid + ") " +
                    (on ? "added" : "removed") +
                    (metadata ? " (" + metadata.reason + ") " : "") + ":", track
                )

                // Nothing but audio is expected
                if (track.kind !== types.audio) {
                    Janus.log("We don't expect nothing but audio here")
                    return
                }

                // Get stream
                let stream = feed.current[mixedAudio][types.audio].stream

                if (stream) {
                    // We've been here already
                    return
                }

                if (!on) {
                    feed.current[mixedAudio][types.audio] = {
                        ...feed.current[mixedAudio][types.audio],
                        track: null,
                        stream: null,
                        node: null
                    }
                    return
                }

                // Create new stream from given track
                stream = new MediaStream([track])

                // Attach stream to audio element
                Janus.attachMediaStream(feed.current[mixedAudio][types.audio].node, stream)

                // Update feed
                feed.current[mixedAudio][types.audio] = {
                    ...feed.current[mixedAudio][types.audio],
                    track: track,
                    stream: stream,
                    mid: mid
                }
            },
            oncleanup: function() {
                Janus.log("Got cleanup notification (AudioBridge)")
            }
        })
    }

    /**
     * Handle audiobridge event
     * @param message message to handle
     */
    function handleAudiobridgeEvent(message) {
        const event = message[msg.audiobridge]

        switch (event) {
            // Joined the room
            case events.joined:
                if (message[msg.id]) {
                    Janus.log("Successfully joined room " + message[msg.room] + " with ID " + message[msg.id]);

                    // Update self
                    self.current = {
                        ...self.current,
                        audiobridge: {
                            id: message[msg.id],
                        }
                    }

                    // Publish own audio feed
                    handleOwnFeed(types.audio)
                }
                break
            // Room has been destroyed
            case events.destroyed: // todo
                Janus.warn("The room has been destroyed!");
                window.location.reload()
                break
            // Other event
            case events.event:
                if (message[msg.error]) {
                    if (message[msg.error_code] === 485) {
                        notification.error("Room does not exist")
                        break
                    }
                    notification.error(message[msg.error])
                    break
                }
                break
        }
    }

    return {
        attachAudioBridgePlugin
    }
}