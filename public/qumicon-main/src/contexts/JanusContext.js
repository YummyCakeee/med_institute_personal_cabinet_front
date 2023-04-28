import {createContext} from "react";
import Janus from "../utils/janus.js";

/**
 * @see useJanus
 */
export const JanusContext = createContext({
    janus: null,
    plugin: null,
    feed: null,
    presenter: null,
    setJanusDefaults: Janus.noop,
})