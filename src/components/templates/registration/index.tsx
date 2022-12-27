import AuthorizationModalWindow from "components/modules/modalWindows/authorizationModalWindow"
import { ROUTE_PROFILE } from "constants/routes"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { getUserInfo } from "store/userSlice"

const RegistrationTemplate = () => {

    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()

    const onSuccess = () => {
        dispatch(getUserInfo())
        router.replace(ROUTE_PROFILE)
    }

    return (
        <div>
            <Head>
                <title>Вход в аккаунт</title>
            </Head>
            <AuthorizationModalWindow
                {...{
                    onSuccess
                }}
            />
        </div>
    )
}

export default RegistrationTemplate