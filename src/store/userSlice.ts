import { AnyAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { UserProfileType, UserWithCertificatesType } from "components/templates/users/types"
import { ENDPOINT_ACCOUNT } from "constants/endpoints"
import { StateType } from "store"
import axiosApi from "utils/axios"
import { HYDRATE } from "next-redux-wrapper"

export type StateUserType = {
    id: string,
    lastName: string,
    firstName: string,
    secondName: string,
    dateOfBirth?: string,
    login: string,
    email?: string,
    profilePicture?: string,
    roles?: string[],
    authorized?: boolean,
    infoLoadStatus?: "pending" | "fulfilled" | "rejected"
}

const initialState: StateUserType = {
    id: '',
    lastName: '',
    firstName: '',
    secondName: '',
    dateOfBirth: '',
    login: '',
    email: '',
    profilePicture: '',
    roles: [],
    authorized: false,
    infoLoadStatus: "rejected"
}

export const getUserInfo = createAsyncThunk("user/getUserInfo", async () => {
    const response = await axiosApi.get(`${ENDPOINT_ACCOUNT}/CurrentUserInfo`)

    const data = (response.data as UserWithCertificatesType).user
    const userInfo: StateUserType = {
        id: data.userId || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        secondName: data.secondName || "",
        dateOfBirth: data.dateOfBirth || "",
        login: data.user?.userName || "",
        email: data.user?.email || "",
        profilePicture: data.profilePicture || "",
        roles: data.user?.userRoles?.map(el => el.role.name!) || [],
        authorized: true,
        infoLoadStatus: "fulfilled"
    }

    return userInfo
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userLoggedOut(state) {
            return initialState
        },
        userInfoChanged(state, action) {
            return {
                ...state,
                ...action.payload
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getUserInfo.pending, (state) => {
                return {
                    ...state,
                    infoLoadStatus: "pending"
                }
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                return {
                    ...state,
                    ...action.payload,
                    infoLoadStatus: "fulfilled"
                }
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                return {
                    ...initialState,
                    infoLoadStatus: "rejected"
                }
            })
            .addCase(HYDRATE, (state, action: AnyAction) => {
                return {
                    ...state,
                    ...action.payload.user,
                };
            })
    }
})

export const userSelector = (state: StateType) => state.user as StateUserType

export const { userLoggedOut, userInfoChanged } = userSlice.actions
export default userSlice.reducer