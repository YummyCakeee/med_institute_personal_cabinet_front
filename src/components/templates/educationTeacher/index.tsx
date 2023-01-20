import Layout from "components/layouts/Layout"
import Head from "next/head"
import React from "react"
import utilStyles from "styles/utils.module.scss"
import { useRouter } from "next/router"
import { ROUTE_EDUCATION, ROUTE_EDUCATION_TEACHER } from "constants/routes"
import { ProgramType } from "../educationalPrograms/types"
import ItemList from "components/modules/itemList"

type EducationTeacherTemplateProps = {
    programs: ProgramType[]
}

const EducationTeacherTemplate = ({
    programs
}: EducationTeacherTemplateProps) => {

    const router = useRouter()

    const onProgramCoursesClick = (index: number) => {
        const programId = programs[index].programId
        router.push(`${ROUTE_EDUCATION_TEACHER}/${programId}/courses`)
    }
    return (
        <Layout>
            <Head>
                <title>Обучение студентов</title>
            </Head>
            <div className={utilStyles.title}>Все программы обучения</div>
            <div className={utilStyles.section_title}>Список программ обучения</div>
            <ItemList
                headers={[
                    {
                        field: "title",
                        title: "Название",
                        colSize: "300px"
                    },
                    {
                        field: "description",
                        title: "Описание",
                        colSize: "500px"
                    }
                ]}
                items={programs}
                itemControlButtons={() => [
                    {
                        title: "Курсы",
                        size: "small",
                        onClick: onProgramCoursesClick
                    }
                ]}
            />
        </Layout>
    )
}

export default EducationTeacherTemplate