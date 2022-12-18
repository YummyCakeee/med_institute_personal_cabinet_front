import Layout from "components/layouts/Layout"
import Head from "next/head"
import React from "react"
import utilStyles from "styles/utils.module.scss"
import ItemList from "components/modules/itemList"
import { ThemeType } from "../useCourses"

type ThemeTemplateProps = {
    theme: ThemeType
}

const ThemeTemplate = ({
    theme
}: ThemeTemplateProps) => {

    return (
        <Layout>
            <Head>
                <title>Настройка темы</title>
            </Head>
            <div>
                <div className={utilStyles.section_title}>{`Информационные материалы (обязательно)`}</div>

            </div>
            <div>
                <div className={utilStyles.section_title}>{`Информационные материалы – файлы с описанием (необязательно)`}</div>

            </div>
            <div>
                <div className={utilStyles.section_title}>{`Тестирование (необязательно)`}</div>

            </div>
        </Layout>
    )
}

export default ThemeTemplate