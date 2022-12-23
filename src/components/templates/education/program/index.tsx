import Layout from "components/layouts/Layout"
import Head from "next/head"
import React from "react"
import utilStyles from "styles/utils.module.scss"


const ProgramTemplate = () => {


    return (
        <Layout>
            <Head>
                <title>{`Курсы программы "${null}"`}</title>
            </Head>
            <div className={utilStyles.section_title}>Курсы программы</div>
            <div>Курс такой-то</div>
        </Layout >
    )
}

export default ProgramTemplate