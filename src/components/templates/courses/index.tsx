import React, { useEffect } from "react"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import ItemList from "components/modules/itemList"
import styles from "./CoursesTemplate.module.scss"
import useCourses, { CourseType } from "./useCourses"

type CoursesTemplateProps = {
    courses: CourseType[]
}

const CoursesTemplate = ({ courses: initialCourses }: CoursesTemplateProps) => {
    const {
        courses,
        setCourses,
        onCourseAddClick,
        onCourseDeleteClick,
        onCourseDetailsClick,
        onCourseEditClick
    } = useCourses()

    useEffect(() => {
        setCourses(initialCourses)
    }, [initialCourses])

    return (
        <Layout>
            <Head>
                <title>Курсы</title>
            </Head>
            <div className={styles.courses_list_container}>
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
                        },
                        {
                            title: "Дата создания",
                            field: "createDate"
                        },
                        {
                            title: "ID создателя",
                            field: "creatorId"
                        },
                    ]}
                    items={courses}
                    itemControlButtons={() => [
                        {
                            title: "Детали",
                            onClick: onCourseDetailsClick,
                            size: "small"
                        },
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
                        }
                    ]}
                    controlButtonsBottom={[
                        {
                            title: "Добавить",
                            onClick: onCourseAddClick,
                            size: "small"
                        }
                    ]}
                />
            </div>
        </Layout>
    )
}

export default CoursesTemplate