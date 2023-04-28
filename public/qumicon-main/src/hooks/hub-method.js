import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {HubContext} from "../contexts/HubContext.js";

/**
 * Use SignalR Hub method
 * @param methodName method
 * @returns {{invoke: ((function(...[*]): Promise<*|undefined>)|*), loading: boolean}}
 */
export function useHubMethod(methodName) {
    const {hubConnection} = useContext(HubContext)

    const [state, setState] = useState({
        loading: false
    });

    /**
     * Is Hub mounted
     * @type {React.MutableRefObject<boolean>}
     */
    const isMounted = useRef(true);

    /**
     * Set state if hub is mounted
     * @type {(function(*): void)|*}
     */
    const setStateIfMounted = useCallback((value) => {
        if (isMounted.current) {
            setState(value);
        }
    }, []);

    /**
     * Function to call
     * @type {(function(...[*]): Promise<*|undefined>)|*}
     */
    const invoke = useCallback(async (...args) => {
        setStateIfMounted(s => ({...s, loading: true}));

        try {
            if (hubConnection) {
                const data = await hubConnection.invoke(methodName, ...args);
                setStateIfMounted(s => ({...s, data: data, loading: false, error: undefined}));
                return data;
            } else {
                throw new Error('hubConnection is not defined');
            }
        } catch (e) {
            setStateIfMounted(s => ({...s, error: e, loading: false}));
        }
    }, [hubConnection, methodName]);

    useEffect(() => () => {
        isMounted.current = false
    }, []);

    return {invoke, ...state};
}