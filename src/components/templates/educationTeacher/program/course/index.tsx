import Layout from "components/layouts/Layout"
import ItemList from "components/modules/itemList"
import { CourseType, ThemeType } from "components/templates/courses/types"
import { ROUTE_EDUCATION, ROUTE_EDUCATION_TEACHER } from "constants/routes"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import utilStyles from "styles/utils.module.scss"
import styles from "./CourseTemplate.module.scss"

type CourseTemplateProps = {
    course: CourseType,
    themes: ThemeType[]
}

const CourseTemplate = ({
    course,
    themes
}: CourseTemplateProps) => {

    const router = useRouter()

    const onThemeStudentsClick = (index: number) => {
        const { programId, courseId } = router.query
        const themeId = themes[index].themeId
        router.push(`${ROUTE_EDUCATION_TEACHER}/${programId}/courses/${courseId}/themes/${themeId}`)
    }

    return (
        <Layout>
            <Head>
                <title>{`Темы курса "${course.title}"`}</title>
            </Head>
            <div className={utilStyles.title}>{`Темы курса "${course.title}"`}</div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>Темы курса</div>
                <ItemList
                    headers={[
                        {
                            field: "title",
                            title: "Название"
                        }
                    ]}
                    items={themes}
                    itemControlButtons={() => [
                        {
                            title: "Студенты",
                            size: "small",
                            onClick: onThemeStudentsClick
                        }
                    ]}
                />
            </div>
        </Layout >
    )
}

export default CourseTemplate