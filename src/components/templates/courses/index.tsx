import React, { useEffect } from "react"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import ItemList from "components/modules/itemList"
import styles from "./CoursesTemplate.module.scss"
import useCourses from "./useCourses"
import { CourseType } from "./types"
import utilStyles from "styles/utils.module.scss"

type CoursesTemplateProps = {
    courses: CourseType[]
}

const CoursesTemplate = ({ courses: initialCourses }: CoursesTemplateProps) => {
    const {
        courses,
        setCourses,
        onCourseAddClick,
        onCourseDeleteClick,
        onCourseThemesClick,
        onCourseEditClick,
        onCourseReportClick
    } = useCourses()

    useEffect(() => {
        setCourses(initialCourses)
    }, [initialCourses, setCourses])

    return (
        <Layout>
            <Head>
                <title>Курсы</title>
            </Head>
            <div className={utilStyles.title}>Курсы</div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>Список всех курсов</div>
                <ItemList
                    className={styles.courses_list}
                    headers={[
                        {
                            title: "Название",
                            field: "title"
                        },
                        {
                            title: "Описание",
                            field: "description"
                        }
                    ]}
                    items={courses}
                    itemControlButtons={() => [
                        {
                            title: "Редактировать",
                            onClick: onCourseEditClick,
                            size: "small",
                            stretchable: true,
                        },
                        {
                            title: "Удалить",
                            onClick: onCourseDeleteClick,
                            size: "small"
                        },
                        {
                            title: "Темы курса",
                            onClick: onCourseThemesClick,
                            size: "small",
                            stretchable: true
                        },
                        {
                            title: "Отчёт",
                            size: "small",
                            onClick: onCourseReportClick
                        }
                    ]}
                    controlButtonsBottom={[
                        {
                            title: "Добавить",
                            onClick: onCourseAddClick,
                            size: "small"
                        }
                    ]}
                    scrollToBottomOnItemsUpdate
                />
            </div>
        </Layout>
    )
}

export default CoursesTemplate