import React, { useCallback, useEffect, useMemo, useState } from "react"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import { PercentageType, ProgramType } from "../types"
import { CourseType } from "components/templates/courses/types"
import utilStyles from "styles/utils.module.scss"
import styles from "./EducationalProgramCoursesTemplate.module.scss"
import SwapLists from "components/modules/swapLists"
import Button from "components/elements/button/Button"
import axiosApi from "utils/axios"
import axios from "axios"
import { ENDPOINT_PROGRAMS } from "constants/endpoints"
import Checkbox from "components/elements/checkbox/Checkbox"
import Input from "components/elements/input/Input"
import ComboBox from "components/elements/comboBox/ComboBox"
import { maxMinConstraint } from "utils/computations"
import cn from "classnames"
import { Store } from "react-notifications-component"

type EducationalProgramCoursesTemplateProps = {
    program: ProgramType,
    courses: CourseType[]
}

type CourseExtendedType = CourseType & {
    dependencies: string[],
    percentageType: PercentageType,
    value: number
}

const EducationalProgramCoursesTemplate = ({
    program,
    courses
}: EducationalProgramCoursesTemplateProps) => {

    const [initialProgramCourses, setInitialProgramCourses] = useState<CourseType[]>([])
    const [programCourses, setProgramCourses] = useState<CourseExtendedType[]>([])
    const [restCourses, setRestCourses] = useState<CourseExtendedType[]>([])
    const [selectedCourseIndex, setSelectedCourseIndex] = useState<number | undefined>(undefined)

    const percentageTypes = new Map<PercentageType, string>([
        [
            PercentageType.MIN,
            "Минимальный"
        ],
        [
            PercentageType.MAX,
            "Максимальный"
        ],
        [
            PercentageType.AVG,
            "Средний"
        ]
    ])

    const percentageTypeDefaultValue = useMemo(() => {
        if (selectedCourseIndex !== undefined && programCourses[selectedCourseIndex]) {
            return percentageTypes.get(programCourses[selectedCourseIndex].percentageType)
        }
        return "Не выбрано"
    }, [selectedCourseIndex, programCourses])

    useEffect(() => {
        const selectedCourses = courses.filter(course => program.programCourses?.find(
            programCourse => programCourse.courseId === course.courseId))
        setInitialProgramCourses(selectedCourses)

        setProgramCourses(selectedCourses.map(el => {
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
        }).sort((a, b) => {
            if (a.sortOrder > b.sortOrder) return 1
            if (a.sortOrder < b.sortOrder) return -1
            return 0
        }))

        setRestCourses(courses.filter(course =>
            !selectedCourses.find(selectedCourse => course.courseId === selectedCourse.courseId))
            .map(el => (
                {
                    ...el,
                    dependencies: [],
                    percentageType: PercentageType.MIN,
                    value: 0
                }
            )))

    }, [program, courses])

    const onCourseSelected = (index: number | undefined) => {
        setSelectedCourseIndex(index)
    }

    const dependentCourses: CourseType[] = useMemo(() => {
        if (selectedCourseIndex === undefined ||
            programCourses[selectedCourseIndex] === undefined)
            return []
        return programCourses.filter(el =>
            el.courseId !==
            programCourses[selectedCourseIndex].courseId
        )
    }, [programCourses, selectedCourseIndex])

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

    const onDependencyCourseChange = (id: string) => {
        if (selectedCourseIndex === undefined) return
        setProgramCourses(programCourses.map(el => {
            if (el.courseId === programCourses[selectedCourseIndex].courseId) {
                const dependencyIndex = programCourses[selectedCourseIndex].dependencies.findIndex(dependencyId => dependencyId === id)
                let dependencies: string[] = el.dependencies.slice()
                if (dependencyIndex === -1)
                    dependencies.push(id)
                else dependencies = dependencies.filter(el => el !== id)
                return {
                    ...el,
                    dependencies
                }
            }
            return el
        }))
    }

    const onPercentValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedCourseIndex === undefined) return
        setProgramCourses(programCourses.map(el => {
            if (el.courseId === programCourses[selectedCourseIndex].courseId) {
                return {
                    ...el,
                    value: maxMinConstraint(parseInt(e.target.value), 0, 100)
                }
            }
            return el
        }))
    }

    const onPercentageTypeSelect = (option: string) => {
        if (selectedCourseIndex === undefined) return
        for (const [key, value] of percentageTypes) {
            if (value === option)
                setProgramCourses(programCourses.map(el => {
                    if (el.courseId === programCourses[selectedCourseIndex].courseId) {
                        return {
                            ...el,
                            percentageType: key
                        }
                    }
                    return el
                }))
        }
    }

    return (
        <Layout>
            <Head>
                <title>{`Курсы программы обучения — ${program.title}`}</title>
            </Head>
            <div>
                <div className={utilStyles.title}>
                    Курсы программы<br />{program.title}
                </div>
                <div className={utilStyles.section_title}>Список курсов программы</div>
                <div className={styles.lists_container}>
                    <SwapLists
                        firstListItems={programCourses}
                        setFirstListItems={setProgramCourses}
                        secondListItems={restCourses}
                        setSecondListItems={setRestCourses}
                        firstListTitle="Последовательность изучения курсов программы"
                        secondListTitle="Остальные курсы"
                        onLeftListItemSelected={onCourseSelected}
                        renderItem={({ title }) => title}
                    />
                </div>
                <div className={cn(
                    styles.lists_container,
                    styles.lists_container_bottom,
                    { [styles.shown]: selectedCourseIndex !== undefined }
                )}>
                    <div className={styles.dependent_courses}>
                        <div className={utilStyles.text_medium}>Условия доступности курса</div>
                        <div className={styles.dependent_courses_list}>
                            {dependentCourses?.map((el: CourseType, key: number) => (
                                <div
                                    key={key}
                                    className={styles.dependent_courses_list_item}
                                >
                                    <div className={styles.text}>
                                        {el.title}
                                    </div>
                                    <Checkbox
                                        checked={selectedCourseIndex !== undefined &&
                                            programCourses[selectedCourseIndex]?.dependencies?.includes(el.courseId!)}
                                        onChange={() => onDependencyCourseChange(el.courseId!)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.course_criteria}>
                        <div className={utilStyles.text_medium}>Критерий прохождения курса</div>
                        <div className={utilStyles.text_small}>Тип подсчёта процента:</div>
                        <ComboBox
                            defaultValue={percentageTypeDefaultValue}
                            options={Array.from(percentageTypes.values())}
                            onSelect={onPercentageTypeSelect}
                        />
                        <div className={utilStyles.text_small}>Минимальный порог:</div>
                        <Input
                            type="number"
                            min={0}
                            max={100}
                            value={selectedCourseIndex !== undefined ?
                                programCourses[selectedCourseIndex]?.value : 0}
                            onChange={onPercentValueChange}
                        />
                    </div>
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

export default EducationalProgramCoursesTemplate