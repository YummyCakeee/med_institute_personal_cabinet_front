import {createContext} from "react";
import Janus from "../utils/janus.js";

/**
 * @see useAuth
 */
export const AuthContext = createContext({
    hasAuth: false,
    user: null,
    setUser: Janus.noop,
    userName: "",
    userState: "",
    userStates: {},
    setUserState: Janus.noop,
    userStateIs: Janus.noop,
    isAdmin: false
})