import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import { createWrapper } from "next-redux-wrapper";

const makeStore = () => configureStore({
    reducer: {
        user: userSlice
    },
})

export type AppStore = ReturnType<typeof makeStore>;
export type StateType = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

export const wrapper = createWrapper<AppStore>(makeStore)