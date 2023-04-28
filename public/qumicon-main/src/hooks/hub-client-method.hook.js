import {useContext, useEffect} from "react";
import {HubContext} from "../contexts/HubContext.js";

/**
 * Use SignalR Hub client method
 * @param methodName method
 * @param method callback
 */
export function useClientMethod(methodName, method) {
    const {hubConnection} = useContext(HubContext)

    useEffect(() => {
        if (!hubConnection) {
            return;
        }

        hubConnection.on(methodName, method)

        return () => {
            hubConnection.off(methodName, method);
        }

    }, [hubConnection, method, methodName]);
}