import Janus from "../utils/janus.js";
import {useCallback, useContext} from "react";
import {JanusContext} from "../contexts/JanusContext.js";
import {useJanusConsts} from "./janus-consts.hook.js";
import {RoomContext} from "../contexts/RoomContext.js";
import {AuthContext} from "../contexts/AuthContext.js";
import {useHubMethod} from "./hub-method.js";
import {App} from "antd";
import {useHubConsts} from "./hub-consts.hook.js";

export const useJanusFunctions = () => {
    const {requests, types, feedStatus, mixedAudio} = useJanusConsts()
    const {hubMethods} = useHubConsts()

    const {message} = App.useApp()
    const stereo = true // stereo audio

    const {invoke: leftRoom} = useHubMethod(hubMethods.leftRoom)
    const {invoke: ScreenSharingUpdated} = useHubMethod(hubMethods.ScreenSharingUpdated)

    const {janus, plugin, feed, setJanusDefaults} = useContext(JanusContext)
    const {room} = useContext(RoomContext)
    const {self, clearRoom} = useContext(RoomContext)
    const {userStates, setUserState} = useContext(AuthContext)

    /**
     * Return given plugin handle or default one (publisher)
     * @param pluginHandle plugin to check
     * @returns {string|null|*}
     */
    function pluginOrDefault(pluginHandle) {
        return pluginHandle || plugin.current.publisher
    }

    /**
     * Check if given plugins are enabled
     * @returns {boolean} all plugins are enabled or not
     */
    function arePluginsEnabled(plugins, silent = false) {
        plugins = Array.isArray(plugins) ? plugins : [plugins]

        for (let i = 0; i < plugins.length; i++) {
            if (plugins[i] === null || plugins[i] === undefined) {
                if (!silent) {
                    message.error("Plugin is not enabled. Please reload the page")
                }
                return false
            }
        }
        return true
    }

    /**
     * Get videoroom plugin rooms
     * @param callbacks callbacks to call after receiving the response
     */
    function getRooms(callbacks) {
        if (arePluginsEnabled(plugin.current.publisher)) {
            plugin.current.publisher.send({
                message: {
                    request: requests.list
                },
                success: callbacks.success || Janus.noop,
                error: callbacks.error || Janus.noop,
            })
        }
    }

    // ROOM EXISTS //
    /**
     * Check if room exists
     * @param roomId room id to check
     * @param callbacks callbacks to call after receiving the response
     */
    function roomExists(roomId, callbacks = {}) {
        if (arePluginsEnabled([plugin.current.publisher, plugin.current.audiobridge])) {
            videoRoomExists(roomId, callbacks)
        }
    }

    /**
     * Check if videoroom plugin room exists
     * @param roomId room id to check
     * @param callbacks callbacks to call after receiving the response
     */
    function videoRoomExists(roomId, callbacks = {}) {
        plugin.current.publisher.send({
            message: {
                request: requests.exists,
                room: roomId
            },
            success: response => {
                if (response.exists) {
                    audioRoomExists(roomId, callbacks)
                } else {
                    return {
                        ...response,
                        exists: false
                    }
                }
            },
            error: callbacks.error || Janus.noop
        })
    }

    /**
     * Check if audiobridge plugin room exists
     * @param roomId room id to check
     * @param callbacks callbacks to call after receiving the response
     */
    function audioRoomExists(roomId, callbacks = {}) {
        plugin.current.audiobridge.send({
            message: {
                request: requests.exists,
                room: roomId
            },
            success: callbacks.success || Janus.noop,
            error: callbacks.error || Janus.noop
        })
    }

    /**
     * Join video room
     * @param roomId room id to join
     * @param username display username
     * @param pluginHandle plugin handle, publisher by default
     */
    function joinVideoRoom(roomId, username, pluginHandle = null) {
        pluginHandle = pluginOrDefault(pluginHandle)
        if (arePluginsEnabled([pluginHandle, plugin.current.audiobridge])) {
            pluginHandle.send({
                message: {
                    request: requests.join,
                    room: roomId,
                    ptype: "publisher",
                    display: username
                }
            })
        }
    }

    /**
     * Join audio room
     * @param roomId room id to join
     * @param username display username
     */
    function joinAudioRoom(roomId, username) {
        if (arePluginsEnabled(plugin.current.audiobridge)) {
            plugin.current.audiobridge.send({
                message: {
                    request: requests.join,
                    room: roomId,
                    display: username,
                    muted: true
                }
            })
        }
    }

    /**
     * Leave room as presenter
     */
    function leaveRoomAsPresenter(silent = false) {
        if (arePluginsEnabled(plugin.current.presenter, silent)) {
            // Stop and remove local screen tracks
            plugin.current.presenter.onlocaltrack(
                feed.current[self.current.presenter.id][types.video].track,
                false
            )

            // Leave room
            plugin.current.presenter.send({
                message: {
                    request: requests.leave,
                }
            })
        }
    }

    /**
     * Leave room
     */
    function leaveRoom() {
        if (arePluginsEnabled([plugin.current.publisher, plugin.current.audiobridge])) {
            const id = self.current.id

            // Stop all local tracks
            Object.keys(feed.current[id]).forEach(type => {
                const stream = feed.current[id][type].stream

                if (stream) {
                    Janus.stopAllTracks(stream)
                }
            })

            // Clear video WebMediaPlayer
            clearWebMediaPlayer(id, types.video, true)

            // Clear audio WebMediaPlayer
            clearWebMediaPlayer(mixedAudio, types.audio, true)

            // If we're streaming - leave room
            leaveRoomAsPresenter(true)

            // Destroy session
            janus.current.destroy({
                success: () => {
                    // Notify Hub that I left the room
                    leftRoom(String(room.id))

                    // Clear state
                    setUserState(userStates.left)
                    setJanusDefaults()
                    clearRoom()
                }
            })
        }
    }

    // CREATE ROOM //
    /**
     * Create room
     * @param props properties
     * @param callbacks callbacks to call after receiving the response
     */
    function createRoom(props, callbacks = {}) {
        if (arePluginsEnabled([plugin.current.publisher, plugin.current.audiobridge])) {
            createVideoRoom(props, callbacks)
        }
    }

    /**
     * Create room for videoroom plugin
     * @param props properties
     * @param callbacks callbacks to call after receiving the response
     */
    function createVideoRoom(props, callbacks = {}) {
        plugin.current.publisher.send({
            message: {
                request: requests.create,
                is_private: false,
                ...props
            },
            success: (response) => {
                createAudioRoom(response.room, callbacks)
            },
            error: callbacks.error || Janus.noop,
        })
    }

    /**
     * Create room for audiobridge plugin
     * @param roomId room id to create - the same as room for videoroom plugin
     * @param callbacks callbacks to call after receiving the response
     */
    function createAudioRoom(roomId, callbacks = {}) {
        plugin.current.audiobridge.send({
            message: {
                request: requests.create,
                is_private: false,
                room: roomId,
            },
            success: callbacks.success || Janus.noop,
            error: () => {
                Janus.error("Couldn't create audio room", roomId)

                destroyVideoRoom(roomId, {
                    // One more try
                    error: () => destroyVideoRoom(roomId, {}, false)
                }, false)
            }
        })
    }

    // EDIT ROOM //
    /**
     * Edit room
     * @param props properties
     * @param callbacks callbacks to call after receiving the response
     */
    function editRoom(props, callbacks = {}) {
        if (arePluginsEnabled(plugin.current.publisher)) {
            plugin.current.publisher.send({
                message: {
                    request: requests.edit,
                    audiolevel_event: true,
                    ...props
                },
                success: callbacks.success || Janus.noop,
                error: callbacks.error || Janus.error
            })
        }
    }

    // DESTROY ROOM
    /**
     * Destroy room
     * @param roomId room id to destroy
     * @param callbacks callbacks to call after receiving the response
     */
    function destroyRoom(roomId, callbacks = {}) {
        if (arePluginsEnabled([plugin.current.publisher, plugin.current.audiobridge])) {
            destroyVideoRoom(roomId, callbacks)
        }
    }

    /**
     * Destroy room for videoroom plugin
     * @param roomId room id to destory
     * @param callbacks callbacks to call after receiving the response
     * @param withAudio
     */
    function destroyVideoRoom(roomId, callbacks = {}, withAudio = true) {
        plugin.current.publisher.send({
            message: {
                request: requests.destroy,
                room: roomId
            },
            success: () => {
                if (withAudio) {
                    destroyAudioRoom(roomId, callbacks)
                } else {
                    callbacks.success()
                }
            },
            error: callbacks.error || Janus.noop
        })
    }

    /**
     * Destroy room for audiobridge plugin
     * @param roomId room id to destroy
     * @param callbacks callbacks to call after receiving the response
     */
    function destroyAudioRoom(roomId, callbacks) {
        plugin.current.audiobridge.send({
            message: {
                request: requests.destroy,
                room: roomId
            },
            success: callbacks.success || Janus.noop,
            error: () => {
                Janus.error("Couldn't destroy audio room", roomId)
                callbacks.error()
            }
        })
    }

    /**
     * Provide media element ref
     * @type {(function(*, *): void)|*}
     */
    const provideMediaRef = useCallback((clientId, type, node) => {
        if (node && feed.current[clientId]?.[type]) {
            if (!node.onended) {
                node.onended = function () {
                    this.src = ""
                    this.srcObject = null
                    this.remove()
                }
            }
            feed.current[clientId][type].node = node
        }
    }, [])

    /**
     * Clear browser WebMediaPlayer
     * @param feedId feed id to clear player of
     * @param type type of stream to clear
     * @param removeStream is stream and track should be removed too
     */
    function clearWebMediaPlayer(feedId, type = types.video, removeStream = true) {
        if (feed.current[feedId]) {
            // Remove element from DOM and release the stream
            feed.current[feedId][type].node?.onended()

            // Update feed
            feed.current[feedId][type] = {
                ...feed.current[feedId][type],
                node: null,
                ended: true
            }

            // Remove stream and track
            if (removeStream) {
                feed.current[feedId][type] = {
                    ...feed.current[feedId][type],
                    track: null,
                    stream: null
                }
            }
        }
    }

    /**
     * Toggle audio
     * @param muted is audio muted or not
     */
    function toggleAudio(muted) {
        configure(plugin.current.audiobridge, {muted: muted})
    }


    // OFFER AND CONFIGURATION //
    /**
     * Send configure request
     * @param pluginHandle plugin
     * @param options options
     * @param jsep JSEP
     */
    function configure(pluginHandle, options = {}, jsep = null) {
        let request = {
            message: {request: requests.configure, ...options},
        }

        if (jsep) {
            request.jsep = jsep
        }

        Janus.log("Sent request", request)

        // Handle SDP
        pluginHandle.send(request)
    }

    /**
     * Handle own feed
     * @param type feed type
     * @param add add feed or not
     */
    function handleOwnFeed(type, add = true) {
        const addAudio = type === types.audio && add
        const screenSharing = type === types.screen

        let tracks = []
        let pluginHandle

        if (type === types.data) {
            // DATA
            tracks.push({type: types.data})

            // Set pluginHandle
            pluginHandle = plugin.current.publisher
        } else if (addAudio) {
            // AUDIO - Bidirectional audio
            tracks.push({type: types.audio, capture: true, recv: true})

            // Set pluginHandle
            pluginHandle = plugin.current.audiobridge
        } else if ([types.video, types.screen].includes(type)) {
            // VIDEO/SCREEN
            let action
            if (add) {
                // Added, removed and added again
                if (feed.current[self.current.id]?.[type]?.mid) {
                    action = {
                        replace: true,
                        mid: feed.current[self.current.id][type].mid
                    }
                } else {
                    // Just added first time
                    action = {add: true}
                }
            } else {
                // Removed
                action = {
                    remove: true,
                    mid: feed.current[self.current.id][type].mid
                }
            }
            tracks.push({type: type, capture: true, recv: false, ...action})


            // Feed of given type is being added or removed
            const id = screenSharing ? self.current.presenter?.id : self.current.id
            feed.current[id] = {
                ...feed.current[id],
                [types.video]: {
                    ...feed.current[id]?.[types.video],
                    status: add ? feedStatus.adding : feedStatus.removing
                }
            }

            // Set pluginHandle
            pluginHandle = screenSharing ? plugin.current.presenter : plugin.current.publisher
        }

        if (tracks.length > 0) {
            const offer = {
                tracks: tracks,
                success: jsep => {
                    // Notify other participants that I've started screen sharing
                    if (screenSharing) {
                        ScreenSharingUpdated(self.current.room, self.current.presenter.id)
                    }

                    // Set bitrate for screen sharing
                    let options = {}
                    if (screenSharing && add) {
                        options = {
                            bitrate: 500000,
                        }
                    }

                    // Mute self if we're adding audio
                    if (addAudio) {
                        options = {
                            muted: true
                        }
                    }

                    configure(pluginHandle, options, jsep)
                },
                error: error => {
                    Janus.error("WebRTC error:", error);

                    // Notify other participants that there's no more screen sharing
                    if (screenSharing) {
                        clearScreenSharing()
                    }
                }
            }

            // Add stereo if needed
            if (addAudio) {
                offer.customizeSdp = function (jsep) {
                    if (stereo && jsep.sdp.indexOf("stereo=1") === -1) {
                        // Make sure that our offer contains stereo too
                        jsep.sdp = jsep.sdp.replace("useinbandfec=1", "useinbandfec=1;stereo=1");
                    }
                }
            }

            // Create an offer
            pluginHandle.createOffer(offer)
        }
    }

    /**
     * Object with functions to check if publisher is...
     * @type {{selfPresenter: (function(*): boolean), notSelfPresenter: (function(*): boolean), self: (function(*): boolean), notSelf: (function(*): boolean)}}
     */
    const isPublisher = {
        self: publisher => publisher.id === self.current?.id,
        notSelf: publisher => publisher.id !== self.current?.id,
        selfPresenter: publisher => publisher.id === self.current.presenter?.id,
        notSelfPresenter: publisher => publisher.id !== self.current.presenter?.id
    }

    /**
     * Clear screen sharing
     */
    function clearScreenSharing() {
        // Notify Hub that there's no more screen sharing
        ScreenSharingUpdated(self.current.room, null)

        self.current.presenter = {}

        if (plugin.current.presenter !== null) {
            plugin.current.presenter = null
        }
    }

    return {
        arePluginsEnabled,
        isPublisher,
        joinVideoRoom,
        joinAudioRoom,
        roomExists,
        leaveRoom,
        getRooms,
        createRoom,
        editRoom,
        destroyRoom,
        leaveRoomAsPresenter,
        handleOwnFeed,
        toggleAudio,
        clearScreenSharing,
        clearWebMediaPlayer,
        provideMediaRef,
    }
}