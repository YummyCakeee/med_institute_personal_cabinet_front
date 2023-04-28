import React, {useEffect, useState} from 'react'
import './App.css'
import Janus from "./utils/janus.js";
import {Button, Drawer, FloatButton, Space} from "antd";
import {JanusContext} from "./contexts/JanusContext.js";
import Rooms from "./pages/Rooms.jsx";
import Room from "./pages/Room.jsx";
import {RoomContext} from "./contexts/RoomContext.js";
import {useJanus} from "./hooks/janus.hook.js";
import {useRoom} from "./hooks/room.hook.js";
import CreateOrEditRoom from "./pages/CreateOrEditRoom.jsx";
import {HubContext} from "./contexts/HubContext.js";
import {useHub} from "./hooks/hub.hook.js";
import {useApi} from "./hooks/api.hook.js";
import {useAuth} from "./hooks/auth.hook.js";
import {AuthContext} from "./contexts/AuthContext.js";
import JoinRoom from "./pages/JoinRoom.jsx";

const search = {
    videoroom: "videoroom",
    room: 'room',
    mode: 'mode'
}

function Application() {
    const {janus, plugin, feed, presenter, createSession, setJanusDefaults} = useJanus()
    const {hubConnection, hubConnectionState, initHubConnection} = useHub()
    const {getUserInfo} = useApi()

    const searchParams = new URLSearchParams(document.location.search)

    const [mainDrawerOpen, setMainDrawerOpen] = useState(false)

    const {
        room,
        setRoom,
        publishers,
        setPublishers,
        muted,
        setMuted,
        self,
        roomState,
        shareLink,
        clearRoom
    } = useRoom()

    const {hasAuth, user, setUser, isAdmin, userState, userStates, setUserState, userName, userStateIs} = useAuth()

    const userOrNoAuth = user || !hasAuth

    /**
     * Init Janus
     */
    function initJanus() {
        Janus.init({
            debug: true,
            callback: createSession
        })
    }

    /**
     * Init SignalR hub
     */
    function initSignalRHub() {
        initHubConnection()
    }

    /**
     * Toggle main drawer
     */
    function toggleMainDrawer() {
        setMainDrawerOpen(!mainDrawerOpen)
    }

    /**
     * After leaving the room
     */
    function afterLeavingRoom() {
        // If we were joined by link
        if (searchParams.has(search.room)) {
            searchParams.delete(search.room)
            searchParams.delete(search.mode)
            searchParams.delete(search.videoroom)

            if (userOrNoAuth) {
                searchParams.append(search.videoroom, 'true')
            }

            document.location.search = searchParams.toString()
        }

        // Regular using
        if (userOrNoAuth && userStateIs(userStates.left) && !janus.current) {
            createSession(() => {
                setUserState(userStates.rooms)
            })
        }
    }

    /**
     * Open create room drawer
     */
    function createOrEditRoom() {
        setUserState(userStates.creating)
    }

    /**
     * Cancel creating or editing room
     */
    function cancelCreateOrEditRoom() {
        setUserState(userStates.rooms, function () {
            if (room) {
                setRoom(null)
            }
        })
    }

    useEffect(() => {
        if (mainDrawerOpen && !janus.current && !hubConnection) {
            initSignalRHub()
            initJanus()
        }
    }, [mainDrawerOpen])

    useEffect(() => {
        if (searchParams.has(search.videoroom)) {
            toggleMainDrawer()
        }

        // If we are joining room by the link
        if (searchParams.has(search.room)) {
            setUserState(userStates.joiningByLink, () => {
                getUserInfo().then(response => {
                    if (response.status === 200) {
                        setUser(response.data.user)
                    }
                })
                if (!searchParams.has(search.videoroom)) {
                    toggleMainDrawer()
                }
            })
            return
        }

        if (hasAuth) {
            // If we just open the site
            // Check if we are already logged in
            getUserInfo().then(response => {
                console.log('response', response)

                // We are logged in
                if (response.status === 200) {
                    setUser(response.data.user)
                    setUserState(userStates.rooms)
                }
            })
        } else {
            setUserState(userStates.rooms)
        }
    }, [])

    return (
        <>
            {/* Show the button if we're logged in */}
            {userOrNoAuth && <FloatButton type="primary" onClick={toggleMainDrawer} shape={"circle"}>
                VideoRoom
            </FloatButton>}

            <HubContext.Provider value={{hubConnection, hubConnectionState}}>
                <AuthContext.Provider
                    value={{hasAuth, user, setUser, isAdmin, userState, userStates, setUserState, userName, userStateIs}}>
                    <JanusContext.Provider value={{janus, plugin, feed, presenter, setJanusDefaults}}>
                        <RoomContext.Provider value={{
                            room,
                            setRoom,
                            publishers,
                            setPublishers,
                            self,
                            muted,
                            setMuted,
                            roomState,
                            shareLink,
                            clearRoom
                        }}>
                            {/* MAIN DRAWER */}
                            <Drawer
                                width="100%"
                                placement="right"
                                title={userName}
                                open={mainDrawerOpen}
                                onClose={() => setMainDrawerOpen(false)}
                                extra={isAdmin && <Space>
                                    <Button onClick={createOrEditRoom} type="primary">Create room</Button>
                                </Space>}
                            >
                                {/* JOIN BY LINK */}
                                {userStateIs(userStates.joiningByLink, userStates.joinNoAuth) && <JoinRoom search={search}/>}

                                {/* ROOMS */}
                                {userOrNoAuth && <Rooms/>}

                                {/* CREATE OR EDIT ROOM */}
                                {isAdmin && <Drawer
                                    title={userState === userStates.creating ? "Create room" : "Edit room"}
                                    destroyOnClose
                                    onClose={cancelCreateOrEditRoom}
                                    width={350}
                                    placement="right"
                                    open={(!room && userStateIs(userStates.creating)) || (userStateIs(userStates.editing) && !!room)}
                                >
                                    <CreateOrEditRoom/>
                                </Drawer>}

                                {/* ROOM */}
                                <Drawer
                                    width="100%"
                                    destroyOnClose
                                    afterOpenChange={open => {
                                        if (!open) {
                                            afterLeavingRoom()
                                        }
                                    }}
                                    placement="right"
                                    closable={false}
                                    open={room && userStateIs(userStates.joining, userStates.joined, userStates.leaving)}
                                >
                                    <Room/>
                                </Drawer>
                            </Drawer>
                        </RoomContext.Provider>
                    </JanusContext.Provider>
                </AuthContext.Provider>
            </HubContext.Provider>
        </>
    )
}

export default Application
