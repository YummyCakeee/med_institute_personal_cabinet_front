import Layout from "components/layouts/Layout"
import { CourseInfoType, CourseType } from "components/templates/courses/types"
import { ProgramType } from "components/templates/educationalPrograms/types"
import { ROUTE_EDUCATION, ROUTE_EDUCATION_TEACHER } from "constants/routes"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect, useMemo, useState } from "react"
import styles from "./ProgramTemplate.module.scss"
import utilStyles from "styles/utils.module.scss"
import cn from "classnames"
import ItemList from "components/modules/itemList"

type ProgramTemplateProps = {
    program: ProgramType,
    courses: CourseType[]
}


const ProgramTemplate = ({
    program,
    courses
}: ProgramTemplateProps) => {

    const router = useRouter()

    const programCourses = useMemo(() => {
        return courses.filter(course =>
            program.programCourses?.find(programCourse =>
                programCourse.courseId === course.courseId))

    }, [program, courses])

    const onCourseThemesClick = (index: number) => {
        const programId = program.programId
        const courseId = courses[index].courseId
        router.push(`${ROUTE_EDUCATION_TEACHER}/${programId}/courses/${courseId}/themes`)
    }

    return (
        <Layout>
            <Head>
                <title>{`Курсы программы "${program.title}"`}</title>
            </Head>
            <div className={utilStyles.title}>{`Программа "${program.title}"`}</div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>Курсы программы</div>
                <ItemList
                    headers={[
                        {
                            field: "title",
                            title: "Название"
                        },
                        {
                            field: "description",
                            title: "Описание"
                        }
                    ]}
                    items={programCourses}
                    itemControlButtons={() => [
                        {
                            title: "Темы",
                            size: "small",
                            onClick: onCourseThemesClick
                        }
                    ]}
                />
            </div>
        </Layout >
    )
}

export default ProgramTemplate