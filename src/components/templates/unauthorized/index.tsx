import Button from "components/elements/button/Button"
import { ROUTE_REGISTRATION } from "constants/routes"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import utilStyles from "styles/utils.module.scss"
import styles from "./UnauthorizedTemplate.module.scss"

const UnauthorizedTemplate = () => {

    const router = useRouter()
    const user = useSelector(userSelector)

    return (
        <>
            <Head>
                <title>{user.infoLoadStatus === "pending" ? "Выполнение входа в аккаунт" : "Необходима авторизация"}</title>
            </Head>
            <div className={styles.container}>
                {user.infoLoadStatus === "pending" ?
                    <div className={utilStyles.text_large}>
                        Подождите, выполняется вход в аккаунт
                    </div> :
                    <>
                        <div className={utilStyles.text_large}>
                            Вы не вошли в аккаунт
                        </div>
                        <Button
                            title="Войти"
                            onClick={() => router.replace(ROUTE_REGISTRATION)}
                            size="small"
                        />
                    </>

                }
            </div>
        </>
    )
}


export default UnauthorizedTemplate