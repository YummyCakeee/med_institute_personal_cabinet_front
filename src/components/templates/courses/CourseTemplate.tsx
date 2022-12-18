import Layout from "components/layouts/Layout"
import Head from "next/head"
import React, { useEffect, useState } from "react"
import { CourseType, ThemeType } from "./useCourses"
import utilStyles from "styles/utils.module.scss"
import ItemList from "components/modules/itemList"

type CourseTemplateProps = {
    course: CourseType
}

const CourseTemplate = ({
    course
}: CourseTemplateProps) => {

    const [themes, setThemes] = useState<ThemeType[]>([])

    useEffect(() => {
        setThemes(course.themes)
    }, [course.themes])

    const onThemeAddClick = () => {

    }

    return (
        <Layout>
            <Head>
                <title>Настройка курса "{course.title}"</title>
            </Head>
            <div>
                <div className={utilStyles.section_title}>Темы курса</div>
                <ItemList
                    headers={[
                        {
                            title: "Id",
                            field: "themeId"
                        }
                    ]}
                    items={themes}
                    controlButtonsBottom={[
                        {
                            title: "Добавить",
                            size: "small",
                            onClick: onThemeAddClick
                        }
                    ]}
                />
            </div>

        </Layout>
    )
}

export default CourseTemplate