import Button from "components/elements/button/Button"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import utilStyles from "styles/utils.module.scss"
import styles from "./LoadingErrorTemplate.module.scss"

type LoadingErrorTemplateProps = {
    error?: string
}

const LoadingErrorTemplate = ({
    error
}: LoadingErrorTemplateProps) => {

    const router = useRouter()

    return (
        <Layout>
            <Head>
                <title>Ошибка</title>
            </Head>
            <div className={styles.container}>
                <div className={utilStyles.text_large}>
                    Не удалось загрузить данные
                </div>
                {error &&
                    <div>
                        {error}
                    </div>
                }
                <div className={utilStyles.text_medium}>Попробуйте обновить страницу</div>
                <Button
                    title="Обновить"
                    onClick={() => router.reload()}
                    size="small"
                />
            </div>
        </Layout>
    )
}


export default LoadingErrorTemplate