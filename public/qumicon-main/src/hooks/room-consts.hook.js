export function useRoomConsts() {
    const muted = {
        video: true,
        audio: true,
        screen: true,
    }

    const roomState = {
        publishers: [],
        sub_joined: false,
        subscriptions: {},
        subscribing: false,
        unsubscribing: false,
        canSlide: true,
        slide: 0,
    }

    const mode = {
        publisher: "publisher",
        subscriber: "subscriber",
    }

    const screenSuffix = " (Screen)"

    return {
        mode,
        muted,
        screenSuffix,
        roomState
    }
}