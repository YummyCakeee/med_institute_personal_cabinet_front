import {createContext} from "react";
import {HubConnectionState} from "@microsoft/signalr";

/**
 * @see useHub
 */
export const HubContext = createContext({
    hubConnection: null,
    hubConnectionState: ""
})