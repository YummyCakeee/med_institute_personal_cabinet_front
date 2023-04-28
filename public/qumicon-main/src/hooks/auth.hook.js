import {useStateWithCallback} from "./state-with-callback.hook.js";

const userStates = {
    default: "default",
    joiningByLink: "byLink",
    rooms: "rooms",
    joinNoAuth: "joinNoAuth",
    joining: "joining",
    joined: "joined",
    leaving: "leaving",
    left: "left",
    editing: "edit",
    creating: "create",
}

export function useAuth() {
    const hasAuth = window.qumicon_config?.hasAuth || false

    const [user, setUser] = useStateWithCallback(null)
    const [userState, setUserState] = useStateWithCallback(userStates.default)

    const isAdmin = user && user.user.userRoles.findIndex(role => role.role.name === "Administrator") !== -1

    const userName = user ? (user.firstName + ' ' + user.lastName) : ""

    function userStateIs(...states) {
        return states.includes(userState)
    }

    return {
        hasAuth,
        user,
        setUser,
        userName,
        isAdmin,
        userState,
        setUserState,
        userStates,
        userStateIs,
    }
}