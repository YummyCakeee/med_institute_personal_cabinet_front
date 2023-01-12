import Layout from "components/layouts/Layout"
import { CourseInfoType } from "components/templates/courses/types"
import { ProgramType } from "components/templates/educationalPrograms/types"
import { ROUTE_EDUCATION } from "constants/routes"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useMemo } from "react"
import styles from "./ProgramTemplate.module.scss"
import utilStyles from "styles/utils.module.scss"
import cn from "classnames"

type ProgramTemplateProps = {
    program: ProgramType,
    coursesInfo: CourseInfoType[]
}


const ProgramTemplate = ({
    program,
    coursesInfo
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
            return {
                ...courseInfo,
                dependencies: dependencies
            }
        }).sort((a, b) => {
            if (a.dependencies.map(el => el.course.courseId).includes(b.course.courseId))
                return -1
            return 1
        }) || []
    }, [program, coursesInfo])

    return (
        <Layout>
            <Head>
                <title>{`Курсы программы "${program.title}"`}</title>
            </Head>
            <div className={utilStyles.title}>{`Программа "${program.title}"`}</div>
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
                            {courseKey + 1}. <span>{course.course.title}</span>
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