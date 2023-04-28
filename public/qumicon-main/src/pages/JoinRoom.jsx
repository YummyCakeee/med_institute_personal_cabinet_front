import {App, Button, Card, Form, Input, Typography} from "antd";
import {useApi} from "../hooks/api.hook.js";
import {useContext, useEffect, useState} from "react";
import {RoomContext} from "../contexts/RoomContext.js";
import {AuthContext} from "../contexts/AuthContext.js";
import {useJanusFunctions} from "../hooks/janus-functions.hook.js";
import {HubContext} from "../contexts/HubContext.js";
import {HubConnectionState} from "@microsoft/signalr";
import {JanusContext} from "../contexts/JanusContext.js";
import {useJanusPublisher} from "../hooks/janus-publisher.hook.js";
import {useRoomConsts} from "../hooks/room-consts.hook.js";

export default function JoinRoom({search}) {
    const {setRoom, self, room} = useContext(RoomContext)
    const {hasAuth, user, userName, setUser, setUserState, userStates, userState, userStateIs} = useContext(AuthContext)
    const {hubConnectionState} = useContext(HubContext)
    const {plugin, janus} = useContext(JanusContext)

    const [form] = Form.useForm()
    const {login, getUserInfo} = useApi()
    const {message} = App.useApp()
    const {attachPublisherPlugin} = useJanusPublisher()
    const {roomExists, getRooms} = useJanusFunctions()
    const {mode} = useRoomConsts()

    const [withAuth, setWithAuth] = useState(hasAuth && !user)

    console.log(withAuth)

    const searchParams = new URLSearchParams(document.location.search)
    const formName = "login-form"

    /**
     * Login button click handler
     * @param email email
     * @param password password
     */
    function loginClickHandler({email, password}) {
        login(email, password).then(response => {
            if (response.status === 200) {
                getUserInfo().then(response => {
                    if (response.status === 200) {
                        setUser(response.data.user)
                        setWithAuth(false)
                    } else if (response.status === 401) {
                        message.error("Can't get user info after login")
                    } else {
                        message.error("Something went wrong")
                    }
                })
            } else if (response.status === 401) {
                message.error("Invalid credentials")
            }
        })
    }

    /**
     * Join room without authentication
     * @param name user name to join with
     */
    function joinWithoutAuth({name}) {
        if (userStateIs(userStates.joinNoAuth) && room) {
            roomExists(room.id, {
                success: function () {
                    self.current = {
                        ...self.current,
                        display: name,
                        mode: mode.publisher,
                    }
                    setUserState(userStates.joining)
                },
                error: function (error) {
                    message.error(error)
                }
            })
        } else {
            const roomId = String(searchParams.get(search.room))
            roomExists(roomId, {
                success: function () {
                    getRooms({
                        success: function (data) {
                            const room = data.list.find(room => room.room === roomId)
                            if (room) {
                                let urlMode = searchParams.get(search.mode)
                                if (!Object.keys(mode).includes(urlMode)) {
                                    urlMode = null
                                }

                                self.current = {
                                    ...self.current,
                                    display: name,
                                    mode: urlMode || mode.subscriber,
                                }
                                setRoom({
                                    id: room.room,
                                    description: room.description,
                                    publishers: room.max_publishers,
                                }, function () {
                                    setUserState(userStates.joining)
                                })
                            } else {
                                message.error("Couldn't find the room")
                            }
                        },
                        error: function (error) {
                            message.error(error)
                        }
                    })
                },
                error: function (error) {
                    message.error(error)
                }
            })
        }
    }

    useEffect(() => {
        if (user) {
            form.setFieldsValue({name: userName})
        }
    }, [user])

    useEffect(() => {
        if (hubConnectionState === HubConnectionState.Connected && !plugin.current.publisher) {
            const interval = setInterval(() => {
                if (janus.current) {
                    clearInterval(interval)
                    attachPublisherPlugin()
                }
            }, 100)
        }
    }, [hubConnectionState, userState])

    const JoinButton = () => <Button className="w-full" type="primary" htmlType="submit" form={formName}>
        Присоединиться
    </Button>

    return (
        <div className="w-full h-full items-center place-content-center">
            {hasAuth && !user && withAuth && <Card
                className="w-2/12"
                title={<div className="text-center">Вход в аккаунт</div>}
            >
                <Form name="login-form" layout="vertical" onFinish={loginClickHandler}>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: "email",
                                message: "Поле должно содержать валидный email"
                            },
                            {
                                required: true,
                                message: "Поле обязательно для заполнения"
                            }
                        ]}
                    >
                        <Input placeholder="Ваш логин"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{
                            required: true,
                            message: "Поле обязательно для заполнения"
                        }]}
                    >
                        <Input.Password placeholder="Ваш пароль"/>
                    </Form.Item>
                    <Form.Item>
                        <Button className="w-full" type="primary" htmlType="submit">
                            Войти
                        </Button>
                    </Form.Item>
                    <div className="text-center">
                        <Typography.Link onClick={() => setWithAuth(!withAuth)}>
                            Продолжить без авторизации
                        </Typography.Link>
                    </div>

                </Form>
            </Card>}
            {(user || !withAuth) && <Card
                className="w-2/12"
                title={<div className="text-center">Присоединение к комнате</div>}
            >
                <Form form={form} layout="vertical" onFinish={joinWithoutAuth} name={formName}>
                    <Form.Item
                        name="name"
                        rules={[{
                            required: true,
                            message: "Поле обязательно для заполнения"
                        }]}
                    >
                        <Input readOnly={!!user} placeholder="Введите имя"/>
                    </Form.Item>
                    {!user && <Form.Item>
                        <JoinButton/>
                    </Form.Item>}
                    {hasAuth && user && <JoinButton/>}
                    {hasAuth && !user && <div className="text-center">
                        <Typography.Link onClick={() => setWithAuth(!withAuth)}>
                            Войти в аккаунт
                        </Typography.Link>
                    </div>}
                </Form>
            </Card>}
        </div>
    )
}