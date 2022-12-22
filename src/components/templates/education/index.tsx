import Layout from "components/layouts/Layout"
import Head from "next/head"
import React from "react"
import { UserThemeType } from "./types"

type EducationTemplateProps = {
    userThemes: UserThemeType[]
}

const EducationTemplate = ({
    userThemes
}: EducationTemplateProps) => {

    console.log(userThemes)

    return (
        <Layout>
            <Head>
                <title>Обучение</title>
            </Head>

        </Layout>
    )
}

export default EducationTemplate