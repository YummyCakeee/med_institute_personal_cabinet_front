import {useStateWithCallback} from "./state-with-callback.hook.js";
import {useRef, useState} from "react";
import {useRoomConsts} from "./room-consts.hook.js";

export const useRoom = () => {
    const {muted: defaultMuted, mode, roomState: defaultRoomState} = useRoomConsts()

    const [room, setRoom] = useStateWithCallback(null)
    const [messages, setMessages] = useState([])
    const [publishers, setPublishers] = useStateWithCallback([])
    const [muted, setMuted] = useStateWithCallback(defaultMuted)

    const self = useRef({
        mode: mode.subscriber,
    })
    const roomState = useRef(defaultRoomState)

    const shareLink = (roomId = null) => document.location.host + "?videoroom&room=" + String(roomId || room?.id) + "&mode=subscriber"

    /**
     * Clear room
     */
    function clearRoom() {
        roomState.current = defaultRoomState
        setPublishers([])
        setMuted(defaultMuted)
        self.current = {}
        setMessages([])
        setRoom(null)
    }

    return {
        roomState,
        messages,
        setMessages,
        room,
        setRoom,
        publishers,
        setPublishers,
        self,
        muted,
        setMuted,
        shareLink,
        clearRoom
    }
}