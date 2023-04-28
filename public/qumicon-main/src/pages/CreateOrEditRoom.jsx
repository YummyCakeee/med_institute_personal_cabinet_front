import {useContext} from "react";
import {RoomContext} from "../contexts/RoomContext.js";
import {Button, Form, Input, InputNumber} from "antd";
import {useJanusFunctions} from "../hooks/janus-functions.hook.js";
import {useHubMethod} from "../hooks/hub-method.js";
import {useHubConsts} from "../hooks/hub-consts.hook.js";
import {AuthContext} from "../contexts/AuthContext.js";

export default function CreateOrEditRoom() {
    const {room, setRoom} = useContext(RoomContext)
    const {userStateIs, setUserState, userStates} = useContext(AuthContext)

    const {createRoom, editRoom} = useJanusFunctions()
    const {hubMethods} = useHubConsts()
    const {invoke: roomsUpdated} = useHubMethod(hubMethods.roomsUpdated)

    const showAudioSettings = false
    const formName = "create-or-edit-room-form"
    const required = {
        required: true,
        message: "Поле обязательно для заполнения"
    }
    const keys = [
        "description",
        "publishers",
        // 'audio_active_packets',
        // 'audio_level_average'
    ].reduce((acc, key) => ({...acc, [key]: key}), {})
    const labels = {
        [keys.description]: "Name",
        [keys.publishers]: "Publishers",
        // [keys.audio_active_packets]: "Packets",
        // [keys.audio_level_average]: "Average",
    }
    const fields = [
        {
            values: {
                name: keys.description,
                label: labels[keys.description],
                rules: [required],
                initialValue: room?.description,
            }, input: <Input placeholder={labels[keys.description]}/>
        },
        {
            values: {
                name: keys.publishers,
                label: labels[keys.publishers],
                rules: [required],
                initialValue: room?.publishers || 3,
            }, input: <InputNumber
                className="w-full"
                min={1}
                max={20}
                precision={0}
                placeholder={labels[keys.publishers]}
            />
        },
        userStateIs(userStates.creating) && showAudioSettings && {
            values: {
                name: keys.audio_active_packets,
                label: labels[keys.audio_active_packets],
                rules: [required],
                initialValue: room?.audio_active_packets || 100,
            }, input: <InputNumber
                className="w-full"
                min={1}
                max={200}
                precision={0}
                placeholder={labels[keys.audio_active_packets]}
            />
        },
        userStateIs(userStates.creating) && showAudioSettings && {
            values: {
                name: keys.audio_level_average,
                label: labels[keys.audio_level_average],
                rules: [required],
                initialValue: room?.audio_level_average || 25,
            }, input: <InputNumber
                className="w-full"
                min={1}
                max={200}
                precision={0}
                placeholder={labels[keys.audio_level_average]}
            />
        },
    ].filter(Boolean)

    function success() {
        setUserState(userStates.rooms)
        if (room) {
            setRoom(null)
        }
        roomsUpdated()
    }

    /**
     * Create or edit room
     * @param body
     */
    function submitForm(body) {
        if (userStateIs(userStates.creating)) {
            createRoom(body, {success})
        } else {
            editRoom({
                room: room.id,
                new_description: body.description,
                new_publishers: body.publishers,
            }, {success})
        }

    }

    return (
        <div className="p-5">
            <Form onFinish={submitForm} layout="vertical" name={formName}>
                {fields.map(field => (
                    <Form.Item {...field.values} key={field.values?.name}>
                        {field.input}
                    </Form.Item>
                ))}
            </Form>
            <Button type="primary" htmlType="submit" form={formName}>
                {userStateIs(userStates.creating) ? "Create" : "Update"}
            </Button>
        </div>
    )
}