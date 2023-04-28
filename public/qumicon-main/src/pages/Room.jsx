import React, {useContext, useEffect, useState} from "react";
import {Button, Col, Divider, Input, Layout, Pagination, Row, Space, Tabs, Tooltip} from "antd";
import {RoomContext} from "../contexts/RoomContext.js";
import {JanusContext} from "../contexts/JanusContext.js";
import {useJanusConsts} from "../hooks/janus-consts.hook.js";
import {useJanusFunctions} from "../hooks/janus-functions.hook.js";
import {SendOutlined} from "@ant-design/icons";
import {useHubMethod} from "../hooks/hub-method.js";
import {useClientMethod} from "../hooks/hub-client-method.hook.js";
import {AuthContext} from "../contexts/AuthContext.js";
import {useRoomConsts} from "../hooks/room-consts.hook.js";
import {useShareRoom} from "../hooks/share-room.hook.jsx";
import {useHubConsts} from "../hooks/hub-consts.hook.js";
import {useJanusScreenSharing} from "../hooks/janus-screensharing.hook.js";
import Janus from "../utils/janus.js";
import {useJanusSubscriber} from "../hooks/janus-subscriber.hook.js";

const transition = 500
const on_slide = 8

export default function Room() {
    const {feed, plugin, presenter} = useContext(JanusContext)
    const {room, setRoom, publishers, muted, self, setMuted, setPublishers, roomState} = useContext(RoomContext)
    const {userStateIs, userStates, userState, setUserState, userName} = useContext(AuthContext)

    const {FLOAT_VIDEO, types, feedStatus, mixedAudio} = useJanusConsts()
    const {mode} = useRoomConsts()
    const {hubMethods, clientMethods} = useHubConsts()
    const {
        joinVideoRoom,
        leaveRoom,
        handleOwnFeed,
        toggleAudio,
        clearWebMediaPlayer,
        provideMediaRef,
        isPublisher
    } = useJanusFunctions()
    const {ShareRoomModal, setShareModalOpen, shareModalOpen} = useShareRoom()
    const {startScreenSharing, stopScreenSharing} = useJanusScreenSharing()
    const {subscribeTo, unsubscribeFrom} = useJanusSubscriber()

    const {invoke: sendMessage} = useHubMethod(hubMethods.sendMessage)

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState("")
    const [screenPresenter, setScreenPresenter] = useState(null)
    const [activeSlide, setActiveSlide] = useState(1)
    const [canSlide, setCanSlide] = useState(true)

    const joinerDisplay = self.current?.display
    const selfScreenSharing = isPublisher.selfPresenter({id: screenPresenter}) || isPublisher.self({id: screenPresenter})
    const canShareScreen = isPublisher.notSelfPresenter({id: screenPresenter}) && isPublisher.notSelf({id: screenPresenter})
    const slides = [...Array(Math.floor((publishers.length - 1) / on_slide) + 1).keys()].map(key => key + 1)

    const constraints = new function () {
        this.header = 64
        this.footer = 64
        this.row_gutter = 12
        this.pip = 32
        this.controls = publishers.length > on_slide ? this.pip / 2 + 2 * this.row_gutter : 3 * this.row_gutter / 2
        this.slide = `calc(100% - ${this.header + this.footer + this.row_gutter + this.pip}px)`
        this.publisher_div = `calc(50vh - ${this.footer / 2 + this.header / 2 + this.controls}px)`
        this.publisher_video = `calc(100% - ${this.row_gutter}px)`
    }

    // Receive message from chat
    useClientMethod(clientMethods.receiveMessage, (message, sender) => {
        setMessages([...messages, {text: message, sender}])
    })

    // Update screen sharing publisher
    useClientMethod(clientMethods.UpdateScreenSharingPublisher, (publisherId = null) => {
        presenter.current = publisherId
        setScreenPresenter(publisherId)
    })

    /**
     * Send message to the chat
     */
    function sendMessageHandler() {
        if (message !== "") {
            sendMessage(message, joinerDisplay, String(room.id))
            setMessage("")
        }
    }

    /**
     * Leave the room
     */
    function leave() {
        setUserState(userStates.leaving)

        if (plugin.current.publisher && plugin.current.audiobridge) {
            leaveRoom()
        } else {
            setRoom(null)
        }
    }

    /**
     * Get publishers on given slide
     * @param slide slide to get publishers on
     * @returns {*[]} publishers on slide
     */
    function publishersOnSlide(slide) {
        return roomState.current.publishers.filter((pub, index) => index >= (slide - 1) * on_slide && index < (slide - 1) * on_slide + on_slide)
    }

    /**
     * Mute toggle handler
     * @param type type of stream to mute
     * @returns {(function(): void)|*}
     */
    function muteToggleHandler(type) {
        return function () {
            // If type is video or screen - mute/unmute via peer connection
            if ([types.video, types.screen].includes(type)) {
                const status = feed.current[self.current.id][type].status

                if (status === feedStatus.absent || status === feedStatus.added) {
                    setMuted(
                        {
                            ...muted,
                            [type]: !muted[type]
                        },
                        () => handleOwnFeed(type, status === feedStatus.absent)
                    )
                }
            } else if (type === types.audio) {
                // If type is audio - mute/unmute by configuring
                const mtd = {
                    ...muted,
                    [types.audio]: !muted[types.audio]
                }
                setMuted(mtd, () => toggleAudio(mtd[types.audio]))
            }
        }
    }

    /**
     * Unsubscribe from publishers on given activeSlide
     * @param slide activeSlide
     * @param timeout time to wait before starting unsubscribing
     */
    function unsubscribeFromSlide(slide, timeout) {
        const toUnsubscribe = publishersOnSlide(slide)
            .filter(publisher => isPublisher.notSelf(publisher) && isPublisher.notSelfPresenter(publisher))
            .map(pub => pub.id)

        // We use timeout here because HYPOTHETICALLY
        // subscriber plugin may be not created at the moment
        // and if subscribing and unsubscribing start together -
        // two subscriber plugins may be created
        // We need only one, so we need to wait a bit
        if (toUnsubscribe.length > 0) {
            setTimeout(() => {
                unsubscribeFrom(toUnsubscribe)
            }, timeout)
        }
    }

    /**
     * Go to the previous activeSlide from given activeSlide
     * @param from slide to go from
     * @param to slide to go to
     */
    function prevSlide(from, to) {
        // Disable sliding
        // We use mutable variable here because callback inside setTimeout below
        // takes value of canSlide at the moment setTimeout is actually called
        // This means that if canSlide state is "false" at the moment setTimeout is called -
        // it will be "false" inside its callback and won't be changed
        if (canSlide || roomState.current.canSlide) {
            setCanSlide(false)
            roomState.current.canSlide = false
        }

        const curr = document.getElementById('slide-' + from)

        // Move current activeSlide to the right
        // Slide may not exist in case there's no more publishers on the slide
        if (curr) {
            curr.classList.remove('translate-x-0')
            curr.classList.add('translate-x-full')
        }

        // Move slides between to the 2 steps right
        // Slides may not exist as well
        // Use "hidden" class to prevent blinking while transition
        let tab
        let between = []
        for (let i = from - 1; i > to; i--) {
            tab = document.getElementById('slide-' + i)
            if (tab) {
                tab.classList.remove('-translate-x-full')
                tab.classList.add('translate-x-full', 'hidden')
                between.push(i)
            }
        }

        // Move target slide to the right
        const target = document.getElementById('slide-' + to)
        target.classList.remove('-translate-x-full')
        target.classList.add('translate-x-0')

        // After transition is done
        setTimeout(() => {
            // Show between slides if exist
            between.forEach(index => {
                tab = document.getElementById('slide-' + index)
                if (tab) {
                    tab.classList.remove('hidden')
                }
            })

            // Publishers on target activeSlide
            const onSlide = publishersOnSlide(to)

            // Special case #4
            // If after transition there's no more publishers on slide we just moved to, that means:
            // 1. target <div> does not exist anymore
            // 2. we need to go the previous available slide one more time
            // 3. do not change subscriptions
            if (onSlide.length === 0) {
                for (let i = to - 1; i >= 1; i--) {
                    if (publishersOnSlide(i).length !== 0) {
                        prevSlide(to, i)
                        return
                    }
                }

                // Should NEVER happen!
                window.location.reload()
                return
            }

            // Publishers to subscribe on the slide we just moved to
            // 1. don't subscribe to the self
            // 2. don't subscribe to the self screen sharing
            // 3. don't subscribe if there are no streams - dummy or test publishers
            const toSubscribe = onSlide
                .filter(pub => isPublisher.notSelf(pub) && isPublisher.notSelfPresenter(pub))
                .map(pub => pub.streams)

            let timeout = 0

            // If we're going to subscribe and unsubscribe - need to wait between the operations
            if (toSubscribe.length > 0) {
                subscribeTo(toSubscribe)
                timeout = transition / 2
            }

            // If current slide exists - unsubscribe from the publishers on it
            if (curr) {
                unsubscribeFromSlide(from, timeout)
            }

            // Special case #3
            // If we did not actually change slide
            // That means this function was called from nextSlide() (setActiveSlide was not called there)
            // nextSlide() ------------timeout-----------> prevSlide()
            //             no more users on target slide
            // If activeSlide === targetSlide
            //     => state won't be changed
            //     => useEffect(() => {...}, [activeSlide]) won't be triggered
            // So just trigger it by hand
            if (activeSlide === to) {
                activeSlideTriggered()
            } else {
                setActiveSlide(to)
            }
        }, transition)
    }

    /**
     * Go to the next slide
     * @param to slide to go
     */
    function nextSlide(to) {
        // Disable sliding
        setCanSlide(false)
        roomState.current.canSlide = false

        // Move current activeSlide to the left
        const curr = document.getElementById('slide-' + activeSlide)
        curr.classList.remove('translate-x-0')
        curr.classList.add('-translate-x-full')

        // Move between slides to 2 steps left
        // Use "hidden" class to prevent blinking while transition
        let tab
        let between = []
        for (let i = activeSlide + 1; i < to; i++) {
            tab = document.getElementById('slide-' + i)
            if (tab) {
                tab.classList.remove('translate-x-full')
                tab.classList.add('-translate-x-full', 'hidden')
                between.push(i)
            }
        }

        // Move target slide to the left
        const target = document.getElementById('slide-' + to)
        target.classList.remove('translate-x-full')
        target.classList.add('translate-x-0')

        // After transition is done
        setTimeout(() => {
            // Show between slides
            between.forEach(index => {
                tab = document.getElementById('slide-' + index)
                if (tab) {
                    tab.classList.remove('hidden')
                }
            })

            // Get publishers on the next activeSlide
            const onSlide = publishersOnSlide(to)

            // Special case #3
            // If there are no more publishers on the slide we just moved to, that means:
            // 1. target div does not exist anymore
            // 2. we need to go to the previous available (that has publishers) slide
            // 3. don't change subscriptions
            if (onSlide.length === 0) {
                for (let i = to - 1; i >= 1; i--) {
                    if (publishersOnSlide(i).length !== 0) {
                        prevSlide(to, i)
                        return
                    }
                }

                // Should NEVER happen!
                window.location.reload()
                return
            }

            // Subscribe to publishers on the target slide
            // 1. don't subscribe to self
            // 2. don't subscribe to self screen sharing
            // 3. don't subscribe if there are no streams - dummy or test publishers
            const toSubscribe = onSlide
                .filter(pub => isPublisher.notSelf(pub) && isPublisher.notSelfPresenter(pub))
                .map(pub => pub.streams)

            let timeout = 0

            // If we're going to subscribe and unsubscribe - need to wait between the actions
            if (toSubscribe.length > 0) {
                subscribeTo(toSubscribe)
                timeout = transition / 2
            }

            // Unsubscribe from publishers on current activeSlide
            unsubscribeFromSlide(activeSlide, timeout)

            setActiveSlide(to)
        }, transition)
    }

    /**
     * If active slide changed (or not really)
     */
    function activeSlideTriggered() {
        // Only if we actually toggled slides
        if (!roomState.current.canSlide || !canSlide) {
            // Update sliding state
            const updateSliding = function () {
                setCanSlide(true)
                roomState.current.canSlide = true
            }

            // Only if we actually changed slides
            if (roomState.current.slide !== activeSlide) {
                // We use timeout here because nodes for video elements must be provided
                setTimeout(() => {
                    // Clear WebMediaPlayers of publishers on the slide we came from
                    publishersOnSlide(roomState.current.slide)
                        .filter(publisher => !!feed.current[publisher.id])
                        .forEach(publisher => clearWebMediaPlayer(
                            publisher.id,
                            types.video,
                            isPublisher.notSelf(publisher) && isPublisher.notSelfPresenter(publisher)
                        ))

                    // SPECIAL CASE #1
                    // If we got a special case (see useEffect above)
                    // We need to get publishers on the slide that we're subscribed to
                    // Their WebMediaPlayers were unlinked before (see useEffect above)
                    // So we need to reattach streams to new video nodes
                    //
                    // 1. get publishers on current slide
                    // 2. for each of them
                    // 2.1. if publisher has video node and stream (means we're subscribed to him)
                    // 2.2. if his video is paused
                    //      (it happens when we're on the activeSlide > 0 (N) and there's only one publisher (P), and we're subscribed to him.
                    //      Then publisher on the one of the previous slides left and P moves from activeSlide N to N-1.
                    //      On start moving his presentation (card) changes from <video> to <> and after he moved from <> to <video> again:
                    //      <video> -> < > -> <video>
                    //         A   ->   D   ->   B
                    //      Here we get the situation:
                    //      - video and WebMediaPlayer are paused
                    //      - ref A is linked with paused WebMediaPlayer
                    //      - after P moved ref-B replaces ref-A
                    //      - they both point to the same <video> tag but WebMediaPlayer is linked with ref (not tag)
                    //      - so we have no more access to the WebMediaPlayer by ref A
                    //      - WebMediaPlayer stays on pause and won't be destroyed until page is reload
                    //      )
                    // 3. reattach stream and play it
                    if (roomState.current.slide > activeSlide) {
                        publishersOnSlide(activeSlide).forEach(publisher => {
                            if (feed.current[publisher.id]?.[types.video]?.node
                                && feed.current[publisher.id]?.[types.video].stream
                                && feed.current[publisher.id][types.video].node.paused
                            ) {
                                Janus.attachMediaStream(
                                    feed.current[publisher.id][types.video].node,
                                    feed.current[publisher.id][types.video].stream
                                )
                                feed.current[publisher.id][types.video].node.play()
                            }
                        })
                    }

                    roomState.current.slide = activeSlide

                    updateSliding()
                }, transition / 2)
            } else {
                updateSliding()
            }
        }
    }

    /**
     * Update UI and subscriptions depends on publishers state
     */
    useEffect(() => {
        // If publishers were changed while sliding - do nothing
        // let activeSlide functions (nextSlide, prevSlide) handle it
        if (!canSlide || !roomState.current.canSlide) {
            return
        }

        // Get publishers on current activeSlide
        const onSlide = publishersOnSlide(activeSlide)

        // SPECIAL CASE #1
        // (See above useEffect for an explanation)
        //
        // We're on slide > 1
        // Publishers have changed and there are no one of them on the slide
        // 1. get publishers on the previous slide that we're subscribed to
        // 2. for each of them we need to unlink video element from stream
        // 3. stream will be reattached in the future (see useEffect above)
        // 4. go to the previous available slide
        if (activeSlide > 1 && onSlide.length === 0) {
            let onPrevSlide
            for (let i = activeSlide - 1; i >= 1; i--) {
                onPrevSlide = publishersOnSlide(i)
                if (onPrevSlide.length > 0) {
                    onPrevSlide
                        .filter(pub => isPublisher.self(pub)
                            || isPublisher.selfPresenter(pub)
                            || Object.keys(roomState.current.subscriptions[pub.id] || {}).length === pub.streams?.length
                            || pub.streams?.length > 0
                        )
                        .forEach(pub => {
                            if (feed.current[pub.id]?.[types.video]?.node) {
                                feed.current[pub.id][types.video].node.onended()
                            }
                        })

                    prevSlide(activeSlide, i)
                    return
                }
            }

            // Should NEVER happen!
            window.location.reload()
            return
        }

        // Special case #2
        // If we're on the 1st slide and publishers have changed
        // We take publishers on the 2nd slide and check if we're subscribed to them
        // If we do - that means that self screen sharing was added and these publishers were shifted
        // (because self screen sharing is always added at the 2nd slot right after self video)
        // In such case we need to unsubscribe from them and clear their WebMediaPlayers
        if (activeSlide === 1) {
            const subToOnNextSlide = publishersOnSlide(activeSlide + 1)
                .filter(pub => Object.keys(roomState.current.subscriptions[pub.id] || {}).length === pub.streams?.length
                    && pub.streams?.length > 0
                )
                .map(pub => {
                    clearWebMediaPlayer(pub.id)

                    return pub.id
                })

            if (subToOnNextSlide.length > 0) {
                unsubscribeFrom(subToOnNextSlide)
            }
        }

        // Just regular subscribing to publishers on current slide:
        // 2. not self and not self screen sharing
        // 3. that we are not subscribed to yet
        // 4. have streams
        const pubs = onSlide
            .filter(pub => isPublisher.notSelf(pub)
                && isPublisher.notSelfPresenter(pub)
                && Object.keys(roomState.current.subscriptions[pub.id] || {}).length !== pub.streams.length
            )

        if (pubs.length > 0) {
            subscribeTo(
                pubs.map(pub => pub.streams)
            )
        }
    }, [publishers])

    /**
     * Update feeds and WebMediaPlayers depends on activeSlide
     */
    useEffect(() => {
        activeSlideTriggered()
    }, [activeSlide])

    /**
     * Join room depends on room and userState
     */
    useEffect(() => {
        // If we have room and user is about to join
        if (room && userStateIs(userStates.joining)) {
            let display = joinerDisplay

            // Get display for user
            if (!self.current?.display) {
                self.current = {
                    ...self.current,
                    display: userName,
                }
                display = userName
            }
            joinVideoRoom(String(room.id), display)
        }
    }, [room, userState])

    return (
        <>
            <ShareRoomModal/>
            <Layout className="h-full">

                {/* HEADER */}
                <Layout.Header className="flex" style={{height: constraints.header}}>
                    <Space className="w-full">
                        <div className="flex justify-between w-full">
                            <div className="text-white text-lg">{room?.description}</div>
                            <div className="text-white text-lg">{joinerDisplay}</div>
                        </div>
                    </Space>
                </Layout.Header>

                {/* MAIN */}
                <Layout className="w-full h-full">
                    <Layout.Content className="h-full w-full">
                        {slides.map(slide => {
                            return <div
                                id={`slide-${slide}`}
                                style={{height: constraints.slide, padding: constraints.row_gutter}}
                                className={`w-full absolute transition-all ease-in-out duration-${transition} transform `
                                    + (slide === activeSlide
                                            ? "translate-x-0"
                                            : slide < activeSlide
                                                ? "-translate-x-full"
                                                : "translate-x-full"
                                    )
                                }
                            >
                                <Row gutter={[constraints.row_gutter, constraints.row_gutter]}>
                                    {publishersOnSlide(slide).map(publisher => <Col
                                        key={publisher.id}
                                        span={24 / on_slide * 2}
                                    >
                                        <div
                                            style={{height: constraints.publisher_div}}
                                            className="bg-black w-full rounded-xl"
                                        >
                                            {slide === activeSlide && <video
                                                style={{width: constraints.publisher_video}}
                                                playsInline
                                                id={"remote-" + publisher.id}
                                                className="absolute bg-black w-full h-full rounded-xl"
                                                ref={instance => {
                                                    return provideMediaRef(publisher.id, types.video, instance)
                                                }}
                                            />}
                                            <span className="text-white absolute right-6 bottom-3 text-lg">
                                                {publisher.display}
                                            </span>
                                        </div>
                                    </Col>)}
                                </Row>
                            </div>
                        })}

                        {/* FLOAT VIDEO ELEMENT */}
                        {/*{joiner.current.mode === mode.publisher && <>*/}
                        {/*    <Moveable*/}
                        {/*        target={document.querySelector('#' + FLOAT_VIDEO)}*/}
                        {/*        origin={false}*/}
                        {/*        container={null}*/}
                        {/*        throttleDrag={0}*/}
                        {/*        draggable={true}*/}
                        {/*        onDrag={props => {*/}
                        {/*            props.target.style.transform = props.transform*/}
                        {/*        }}*/}
                        {/*        style={{background: "transparent"}}*/}
                        {/*        scalable={true}*/}
                        {/*        throttleScale={0}*/}
                        {/*        edge={["nw", "ne", "sw", "se"]}*/}
                        {/*        onScale={props => {*/}
                        {/*            props.target.style.transform = props.transform*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*    </Moveable>*/}
                        {/*    <FloatVideo id={FLOAT_VIDEO} provideMediaRef={provideMediaRef} muted={muted.video}/>*/}
                        {/*</>}*/}

                        {/* MIXED AUDIO */}
                        {<audio
                            autoPlay
                            ref={instance => provideMediaRef(mixedAudio, types.audio, instance)}
                            id={"mixed-audio"}
                            className="hidden"
                        />}

                        {/* PAGINATION */}
                        {publishers.length > on_slide && <div className="relative w-full h-full">
                            <div
                                className="absolute w-full text-center"
                                style={{bottom: constraints.row_gutter, height: constraints.pip}}
                            >
                                <Pagination
                                    disabled={!canSlide}
                                    current={activeSlide}
                                    defaultPageSize={on_slide}
                                    defaultCurrent={activeSlide}
                                    total={publishers.length}
                                    onChange={(page, pageSize) => {
                                        console.log(page)
                                        if (page !== activeSlide) {
                                            if (page > activeSlide) {
                                                nextSlide(page)
                                            } else {
                                                prevSlide(activeSlide, page)
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>}
                    </Layout.Content>

                    {/* CHAT */}
                    <Layout.Sider
                        theme="light"
                        width={500}
                        trigger={null}
                        collapsible
                        collapsedWidth={0}
                        collapsed={!sidebarOpen}
                    >
                        <div className="p-5 flex flex-col h-full">
                            <Tabs
                                className="tabs-full-height h-full"
                                type="card"
                                centered
                                items={[{
                                    className: "tab-pane-full-height",
                                    label: "Chat",
                                    key: "chat",
                                    children: <>
                                        <div className="grow overflow-auto">
                                            {messages.map((message, index) => (
                                                <div key={"message-" + index} className="mb-3">
                                                    <div className="font-bold">{message.sender}</div>
                                                    <div className="whitespace-pre-line">{message.text}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <Divider className="grow-0"/>
                                        <div className="grow-0 bottom-0">
                                            <Input.Group>
                                                <Input.TextArea
                                                    value={message}
                                                    onChange={event => setMessage(event.target.value)}
                                                    id="local-message"
                                                    style={{width: 'calc(100% - 50px)'}}
                                                    placeholder="Message"
                                                    autoSize={{minRows: 1, maxRows: 8}}
                                                />
                                                <Tooltip placement="topRight" title="Send">
                                                    <Button
                                                        onClick={sendMessageHandler}
                                                        style={{width: 50}}
                                                        className="border-0"
                                                        type="link"
                                                        icon={<SendOutlined/>}
                                                    />
                                                </Tooltip>
                                            </Input.Group>
                                        </div>
                                    </>
                                }]}
                            />
                        </div>
                    </Layout.Sider>
                </Layout>

                {/* FOOTER */}
                <Layout.Footer className="h-16 flex bg-blue-100">
                    <Space className="w-full">
                        <div className="flex justify-between w-full">

                            {/* SHARE */}
                            <div>
                                <Button
                                    type="default"
                                    onClick={() => setShareModalOpen(!shareModalOpen)}
                                >
                                    Share
                                </Button>
                            </div>

                            {/* CONTROLS */}
                            <div>
                                {self.current.mode === mode.publisher && <Space>
                                    <Button
                                        onClick={() => {
                                            const pubs = [...publishers, {
                                                id: Janus.randomString(10),
                                                display: 'dummy',
                                                streams: []
                                            }]
                                            setPublishers(pubs)
                                            roomState.current.publishers = pubs
                                        }}
                                        type="primary"
                                    >
                                        ADD
                                    </Button>

                                    {/* VIDEO */}
                                    <Button
                                        onClick={muteToggleHandler(types.video)}
                                        type="primary"
                                    >
                                        {muted.video ? "No video" : "Video"}
                                    </Button>

                                    {/* AUDIO */}
                                    <Button
                                        onClick={muteToggleHandler(types.audio)}
                                        type="primary"
                                    >
                                        {muted.audio ? "No audio" : "Audio"}
                                    </Button>

                                    {/* SCREEN SHARING */}
                                    {canShareScreen && <Tooltip title={!!screenPresenter && "You're late"}>
                                        <Button
                                            type="primary"
                                            disabled={!!screenPresenter}
                                            onClick={startScreenSharing}
                                        >
                                            Share screen
                                        </Button>
                                    </Tooltip>}
                                    {selfScreenSharing && <Button
                                        disabled={screenPresenter === self.current.id}
                                        type="primary"
                                        onClick={stopScreenSharing}
                                    >
                                        Stop sharing
                                    </Button>}

                                    {/* LEAVE */}
                                    <Button onClick={leave} type="primary" danger>Leave</Button>
                                </Space>}
                            </div>

                            {/* OPEN CHAT */}
                            <div>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        const video = document.getElementById(FLOAT_VIDEO)
                                        if (video) {
                                            if (sidebarOpen) {
                                                video.style.transform = "translateX(0px)"
                                            } else {
                                                video.style.transform = "translateX(-500px)"
                                            }
                                        }
                                        setSidebarOpen(!sidebarOpen)
                                    }}
                                >
                                    Chat
                                </Button>
                            </div>
                        </div>
                    </Space>
                </Layout.Footer>
            </Layout>
        </>
    );
}