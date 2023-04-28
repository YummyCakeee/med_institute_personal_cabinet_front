import {HubConnectionBuilder, HubConnectionState} from "@microsoft/signalr";
import {useEffect, useState} from "react";
import {useStateWithCallback} from "./state-with-callback.hook.js";
import {useHubConsts} from "./hub-consts.hook.js";

export function useHub() {
    const [hubConnection, setHubConnection] = useStateWithCallback(null)
    const [hubConnectionState, setHubConnectionState] = useState(hubConnection?.state ?? HubConnectionState.Disconnected);
    const [error, setError] = useState();

    const {url} = useHubConsts()

    /**
     * Init hub connection
     */
    function initHubConnection() {
        const _hubConnection = new HubConnectionBuilder()
            .withUrl(url)
            .withAutomaticReconnect()
            .build();
        setHubConnection(_hubConnection)
    }

    useEffect(() => {
        setError(undefined);

        if (!hubConnection) {
            setHubConnectionState(HubConnectionState.Disconnected);
            return;
        }

        if (hubConnection.state !== hubConnectionState) {
            setHubConnectionState(hubConnection.state);
        }

        let isMounted = true;

        const onStateUpdatedCallback = () => {
            if (isMounted) {
                setHubConnectionState(hubConnection?.state);
            }
        }

        hubConnection.onclose(onStateUpdatedCallback);
        hubConnection.onreconnected(onStateUpdatedCallback);
        hubConnection.onreconnecting(onStateUpdatedCallback);

        if (hubConnection.state === HubConnectionState.Disconnected) {
            hubConnection
                .start()
                .then(onStateUpdatedCallback)
                .catch(reason => setError(reason))

            return
        }

        return () => {
            hubConnection.stop();
        };
    }, [hubConnection]);

    useEffect(() => {
        console.log('HubConnectionState', hubConnectionState)
    }, [hubConnectionState])

    useEffect(() => {
        if (error) {
            console.log('HubError', error.message)
            // message.error(error.message)
        }
    }, [error])

    return {
        initHubConnection,
        hubConnection,
        hubConnectionState,
        error,
    };
}