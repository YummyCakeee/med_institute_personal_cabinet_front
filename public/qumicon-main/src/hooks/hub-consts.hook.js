export function useHubConsts() {
    const url = window.qumicon_config?.hub || "http://localhost:5264/qumicon-hub"

    const hubMethods = {
        joinedRoom: "JoinedRoom",
        sendMessage: "SendMessage",
        roomsUpdated: "RoomsUpdated",
        sendVideoData: "SendVideoData",
        ScreenSharingUpdated: "ScreenSharingUpdated",
        leftRoom: "LeftRoom",
    }

    const clientMethods = {
        receiveMessage: "ReceiveMessage",
        updateRooms: "UpdateRooms",
        UpdateScreenSharingPublisher: "UpdateScreenSharingPublisher",
        receiveVideoData: "ReceiveVideoData",
    }

    return {
        url,
        hubMethods,
        clientMethods
    }
}