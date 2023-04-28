import {useRef} from "react";
import {useJanusConsts} from "./janus-consts.hook.js";
import Janus from "../utils/janus.js";
import {App} from "antd";

/**
 * Use Janus WebRTC
 */
export const useJanus = () => {
    const {defaultPlugin, server, defaultFeed} = useJanusConsts()

    const janus = useRef(null)
    const plugin = useRef(defaultPlugin)
    const feed = useRef(defaultFeed)
    const presenter = useRef(null)

    const {message} = App.useApp()

    /**
     * Create session
     * @param success after session created callback
     */
    function createSession(success = Janus.noop) {
        const _janus = new Janus({
            server,
            iceServers: [{urls: "stun:stun.l.google.com:19302"}],
            success: () => {
                janus.current = _janus
                success()
            },
            error: error => {
                message.error("Error creating session")
            }
        })
    }

    /**
     * Set default values
     */
    function setJanusDefaults() {
        janus.current = null
        plugin.current = defaultPlugin
        feed.current = defaultFeed
    }

    return {
        janus,
        plugin,
        feed,
        presenter,
        createSession,
        setJanusDefaults,
    }
}