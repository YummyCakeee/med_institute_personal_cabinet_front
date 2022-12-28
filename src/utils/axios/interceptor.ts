import { AppStore } from "store";
import { userLoggedOut } from "store/userSlice";
import axiosApi from ".";

export const injectStore = (store: AppStore) => {
    axiosApi.interceptors.response.use((response) => {
        return response
    },
        (error) => {
            if (error.response.status === 401)
                store.dispatch(userLoggedOut())
            return Promise.reject(error)
        })
}