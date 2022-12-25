import React, { useEffect } from "react"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import ItemList from "components/modules/itemList"
import styles from "./CoursesTemplate.module.scss"
import useCourses from "./useCourses"
import { CourseType } from "./types"

type CoursesTemplateProps = {
    courses: CourseType[]
}

const CoursesTemplate = ({ courses: initialCourses }: CoursesTemplateProps) => {
    const {
        courses,
        setCourses,
        onCourseAddClick,
        onCourseDeleteClick,
        onCourseSetupClick,
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
                        title: "Настройка тем курса",
                        onClick: onCourseSetupClick,
                        stretchable: true
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
        </Layout>
    )
}

export default CoursesTemplate