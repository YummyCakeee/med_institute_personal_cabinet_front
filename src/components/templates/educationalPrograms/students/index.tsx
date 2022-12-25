import React, { useCallback, useEffect, useState } from "react"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import { PercentageType, ProgramType } from "../types"
import utilStyles from "styles/utils.module.scss"
import styles from "./EducationalProgramCoursesTemplate.module.scss"
import SwapLists from "components/modules/swapLists"
import Button from "components/elements/button/Button"
import axiosApi from "utils/axios"
import axios from "axios"
import { ENDPOINT_PROGRAMS } from "constants/endpoints"
import cn from "classnames"
import { Store } from "react-notifications-component"
import { UserProfileType } from "components/templates/users/types"

type EducationalProgramCoursesTemplateProps = {
    program: ProgramType,
    users: UserProfileType[]
}

const EducationalProgramStudentsTemplate = ({
    program,
    users
}: EducationalProgramCoursesTemplateProps) => {

    const [initialProgramUsers, setInitialProgramUsers] = useState<UserProfileType[]>([])
    const [programUsers, setProgramUsers] = useState<UserProfileType[]>([])
    const [restUsers, setRestUsers] = useState<UserProfileType[]>([])
    const [selectedUserIndex, setSelectedUserIndex] = useState<number | undefined>(undefined)

    useEffect(() => {
        const selectedCourses = courses.filter(course => program.programCourses?.find(
            programCourse => programCourse.courseId === course.courseId))
        setInitialProgramUsers(selectedCourses)

        setProgramUsers(selectedCourses.map(el => {
            const programCourse = program.programCourses!.find(programCourse =>
                programCourse.courseId === el.courseId)

            const dependencies = []
            let percentageType = 0
            let value = 0
            let sortOrder = 0
            if (programCourse) {
                dependencies.push(...programCourse.dependencies?.courseIds || [])
                percentageType = programCourse.courseCriteria?.percentageType || 0
                value = programCourse.courseCriteria?.value || 0,
                    sortOrder = programCourse.sortOrder
            }

            return {
                ...el,
                dependencies,
                percentageType,
                value,
                sortOrder
            }
        }))

        setRestUsers(courses.filter(course =>
            !selectedCourses.find(selectedCourse => course.courseId === selectedCourse.courseId))
            .map(el => (
                {
                    ...el,
                    dependencies: [],
                    percentageType: PercentageType.MIN,
                    value: 0
                }
            )))

    }, [program, users])

    const onUserSelected = (index: number | undefined) => {
        setSelectedUserIndex(index)
    }


    const onSubmit = useCallback(() => {
        const newCourses = programCourses.filter(programCourse =>
            !initialProgramCourses.find(initialProgramCourse =>
                programCourse.courseId === initialProgramCourse.courseId
            ))

        const updatedCourses = programCourses.filter(programCourse =>
            initialProgramCourses.find(initialProgramCourse =>
                programCourse.courseId === initialProgramCourse.courseId
            ))

        const deletedCoursesIds = initialProgramCourses.filter(initialProgramCourse =>
            !programCourses.find(programCourse => initialProgramCourse.courseId === programCourse.courseId
            )).map(el => el.courseId)

        const deletedProgramCoursesIds = program.programCourses?.filter(programCourse =>
            deletedCoursesIds.find(deletedCourseId => deletedCourseId === programCourse.courseId
            )).map(el => el.programCourseId) || []

        axios.all([
            ...newCourses.map(course => {
                const data = {
                    courseDependency: {
                        courseIds: course.dependencies.filter(dependencyId =>
                            programCourses.find(programCourse => programCourse.courseId === dependencyId))
                            .map(el => parseInt(el))
                    },
                    courseCriteria: {
                        percentageType: course.percentageType,
                        value: course.value
                    },
                    sortOrder: programCourses.findIndex(el => el.courseId === course.courseId)
                }
                return axiosApi.post(`${ENDPOINT_PROGRAMS}/${program.programId}/Course/${course.courseId}`, data)
            }),
            ...updatedCourses.map(course => {
                const data = {
                    courseDependency: {
                        courseIds: course.dependencies.filter(dependencyId =>
                            programCourses.find(programCourse => programCourse.courseId === dependencyId))
                            .map(el => parseInt(el))
                    },
                    courseCriteria: {
                        percentageType: course.percentageType,
                        value: course.value
                    },
                    sortOrder: programCourses.findIndex(el => el.courseId === course.courseId)
                }
                return axiosApi.put(`${ENDPOINT_PROGRAMS}/${program.programId}/Course/${course.courseId}`, data)
            }),
            ...deletedProgramCoursesIds.map(el => {
                return axiosApi.delete(`${ENDPOINT_PROGRAMS}/Course/${el}`)
            })
        ])
            .then(res => {
                Store.addNotification({
                    container: "top-right",
                    type: "success",
                    title: "Курсы обновлены",
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            })
            .catch(err => {
                Store.addNotification({
                    container: "top-right",
                    type: "danger",
                    title: "Не удалось обновить курсы",
                    message: `${err.code}`,
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            })

    }, [initialProgramCourses, programCourses, program])

    return (
        <Layout>
            <Head>
                <title>{`Обучающиеся программы обучения — ${program.title}`}</title>
            </Head>
            <div>
                <div className={utilStyles.title}>
                    Обучающиеся программы<br />{program.title}
                </div>
                <div className={utilStyles.section_title}>Список обучающихся программы</div>
                <div className={styles.lists_container}>
                    <SwapLists
                        firstListItems={programUsers}
                        setFirstListItems={setProgramUsers}
                        secondListItems={restUsers}
                        setSecondListItems={setRestUsers}
                        firstListTitle="Обучающиеся программы"
                        secondListTitle="Остальные обучающиеся"
                        onLeftListItemSelected={onUserSelected}
                    />
                </div>
                <div className={styles.save_button_container}>
                    <Button
                        title="Сохранить"
                        size="small"
                        className={styles.save_button}
                        onClick={onSubmit}
                    />
                </div>
            </div>
        </Layout>
    )
}

export default EducationalProgramStudentsTemplate