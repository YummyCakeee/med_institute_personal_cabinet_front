import React from "react"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import ItemList from "components/modules/itemList"
import styles from "./CoursesTemplate.module.scss"
import useCourses from "./useCourses"

const CoursesTemplate = () => {

    const {
        courses,
        onCourseAddClick,
        onCourseDeleteClick,
        onCourseDetailsClick,
        onCourseEditClick
    } = useCourses()

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
                    itemControlButtons={[
                        {
                            title: "Детали",
                            onClick: onCourseDetailsClick
                        },
                        {
                            title: "Изменить",
                            onClick: onCourseEditClick
                        },
                        {
                            title: "Удалить",
                            onClick: onCourseDeleteClick
                        }
                    ]}
                    controlButtonsBottom={[
                        {
                            title: "Добавить",
                            onClick: onCourseAddClick
                        }
                    ]}
                />
            </div>
        </Layout>
    )
}

export default CoursesTemplate