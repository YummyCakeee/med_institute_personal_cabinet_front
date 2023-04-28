import {useContext} from "react";
import {JanusContext} from "../contexts/JanusContext.js";
import {useJanusConsts} from "./janus-consts.hook.js";
import {RoomContext} from "../contexts/RoomContext.js";
import Janus from "../utils/janus.js";
import {useJanusFunctions} from "./janus-functions.hook.js";

export const useJanusSubscriber = () => {
    const {janus, plugin, feed, presenter} = useContext(JanusContext)
    const {self, setPublishers, roomState} = useContext(RoomContext)

    const {requests, opaqueId, videoRoomPlugin, msg, events, types} = useJanusConsts()
    const {clearWebMediaPlayer, isPublisher} = useJanusFunctions()

    /**
     * Attach subscriber plugin
     * @param callback call after plugin is attached
     */
    function attachSubscriberPlugin(callback) {
        janus.current.attach({
            plugin: videoRoomPlugin,
            opaqueId: opaqueId,
            success: pluginHandle => {
                plugin.current.subscriber = pluginHandle
                callback()
            },
            error: error => {
                console.error("Error attaching subscriber plugin", error)
            },
            onmessage: (message, jsep) => {
                if (message[msg.error]) {
                    // alert(message[msg.error]) // todo
                    return
                }

                handleSubscriberMessage(message)

                if (jsep) {
                    plugin.current.subscriber.createAnswer({
                        jsep: jsep,
                        tracks: [{type: types.data}],
                        success: jsep => {
                            plugin.current.subscriber.send({
                                message: {
                                    request: requests.start,
                                    room: self.current.room
                                },
                                jsep: jsep
                            })
                        },
                        error: error => {
                            console.error("WebRTC error..." + error)
                        }
                    })
                }
            },
            onremotetrack: (track, mid, on, metadata) => {
                Janus.log(
                    "Remote track (mid=" + mid + ") " +
                    (on ? "added" : "removed") +
                    (metadata ? " (" + metadata.reason + ") " : "") + ":", track
                );

                if (track.kind === types.audio) {
                    Janus.log("We don't expect audio tracks here")
                    return
                }

                // Find feed by track mid
                const feedId = Object.keys(feed.current).find(feedId => {
                    return feedId !== self.current.id && feed.current[feedId][track.kind]?.mid === mid
                })

                if (feedId) {
                    // Check mute/unmute on screen sharing
                    if (feedId === presenter.current && metadata && (metadata.reason === "mute" || metadata.reason === "unmute")) {
                        Janus.log("Ignoring mute/unmute on screen-sharing track.")
                        return
                    }

                    if (!on) {
                        if (!feed.current[feedId][types.video].ended) {
                            clearWebMediaPlayer(feedId)
                        }
                    } else {
                        // Check if we've been already here
                        if (feed.current[feedId][track.kind].stream) {
                            return
                        }

                        // Create stream from track
                        const stream = new MediaStream([track])

                        // Attach media stream
                        Janus.attachMediaStream(feed.current[feedId][track.kind].node, stream)

                        // Play video
                        feed.current[feedId][track.kind].node.play()

                        // Update feed
                        feed.current[feedId][track.kind] = {
                            ...feed.current[feedId][track.kind],
                            track: track,
                            stream: stream,
                        }

                        // Track's not ended
                        if (feed.current[feedId][track.kind].ended) {
                            delete feed.current[feedId][track.kind].ended
                        }
                    }
                }
            },
            oncleanup: () => {
                Janus.log(" ::: Got a cleanup notification (remote feed) :::");
            }
        })
    }

    /**
     * Handle incoming subscriptions
     * @param sources sources to handle
     * @param update update subscription or create new ones
     */
    const handleSubscriptions = (sources, update) => {
        Janus.log('handle subscriptions', sources, update)

        let subscribeTo = [], unsubscribeFrom = []

        sources.forEach(streams => {
            streams.forEach(stream => {
                // Don't subscribe to own streams
                if (isPublisher.self(stream) || isPublisher.selfPresenter(stream)) {
                    return
                }

                if (stream.disabled) {
                    Janus.log("Disabled stream", stream)

                    if (update) {
                        unsubscribeFrom.push({
                            feed: stream.id,
                            mid: stream.mid
                        })

                        if (roomState.current.subscriptions[stream.id][stream.mid]) {
                            delete roomState.current.subscriptions[stream.id][stream.mid]
                        }
                    }
                    return
                }

                if (roomState.current.subscriptions[stream.id] && roomState.current.subscriptions[stream.id][stream.mid]) {
                    Janus.log("Already subscribed to stream, skipping:", stream);
                    return
                }

                if (!roomState.current.subscriptions[stream.id]) {
                    roomState.current.subscriptions[stream.id] = {}
                }
                roomState.current.subscriptions[stream.id][stream.mid] = true

                subscribeTo.push({
                    feed: stream.id,
                    mid: stream.mid
                })
            })
        })

        if (update) {
            if (subscribeTo.length > 0 || unsubscribeFrom.length > 0) {
                const update = {request: requests.update}

                if (subscribeTo.length > 0) {
                    update.subscribe = subscribeTo
                }

                if (unsubscribeFrom.length > 0) {
                    update.unsubscribe = unsubscribeFrom
                }

                plugin.current.subscriber.send({
                    message: update
                })
            } else {
                roomState.current.subscribing = false
            }

            return
        }

        // If nothing to subscribe to
        if (subscribeTo.length === 0) {
            roomState.current.subscribing = false
            return
        }

        plugin.current.subscriber.send({
            message: {
                request: requests.join,
                room: self.current.room,
                ptype: "subscriber",
                streams: subscribeTo,
                use_msid: false, // todo
                private_id: self.current.private_id
            }
        })
    }

    /**
     * Subscribe to sources
     * @param sources sources to subscribe
     */
    function subscribeTo(sources) {
        Janus.log('Subscribe to', sources)

        // If we're subscribing now - do not subscribe, wait
        if (roomState.current.subscribing) {
            Janus.log('Not subscribing, wait')

            setTimeout(() => {
                subscribeTo(sources)
            }, 500)

            return
        }

        // Start subscribing
        roomState.current.subscribing = true

        // If we already have a subscriber plugin
        if (plugin.current.subscriber !== null) {
            handleSubscriptions(sources, roomState.current.sub_joined)
            return
        }

        console.log('attach sub')
        // If we don't have a subscriber plugin yet
        attachSubscriberPlugin(() => handleSubscriptions(sources, roomState.current.sub_joined))
    }

    /**
     * Unsubscribe from
     * @param feeds feed or feeds to unsubscribe
     * @param remove remove publisher from publishers list or not
     */
    function unsubscribeFrom(feeds, remove = false) {
        // Don't unsubscribe if we're unsubscribing
        if (roomState.current.unsubscribing) {
            setTimeout(() => unsubscribeFrom(feeds, remove), 300)
            return
        }

        // Start unsubscribing
        roomState.current.unsubscribing = true

        // Attach plugin if is not attached
        if (plugin.current.subscriber !== null) {
            handleUnsubscriptions(feeds, remove)
            return
        }

        attachSubscriberPlugin(() => handleUnsubscriptions(feeds, remove))
    }

    /**
     * Handle unsubscriptions
     * @param feeds feeds to unsubscribe from
     * @param remove remove feed from publishers list or not
     */
    function handleUnsubscriptions(feeds, remove) {
        if (!Array.isArray(feeds)) {
            feeds = [feeds]
        }

        // Don't unsubscribe from own streams
        feeds = feeds.filter(feed_id => isPublisher.notSelf({id: feed_id}))

        // If publishers by given feeds exist
        if (roomState.current.publishers.filter(pub => feeds.includes(pub.id)).length > 0) {
            // Get rid of publishers
            if (remove) {
                // Remove publishers
                roomState.current.publishers = roomState.current.publishers.filter(pub => !feeds.includes(pub.id))

                // Update state
                setPublishers([...roomState.current.publishers])
            }

            const subscriptions = feeds.filter(feed_id => {
                // Clear feed
                if (remove && !!feed.current[feed_id]) {
                    clearWebMediaPlayer(feed_id)
                    delete feed.current[feed_id]
                }
                // Check subscription
                if (Object.hasOwn(roomState.current.subscriptions, feed_id)) {
                    // Clear subscription
                    delete roomState.current.subscriptions[feed_id]

                    return true
                }
                return false
            })

            // If subscriptions are present - unsubscribe
            if (subscriptions.length > 0) {
                plugin.current.subscriber.send({
                    message: {
                        request: requests.unsubscribe,
                        streams: subscriptions.map(feed_id => ({feed: feed_id}))
                    }
                })
            }
        }

        roomState.current.unsubscribing = false
    }

    /**
     * Handle subscriber message
     * @param message message to handle
     */
    function handleSubscriberMessage(message) {
        const event = message[msg.videoroom]

        switch (event) {
            case events.attached:
                Janus.log("Successfully attached to feed in room " + message[msg.room]);
                roomState.current.subscribing = false
                roomState.current.sub_joined = true
                break
            case events.updated:
                Janus.log("Successfully updated in room " + message[msg.room]);
                roomState.current.subscribing = false
                break;
            case event:
                // simulcast
                break
        }

        if (message[msg.streams]) {
            let feedId

            message[msg.streams].forEach(stream => {
                // We don't expect audio stream here
                if (stream.type === types.audio) {
                    return
                }

                feedId = stream.feed_id

                if (feed.current[feedId]) {
                    feed.current[feedId][stream.type] = {
                        ...feed.current[feedId][stream.type],
                        mid: stream.mid
                    }
                }
            })
        }
    }

    return {
        subscribeTo: subscribeTo,
        unsubscribeFrom: unsubscribeFrom,
    }
}