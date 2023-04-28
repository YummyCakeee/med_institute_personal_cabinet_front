import React, {useContext, useEffect, useState} from 'react'
import {App, Button, Card, Col, Popconfirm, Row, Space} from "antd";
import {JanusContext} from "../contexts/JanusContext";
import {RoomContext} from "../contexts/RoomContext.js";
import {useJanusPublisher} from "../hooks/janus-publisher.hook.js";
import {useJanusFunctions} from "../hooks/janus-functions.hook.js";
import {useHubMethod} from "../hooks/hub-method.js";
import {useClientMethod} from "../hooks/hub-client-method.hook.js";
import {useHubConsts} from "../hooks/hub-consts.hook.js";
import {HubContext} from "../contexts/HubContext.js";
import {HubConnectionState} from "@microsoft/signalr";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {AuthContext} from "../contexts/AuthContext.js";
import {useShareRoom} from "../hooks/share-room.hook.jsx";
import {useRoomConsts} from "../hooks/room-consts.hook.js";
import {useJanusAudioBridge} from "../hooks/janus-audiobridge.hook.js";

export default function Rooms() {
    const {message} = App.useApp()
    const [rooms, setRooms] = useState([])

    const {janus, plugin} = useContext(JanusContext)
    const {setRoom, self} = useContext(RoomContext)
    const {hubConnectionState} = useContext(HubContext)
    const {hasAuth, isAdmin, userState, setUserState, userStates, userStateIs} = useContext(AuthContext)

    const {attachAudioBridgePlugin} = useJanusAudioBridge()
    const {attachPublisherPlugin} = useJanusPublisher()
    const {getRooms, destroyRoom, roomExists} = useJanusFunctions()
    const {clientMethods, hubMethods} = useHubConsts()
    const {mode} = useRoomConsts()
    const {shareModalOpen, setShareModalOpen, setRoomIdToShare, ShareRoomModal} = useShareRoom()
    const {invoke: roomsUpdated} = useHubMethod(hubMethods.roomsUpdated)

    /**
     * Check if room exists and call function if it does
     * @param room room to check
     * @param after function to call if room exists
     */
    function checkRoomExists(room, after) {
        roomExists(room.id, {
            success: data => {
                if (data.exists) {
                    after()
                } else {
                    message.error("Room does not exist")
                }
            },
        })
    }

    /**
     * Join room handler
     * @param room room to join
     * @returns {(function(): void)|*}
     */
    function joinRoomHandler(room) {
        return function () {
            checkRoomExists(room, function () {
                self.current = {
                    ...self.current,
                    mode: mode.publisher
                }
                setUserState(
                    hasAuth ? userStates.joining : userStates.joinNoAuth,
                    function () {
                        setRoom(room)
                    }
                )
            })
        }
    }

    /**
     * Edit room handler
     * @param room room to edit
     * @returns {(function())|*}
     */
    function editRoomHandler(room) {
        return function () {
            checkRoomExists(room, function () {
                setUserState(userStates.editing, function () {
                    setRoom(room)
                })
            })
        }
    }

    /**
     * Destroy room handler
     * @param room room to destroy
     * @returns {(function(): void)|*}
     */
    function destroyRoomHandler(room) {
        return function () {
            checkRoomExists(room, function () {
                destroyRoom(room.id, {
                    success: () => {
                        getRoomsList()
                        roomsUpdated()
                    }
                })
            })
        }
    }

    /**
     * Get rooms list
     */
    function getRoomsList() {
        getRooms({
            success: function (data) {
                console.log('Got list of rooms', data.list)
                const _rooms = data.list.map(room => ({
                    id: room.room,
                    description: room.description,
                    publishers: room.max_publishers,
                    audiolevel_event: room.audiolevel_event,
                    audio_active_packets: room.audio_active_packets,
                    audio_level_average: room.audio_level_average
                }))
                setRooms(_rooms)

            },
            error: function (error) {
                console.log('error get rooms', error)
            }
        })
    }

    useClientMethod(clientMethods.updateRooms, getRoomsList)

    useEffect(() => {
        if (!plugin.current.publisher && userStateIs(userStates.rooms) && hubConnectionState === HubConnectionState.Connected) {
            const interval = setInterval(() => {
                if (janus.current) {
                    clearInterval(interval)

                    // Attach video room plugin
                    attachPublisherPlugin()

                    // Attach audio bridge plugin
                    attachAudioBridgePlugin()
                }
            }, 100)
        }
    }, [userState, hubConnectionState])

    useEffect(() => {
        if (userStateIs(userStates.rooms)) {
            const interval = setInterval(() => {
                if (plugin.current.publisher) {
                    clearInterval(interval)
                    getRoomsList()
                }
            }, 100)
        }
    }, [userState])

    return (
        <>
            <ShareRoomModal/>
            <div className="p-5">
                {rooms.length === 0 && <div>
                    No rooms available
                </div>}
                {rooms.length !== 0 && <Row gutter={16}>
                    {rooms.map(room => (
                        <Col key={room.id} span={8}>
                            <Card
                                title={room.description + "(" + room.publishers + ")"}
                                actions={[
                                    <Button className="w-fit" key="join" type="dashed" onClick={joinRoomHandler(room)}>
                                        Join
                                    </Button>,
                                    <Button
                                        key="share"
                                        type="dashed"
                                        onClick={() => setRoomIdToShare(
                                            room.id,
                                            () => setShareModalOpen(!shareModalOpen)
                                        )}
                                    >
                                        Share
                                    </Button>,
                                    isAdmin && <EditOutlined onClick={editRoomHandler(room)} key="edit"/>,
                                    isAdmin && <Popconfirm
                                        title="Are you sure you want to delete the room?"
                                        onConfirm={destroyRoomHandler(room)}>
                                        <DeleteOutlined key="destroy"/>
                                    </Popconfirm>
                                ].filter(Boolean)}
                            />
                        </Col>
                    ))}
                </Row>}
            </div>
        </>
    );
}