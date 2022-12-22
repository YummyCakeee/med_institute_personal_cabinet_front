import Layout from "components/layouts/Layout"
import Head from "next/head"
import React from "react"
import { CourseType } from "../types"
import utilStyles from "styles/utils.module.scss"
import ItemList from "components/modules/itemList"

import MovableList from "components/modules/movableList"
import Button from "components/elements/button/Button"
import styles from "./CourseTemplate.module.scss"
import useCourse from "./useCourse"

type CourseTemplateProps = {
    course: CourseType
}

const CourseTemplate = ({
    course
}: CourseTemplateProps) => {

    const {
        themes,
        setThemes,
        onThemeAddClick,
        onThemeEditClick,
        onThemeDeleteClick,
        onThemesOrderSaveClick,
    } = useCourse(course)


    return (
        <Layout>
            <Head>
                <title>{`Настройка курса ${course.title}`}</title>
            </Head>
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
                            size: "small",
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
                        }
                    ]}
                />
            </div>
            <div>
                <div className={utilStyles.section_title}>Порядок изучения тем</div>
                <div className={styles.courses_order}>
                    <MovableList
                        items={themes}
                        setItems={setThemes}
                        renderItem={({ themeId }) => (
                            `${themeId}`
                        )}
                    />
                    <div className={styles.courses_order_button_container}>
                        <Button
                            title="Сохранить"
                            size="small"
                            onClick={onThemesOrderSaveClick}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CourseTemplate