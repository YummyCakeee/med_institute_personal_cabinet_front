import Layout from "components/layouts/Layout"
import Head from "next/head"
import React from "react"
import { UserThemeType } from "./types"
import utilStyles from "styles/utils.module.scss"
import { useRouter } from "next/router"
import { ROUTE_EDUCATION } from "constants/routes"

type EducationTemplateProps = {
    userThemes: UserThemeType[]
}

const EducationTemplate = ({
    userThemes
}: EducationTemplateProps) => {

    const router = useRouter()

    return (
        <Layout>
            <Head>
                <title>Обучение</title>
            </Head>
            <div className={utilStyles.section_title}>Выбор программы обучения</div>
            <div onClick={() => router.push(`${ROUTE_EDUCATION}/${2}`)}>Программа 1</div>
        </Layout>
    )
}

export default EducationTemplate