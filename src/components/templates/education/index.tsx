import Layout from "components/layouts/Layout"
import Head from "next/head"
import React from "react"
import styles from "./EducationTemplate.module.scss"
import utilStyles from "styles/utils.module.scss"
import { useRouter } from "next/router"
import { ROUTE_EDUCATION } from "constants/routes"
import { UserProgramType } from "../educationalPrograms/types"

type EducationTemplateProps = {
    userPrograms: UserProgramType[]
}

const EducationTemplate = ({
    userPrograms
}: EducationTemplateProps) => {

    const router = useRouter()

    const onProgramClick = (programId: string) => {
        router.push(`${ROUTE_EDUCATION}/${programId}/courses`)
    }
    
    return (
        <Layout>
            <Head>
                <title>Обучение</title>
            </Head>
            <div className={utilStyles.section_title}>Выбор программы обучения</div>
            <div className={styles.program_container}>
                {userPrograms.map((el, key) => (
                    <div
                        key={key}
                        className={styles.program}
                        onClick={() => onProgramClick(el.programId)}
                    >
                        {key + 1}. <span>{el.program?.title}</span>
                    </div>
                ))}
            </div>
        </Layout>
    )
}

export default EducationTemplate