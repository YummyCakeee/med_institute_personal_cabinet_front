import Layout from "components/layouts/Layout"
import Head from "next/head"
import React from "react"
import { CourseType } from "../types"
import utilStyles from "styles/utils.module.scss"
import ItemList from "components/modules/itemList"
import useCourse from "./useCourse"

type CourseTemplateProps = {
    course: CourseType
}

const CourseTemplate = ({
    course
}: CourseTemplateProps) => {

    const {
        themes,
        onThemeAddClick,
        onThemeEditClick,
        onThemeSetupClick,
        onThemeDeleteClick,
        onThemesChangeOrderClick
    } = useCourse(course)


    return (
        <Layout>
            <Head>
                <title>{`Настройка курса ${course.title}`}</title>
            </Head>
            <div className={utilStyles.title}>Темы курса "{course.title}"</div>
            <div>
                <div className={utilStyles.section_title}>Темы курса</div>
                <ItemList
                    headers={[
                        {
                            title: "Название",
                            field: "title"
                        }
                    ]}
                    items={themes}
                    itemControlButtons={() => [
                        {
                            title: "Редактировать",
                            onClick: onThemeEditClick,
                            stretchable: true
                        },
                        {
                            title: "Настройка",
                            onClick: onThemeSetupClick,
                            stretchable: true
                        },
                        {
                            title: "Удалить",
                            onClick: onThemeDeleteClick,
                            size: "small",
                        }
                    ]}
                    controlButtonsBottom={[
                        {
                            title: "Добавить",
                            size: "small",
                            onClick: onThemeAddClick
                        },
                        {
                            title: "Порядок изучения тем",
                            stretchable: true,
                            onClick: onThemesChangeOrderClick
                        }
                    ]}
                />
            </div>
        </Layout>
    )
}

export default CourseTemplate