import Layout from "components/layouts/Layout"
import { CourseType, ThemeType } from "components/templates/courses/types"
import { ROUTE_EDUCATION } from "constants/routes"
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


    const onThemeClick = (themeId: string) => {
        const { programId, courseId } = router.query
        router.push(`${ROUTE_EDUCATION}/${programId}/courses/${courseId}/themes/${themeId}`)
    }
    return (
        <Layout>
            <Head>
                <title>{`Темы курса "${course.title}"`}</title>
            </Head>
            <div className={utilStyles.title}>{`Темы курса "${course.title}"`}</div>
            <div className={utilStyles.section_title}>Темы курса</div>
            <div className={styles.theme_container}>
                {themes.map((theme, themeKey) => (
                    <div
                        key={themeKey}
                        className={styles.theme}
                        onClick={() => onThemeClick(theme.themeId)}
                    >
                        {themeKey + 1}. <span>{theme.title}</span>
                    </div>
                ))}
            </div>
        </Layout >
    )
}

export default CourseTemplate