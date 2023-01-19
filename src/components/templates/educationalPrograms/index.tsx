import React, { useEffect } from "react"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import ItemList from "components/modules/itemList"
import useEducationalPrograms from "./useEducationalPrograms"
import { ProgramType } from "./types"
import utilStyles from "styles/utils.module.scss"

type EducationalProgramsTemplateProps = {
    educationalPrograms: ProgramType[]
}

const EducationalProgramsTemplate = ({
    educationalPrograms
}: EducationalProgramsTemplateProps) => {

    const {
        programs,
        setPrograms,
        onEducationalProgramAddClick,
        onEducationalProgramEditClick,
        onEducationalProgramDeleteClick,
        onEducationalProgramCoursesClick,
        onEducationalProgramStudentsClick,
        onEducationalProgramReportClick
    } = useEducationalPrograms()

    useEffect(() => {
        setPrograms(educationalPrograms)
    }, [educationalPrograms, setPrograms])

    return (
        <Layout>
            <Head>
                <title>Образовательные программы</title>
            </Head>
            <div className={utilStyles.title}>Образовательные программы</div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>Список образовательных программ</div>
                <ItemList
                    headers={[
                        {
                            title: "Название",
                            field: "title",
                            colSize: "400px"
                        },
                        {
                            title: "Описание",
                            field: "description",
                            colSize: "800px"
                        }
                    ]}
                    items={programs}
                    itemControlButtons={() => [
                        {
                            title: "Редактировать",
                            onClick: onEducationalProgramEditClick,
                            size: "small",
                            stretchable: true
                        },
                        {
                            title: "Удалить",
                            onClick: onEducationalProgramDeleteClick,
                            size: "small",
                        },
                        {
                            title: "Курсы",
                            onClick: onEducationalProgramCoursesClick,
                            size: "small",
                        },
                        {
                            title: "Обучающиеся",
                            onClick: onEducationalProgramStudentsClick,
                            stretchable: true
                        },
                        {
                            title: "Отчёт",
                            onClick: onEducationalProgramReportClick,
                            size: "small"
                        }
                    ]}
                    controlButtonsBottom={[
                        {
                            title: "Добавить",
                            onClick: onEducationalProgramAddClick,
                            size: "small"
                        }
                    ]}
                />
            </div>
        </Layout>
    )
}

export default EducationalProgramsTemplate