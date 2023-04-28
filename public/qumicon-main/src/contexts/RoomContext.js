import {createContext} from "react";
import Janus from "../utils/janus.js";

/**
 * @see useRoom
 */
export const RoomContext = createContext({
    self: null,
    room: null,
    publishers: [],
    muted: {
        video: true,
        audio: true,
        screen: true,
    },
    roomState: null,
    shareLink: Janus.noop,
    setRoom: Janus.noop,
    setPublishers: Janus.noop,
    setMuted: Janus.noop,
    clearRoom: Janus.noop,
})