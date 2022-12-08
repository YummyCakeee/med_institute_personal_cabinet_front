import AuthorizationModalWindow from "components/modules/modalWindows/authorizationModalWindow"
import { ROUTE_PROFILE } from "constants/routes"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"

const RegistrationTemplate = () => {

    const router = useRouter()

    const onSuccess = () => {
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