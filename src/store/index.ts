import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import { createWrapper } from "next-redux-wrapper";
import breadCrumbsSlice from "./breadCrumbsSlice";

const makeStore = () => configureStore({
    reducer: {
        user: userSlice,
        breadCrumbs: breadCrumbsSlice
    },
})

export type AppStore = ReturnType<typeof makeStore>;
export type StateType = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

export const wrapper = createWrapper<AppStore>(makeStore)