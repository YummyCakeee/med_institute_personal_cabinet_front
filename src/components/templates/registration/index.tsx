import AuthorizationModalWindow from "components/modules/modalWindows/authorizationModalWindow"
import { ROUTE_PROFILE } from "constants/routes"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { getUserInfo } from "store/userSlice"
import addNotification from "utils/notifications"
import { getServerErrorResponse } from "utils/serverData"

const RegistrationTemplate = () => {

    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()

    const onRegistrationSuccess = () => {
        dispatch(getUserInfo())
        router.replace(ROUTE_PROFILE)
        addNotification({type: "info", title: "Успех", message: "Для подтверждения указанной вами почты на неё было отправлено письмо. Проследуйте инструкции, указанной в нём"})
    }

    const onAuthorizationSuccess = () => {
        dispatch(getUserInfo())
        router.replace(ROUTE_PROFILE)
    }

    const onForgotPasswordSuccess = () => {
        addNotification({ type: "info", title: "Информация", message: "На Вашу почту, привязанную к логину, было отправлено письмо, вы можете закрыть эту страницу" })
    }

    const onAuthorizationError = (err: any) => {
        addNotification({ type: "danger", title: "Ошибка", message: `Не удалось войти в аккаунт:\n${getServerErrorResponse(err)}` })
    }

    const onRegistrationError = (err: any) => {
        addNotification({ type: "danger", title: "Ошибка", message: `Не удалось зарегистрироваться:\n${getServerErrorResponse(err)}` })
    }

    const onForgotPasswordError = (err: any) => {
        addNotification({ type: "danger", title: "Ошибка", message: `Не удалось отправить письмо:\n${getServerErrorResponse(err)}` })

    }

    return (
        <div>
            <Head>
                <title>Вход в аккаунт</title>
            </Head>
            <AuthorizationModalWindow
                {...{
                    onRegistrationSuccess,
                    onAuthorizationSuccess,
                    onForgotPasswordSuccess,
                    onRegistrationError,
                    onAuthorizationError,
                    onForgotPasswordError
                }}
            />
        </div>
    )
}

export default RegistrationTemplate