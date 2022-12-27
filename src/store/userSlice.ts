import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { UserProfileType } from "components/templates/users/types"
import { ENDPOINT_ACCOUNT } from "constants/endpoints"
import { StateType } from "store"
import axiosApi from "utils/axios"

export type StateUserType = {
    lastName: string,
    firstName: string,
    secondName: string,
    login: string,
    email: string,
    roles: string[],
    authorized: boolean,
}

const initialState: StateUserType = {
    lastName: '',
    firstName: '',
    secondName: '',
    login: '',
    email: '',
    roles: [],
    authorized: false
}

export const getUserInfo = createAsyncThunk("user/getUserInfo", async () => {
    const response = await axiosApi.get(`${ENDPOINT_ACCOUNT}/CurrentUserInfo`)

    const data: UserProfileType = response.data

    const userInfo: StateUserType = {
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        secondName: data.secondName || "",
        login: data.user?.userName || "",
        email: data.user?.email || "",
        roles: data.user?.userRoles?.map(el => el.role.name!) || [],
        authorized: true
    }

    return userInfo
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userLoggedOut(state) {
            state.firstName = ""
            state.secondName = ""
            state.lastName = ""
            state.email = ""
            state.login = ""
            state.roles = []
            state.authorized = false
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.firstName = action.payload.firstName
                state.secondName = action.payload.secondName
                state.lastName = action.payload.lastName
                state.email = action.payload.email
                state.login = action.payload.login
                state.roles = action.payload.roles
                state.authorized = action.payload.authorized
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.firstName = ""
                state.secondName = ""
                state.lastName = ""
                state.email = ""
                state.login = ""
                state.roles = []
                state.authorized = false
            })
    }
})

export const userSelector = (state: StateType) => state.user

export const { userLoggedOut } = userSlice.actions
export default userSlice.reducer