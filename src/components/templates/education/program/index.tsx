import Layout from "components/layouts/Layout"
import { CourseAvailableType } from "components/templates/courses/types"
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
    coursesAvailable: CourseAvailableType[]
}


const ProgramTemplate = ({
    program,
    coursesAvailable
}: ProgramTemplateProps) => {

    const router = useRouter()

    const onCourseClick = (courseId: string) => {
        router.push(`${ROUTE_EDUCATION}/${router.query.programId}/courses/${courseId}/themes`)
    }

    const courses = useMemo(() => {
        return program.programCourses?.map(programCourse => (
            {
                courseId: programCourse.courseId,
                title: programCourse.course?.title,
                available: !!coursesAvailable.find(courseAvailable => courseAvailable.courseId === programCourse.courseId),
                dependencies: programCourse.dependencies?.courseIds.map((dependencyId: string) =>
                    program.programCourses?.find(el => el.courseId === dependencyId)?.course)
                    .map(course => ({ title: course?.title, courseId: course?.courseId }))
            }
        )).sort((a, b) => {
            if (a.dependencies.map(el => el.courseId).includes(b.courseId))
                return 1
            return -1
        }) || []
    }, [program, coursesAvailable])

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
                        onClick={() => onCourseClick(course.courseId)}
                    >
                        <div className={styles.course_name}>
                            {courseKey + 1}. <span>{course.title}</span>
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
                                            {`"${dependency.title}"`}
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