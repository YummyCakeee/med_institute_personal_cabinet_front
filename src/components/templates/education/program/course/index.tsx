import Layout from "components/layouts/Layout"
import { CourseType } from "components/templates/courses/types"
import { ReportModelType } from "components/templates/educationalPrograms/types"
import { ROUTE_EDUCATION } from "constants/routes"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useMemo } from "react"
import utilStyles from "styles/utils.module.scss"
import { ThemeInfoType } from "../../types"
import styles from "./CourseTemplate.module.scss"
import cn from "classnames"

type CourseTemplateProps = {
    course: CourseType,
    themeInfos: ThemeInfoType[],
    courseReport: ReportModelType[]
}

const CourseTemplate = ({
    course,
    themeInfos,
    courseReport
}: CourseTemplateProps) => {

    const router = useRouter()

    const onThemeClick = (themeId: string) => {
        const { programId, courseId } = router.query
        router.push(`${ROUTE_EDUCATION}/${programId}/courses/${courseId}/themes/${themeId}`)
    }

    const themes = useMemo(() => {
        return themeInfos.map(themeInfo => {
            const status = courseReport.find(el => el.id === themeInfo.userTheme.themeId)?.status
            return {
                themeInfo,
                status
            }
        })
    }, [themeInfos, courseReport])

    return (
        <Layout>
            <Head>
                <title>{`Курс "${course.title}"`}</title>
            </Head>
            <div className={utilStyles.title}>{`Курс "${course.title}"`}</div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>Описание курса</div>
                <div className={utilStyles.text_medium}>
                    {course.description}
                </div>
            </div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>Темы курса</div>
                <div className={styles.theme_container}>
                    {themes.map((theme, themeKey) => (
                        <div
                            key={themeKey}
                            className={cn(
                                styles.theme,
                                { [styles.theme_unavailable]: !theme.themeInfo.available }
                            )}
                            onClick={() => onThemeClick(theme.themeInfo.userTheme.themeId)}
                        >
                            <div className={styles.theme_name}>
                                {themeKey + 1}. <span>{theme.themeInfo.userTheme.theme.title}</span>
                                <div className={styles.theme_status}>{`(${theme.status}%)`}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout >
    )
}

export default CourseTemplate