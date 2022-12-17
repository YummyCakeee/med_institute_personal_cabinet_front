import React, { useCallback, useEffect, useMemo, useState } from "react"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import { EducationalProgramType } from ".."
import { CourseType } from "components/templates/courses/useCourses"
import utilStyles from "styles/utils.module.scss"
import styles from "./EducationalProgramCoursesTemplate.module.scss"
import SwapLists from "components/modules/swapLists"
import { Field, Form, Formik, FormikValues } from "formik"
import CheckboxField from "components/elements/formikComponents/checkboxField/CheckboxField"
import Button from "components/elements/button/Button"

type EducationalProgramCoursesTemplateProps = {
    program: EducationalProgramType,
    courses: CourseType[]
}

const EducationalProgramCoursesTemplate = ({
    program,
    courses
}: EducationalProgramCoursesTemplateProps) => {

    const [programCourses, setProgramCourses] = useState<CourseType[]>([])
    const [restCourses, setRestCourses] = useState<CourseType[]>([])
    const [selectedCourseIndex, setSelectedCourseIndex] = useState<number | undefined>(undefined)

    useEffect(() => {
        setProgramCourses(courses)
    }, [courses])

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

    const onSubmit = (values: FormikValues) => {
        console.log(values)
    }

    return (
        <Layout>
            <Head>
                <title>Программы обучения — {program.title}</title>
            </Head>
            <div>
                <div className={utilStyles.title}>
                    Курсы программы<br />{program.title}
                </div>
                <div className={utilStyles.section_title}>Список курсов программы</div>
                <Formik
                    initialValues={{
                        programCourses: programCourses.map(el => el.courseId),
                        dependentCourses: dependentCourses.map(el => el.courseId)
                    }}
                    enableReinitialize
                    onSubmit={onSubmit}
                >
                    {() => (
                        <Form>
                            <div className={styles.lists_container}>
                                <SwapLists
                                    firstListItems={programCourses}
                                    setFirstListItems={setProgramCourses}
                                    secondListItems={restCourses}
                                    setSecondListItems={setRestCourses}
                                    firstListTitle="Последовательность изучения курсов программы"
                                    secondListTitle="Остальные курсы"
                                    onLeftListItemSelected={onCourseSelected}
                                />
                                <div className={styles.dependent_courses}>
                                    <div className={utilStyles.text_medium}>Условия доступности курса</div>
                                    <div className={styles.dependent_courses_list}>
                                        {dependentCourses?.map((el: CourseType, key: number) => (
                                            <div
                                                key={key}
                                                className={styles.dependent_courses_list_item}
                                            >
                                                {el.title}
                                                <Field
                                                    name="dependentCourses"
                                                    component={CheckboxField}
                                                    value={el.courseId}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.save_button_container}>
                                <Button
                                    title="Сохранить"
                                    size="small"
                                    className={styles.save_button}
                                    type="submit"
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Layout>
    )
}

export default EducationalProgramCoursesTemplate