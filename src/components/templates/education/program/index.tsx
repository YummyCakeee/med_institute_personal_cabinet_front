import Layout from "components/layouts/Layout"
import { CourseInfoType } from "components/templates/courses/types"
import { ProgramType, ReportModelType } from "components/templates/educationalPrograms/types"
import { ROUTE_EDUCATION } from "constants/routes"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useMemo } from "react"
import styles from "./ProgramTemplate.module.scss"
import utilStyles from "styles/utils.module.scss"
import cn from "classnames"

type ProgramTemplateProps = {
    program: ProgramType,
    coursesInfo: CourseInfoType[],
    programReport: ReportModelType[]
}


const ProgramTemplate = ({
    program,
    coursesInfo,
    programReport
}: ProgramTemplateProps) => {

    const router = useRouter()

    const onCourseClick = (courseId: string) => {
        if (coursesInfo.find(el => el.course.courseId === courseId)?.available)
            router.push(`${ROUTE_EDUCATION}/${router.query.programId}/courses/${courseId}/themes`)
    }

    const courses = useMemo(() => {
        return coursesInfo.map(courseInfo => {
            const programCourse = courseInfo.course.programCourses?.find(el => el.courseId === courseInfo.course.courseId)!
            const dependencies = coursesInfo.filter(el =>
                programCourse.dependencies.courseIds.includes(el.course.courseId!)
            )
            const status = programReport.find(el => el.id === courseInfo.course.courseId)?.status
            return {
                ...courseInfo,
                dependencies,
                status
            }
        }).sort((a, b) => {
            if (a.dependencies.map(el => el.course.courseId).includes(b.course.courseId))
                return -1
            return 1
        }) || []
    }, [coursesInfo, programReport])

    return (
        <Layout>
            <Head>
                <title>{`Программа "${program.title}"`}</title>
            </Head>
            <div className={utilStyles.title}>{`Программа "${program.title}"`}</div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>Описание программы</div>
                <div className={utilStyles.text_medium}>
                    {program.description}
                </div>
            </div>
            <div className={utilStyles.section_title}>Курсы программы</div>
            <div className={styles.course_container}>
                {courses?.map((course, courseKey) => (
                    <div
                        key={courseKey}
                        className={cn(
                            styles.course,
                            { [styles.course_unavailable]: !course.available }
                        )}
                        onClick={() => onCourseClick(course.course.courseId!)}
                    >
                        <div className={styles.course_name}>
                            {courseKey + 1}. <span>{course.course.title}</span><div className={styles.course_status}>{`(${course.status?.toFixed()}%)`}</div>
                        </div>
                        {course.dependencies.length > 0 &&
                            <div className={styles.course_dependencies}>
                                <div className={styles.course_dependencies_title}>
                                    Доступен после прохождения:
                                </div>
                                <div className={styles.course_dependencies_list}>
                                    {course.dependencies.map((dependency, dependencyKey) => (
                                        <div
                                            key={dependencyKey}
                                            className={styles.course_dependency}
                                        >
                                            {`"${dependency.course.title}"`}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                ))}
            </div>
        </Layout >
    )
}

export default ProgramTemplate