import Button from "components/elements/button/Button"
import { ROUTE_REGISTRATION } from "constants/routes"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import utilStyles from "styles/utils.module.scss"
import styles from "./UnauthorizedTemplate.module.scss"

const UnauthorizedTemplate = () => {

    const router = useRouter()

    return (
        <>
            <Head>
                <title>Необходима авторизация</title>
            </Head>
            <div className={styles.container}>
                <div className={utilStyles.text_large}>
                    Вы не вошли в аккаунт
                </div>
                <Button
                    title="Войти"
                    onClick={() => router.replace(ROUTE_REGISTRATION)}
                    size="small"
                />
            </div>
        </>
    )
}


export default UnauthorizedTemplate