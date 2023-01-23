import { AnyAction, CaseReducer, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { HYDRATE } from "next-redux-wrapper"
import { StateType } from "store"


export type StateBreadCrumbsType = {
    breadCrumbs: StateBreadCrumbType[]
}

export type StateBreadCrumbType = {
    title: string,
    route: string
}

const initialState: StateBreadCrumbsType = {
    breadCrumbs: []
}

const breadCrumbsSlice = createSlice({
    name: "breadCrumbs",
    initialState,
    reducers: {
        setBreadCrumbs(state, action: PayloadAction<StateBreadCrumbType[]>) {
            return {
                ...state,
                breadCrumbs: action.payload
            }
        },
        clearBreadCrumbs() {
            return initialState
        }
    },
    extraReducers: builder =>
        builder.addCase(HYDRATE, (state, action: AnyAction) => {
            return {
                ...state,
                ...action.payload.breadCrumbs,
            };
        })
})

export const breadCrumbsSelector = (state: StateType) => state.breadCrumbs as StateBreadCrumbsType
export const { clearBreadCrumbs, setBreadCrumbs } = breadCrumbsSlice.actions
export default breadCrumbsSlice.reducer