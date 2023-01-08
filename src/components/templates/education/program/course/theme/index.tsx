import Layout from "components/layouts/Layout"
import { ThemeType } from "components/templates/courses/types"
import { AllResultForUser, UserThemeType } from "components/templates/education/types"
import { ROUTE_EDUCATION } from "constants/routes"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import utilStyles from "styles/utils.module.scss"

type ThemeTemplateProps = {
    userTheme: UserThemeType,
    testResults?: AllResultForUser
}

const ThemeTemplate = ({
    userTheme,
    testResults,
}: ThemeTemplateProps) => {


    const router = useRouter()

    return (
        <Layout>
            <Head>
                <title>{`Тема "${userTheme.theme.title}"`}</title>
            </Head>
            <div className={utilStyles.title} >{`Тема "${userTheme.theme.title}"`}</div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>Информация</div>
                {userTheme.theme.html}
            </div>
            <div onClick={() => router.push(`${ROUTE_EDUCATION}/${2}/courses/${1}/themes/${3}/testBlock`)}>Тест</div>

        </Layout >
    )
}

export default ThemeTemplate