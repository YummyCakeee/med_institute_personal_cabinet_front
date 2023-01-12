import Layout from "components/layouts/Layout"
import Head from "next/head"
import React, { useEffect, useRef, useState } from "react"
import styles from "./testBlock.module.scss"
import cn from "classnames"
import { SolvedTestType, UserQuestionType } from "components/templates/education/types"
import { Field, FieldArray, Form, Formik, FormikValues } from "formik"
import Button from "components/elements/button/Button"
import { convertSecondsToFullTime } from "utils/formatters"
import { TestTypeId } from "components/templates/testing/types"
import axiosApi from "utils/axios"
import { ENDPOINT_EDUCATION } from "constants/endpoints"
import { useRouter } from "next/router"
import { useModalWindowContext } from "context/modalWindowContext"
import { ROUTE_EDUCATION } from "constants/routes"
import addNotification from "utils/notifications"

type TestBlockTemplateProps = {
    test: SolvedTestType
}

const TestBlockTemplate = ({
    test
}: TestBlockTemplateProps) => {

    const [leftTime, setLeftTime] = useState<number>(0)
    const timeoutRef = useRef<NodeJS.Timeout>()
    const [initialTest, setInitialTest] = useState<SolvedTestType>()
    const router = useRouter()
    const {
        setConfirmActionModalWindowState
    } = useModalWindowContext()

    useEffect(() => {
        setInitialTest(test)
        const endTime = new Date(test.endTestTime).getTime()
        const currentTime = new Date().getTime()
        const leftTime = Math.floor((endTime - currentTime) / 1000)
        setLeftTime(leftTime)
    }, [test])

    useEffect(() => {
        if (leftTime > 0) {
            timeoutRef.current = setTimeout(() => {
                setLeftTime(leftTime - 1)
            }, 1000)
        }
        return () => clearTimeout(timeoutRef.current)
    }, [leftTime, setLeftTime, timeoutRef])

    const scrollToSection = (scrollToId: string) => {
        const element = document.getElementById(scrollToId)
        if (element === null) return
        const y = element.getBoundingClientRect().top + window.scrollY -
            window.innerHeight / 2 + element.getBoundingClientRect().height / 2;
        window.scroll({
            top: y,
            behavior: 'auto',
        })
    }

    const onTestListMiniItemClick = (index: number) => {
        scrollToSection(index.toString())
    }

    useEffect(() => {
        console.log(initialTest)
    }, [initialTest])

    const onAnswerSubmit = (values: FormikValues) => {
        let question = initialTest?.userQuestions.find(el => el.questionText === values.questionText)
        if (!question) return
        let data: UserQuestionType = {
            questionText: "",
            answers: [],
            testType: TestTypeId.ONE_ANSWER
        }
        if (question.testType === TestTypeId.ONE_ANSWER) {
            data = {
                ...question,
                answers: question.answers.map(el => ({
                    ...el,
                    selected: values.answer === el.text
                }))
            }
        }
        else {
            data = {
                ...question,
                answers: values.answers
            }
        }
        const { programId, courseId, themeId } = router.query

        axiosApi.put(`${ENDPOINT_EDUCATION}/Programs/${programId}/Courses/${courseId}/Themes/${themeId}/TestBlock/Question`, data)
            .then(res => {
                if (initialTest)
                    setInitialTest({
                        ...initialTest,
                        userQuestions: initialTest.userQuestions.map(userQuestion => {
                            if (userQuestion.questionText !== data.questionText)
                                return userQuestion
                            return {
                                ...userQuestion,
                                answers: data.answers.slice()
                            }
                        })
                    })
            })
            .catch(err =>
                addNotification({ type: "danger", title: "Ошибка при сохранении ответа", message: err.code })
            )
    }

    const finishTest = () => {
        const { programId, courseId, themeId } = router.query
        axiosApi.put(`${ENDPOINT_EDUCATION}/Programs/${programId}/Courses/${courseId}/Themes/${themeId}/TestBlock/Finish`)
            .then(res => {
                router.replace(`${ROUTE_EDUCATION}/${programId}/courses/${courseId}/themes/${themeId}`)
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Не удалось завершить тест", message: err.code })
            })
    }

    const onTestFinishClick = () => {
        setConfirmActionModalWindowState({
            text: "Вы уверены, что хотите завершить тест?",
            onConfirm: finishTest,
            onDismiss: () => setConfirmActionModalWindowState(undefined),
            closable: true,
            backgroundOverlap: true
        })
    }

    return (
        <Layout>
            <Head>
                <title>Тест</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.time_left_container}>
                    <div className={styles.text}>Оставшееся время:</div>
                    <div className={cn(
                        styles.time,
                        { [styles.time_out]: leftTime === 0 }
                    )}>
                        {convertSecondsToFullTime(leftTime)}
                    </div>
                </div>
                <div className={styles.test_list_mini_container}>
                    <div>Вопросы</div>
                    <div className={styles.test_list_mini}>
                        {initialTest?.userQuestions.map((userQuestion, userQuestionKey) => (
                            <div
                                key={userQuestionKey}
                                className={cn(
                                    styles.item,
                                    { [styles.item_answered]: userQuestion.answers.find(el => el.selected) }
                                )}
                                onClick={() => onTestListMiniItemClick(userQuestionKey)}
                            >
                                {userQuestionKey + 1}
                            </div>
                        ))}
                    </div>
                    <div>
                        <Button
                            title="Завершить"
                            size="small"
                            onClick={onTestFinishClick}
                        />
                    </div>
                </div>
                <div className={styles.test_list}>
                    {initialTest?.userQuestions.map((userQuestion, userQuestionKey) => (
                        <section id={`${userQuestionKey}`} key={userQuestionKey}>
                            <div className={styles.test}>
                                <Formik
                                    initialValues={{
                                        questionText: userQuestion.questionText,
                                        answers: userQuestion.answers,
                                        testType: userQuestion.testType,
                                        answer: userQuestion.answers.find(el => el.selected)?.text
                                    }}
                                    enableReinitialize
                                    onSubmit={onAnswerSubmit}
                                >
                                    {({ values, submitForm }) => (
                                        <Form>
                                            <div className={styles.test_number}>{userQuestionKey + 1}</div>
                                            <div className={styles.test_question}>{userQuestion.questionText}</div>
                                            <div className={styles.test_questions_amount}>
                                                {userQuestion.testType === TestTypeId.ONE_ANSWER ?
                                                    "Выберите правильный ответ:" :
                                                    "Выберите один или несколько правильных ответов:"
                                                }
                                            </div>
                                            <div className={styles.test_answers}>
                                                <FieldArray
                                                    name="answers"
                                                    render={() => (
                                                        <>
                                                            {values.answers.map((answer, answerKey) => (
                                                                <div
                                                                    key={answerKey}
                                                                    className={styles.test_answer}
                                                                >
                                                                    {values.testType === TestTypeId.ONE_ANSWER ?
                                                                        <Field
                                                                            type="radio"
                                                                            name="answer"
                                                                            id={answer.text}
                                                                            value={answer.text}
                                                                            onClick={submitForm}
                                                                        /> :
                                                                        <Field
                                                                            type="checkbox"
                                                                            id={answer.text}
                                                                            name={`answers[${answerKey}].selected`}
                                                                            checked={answer.selected}
                                                                            onClick={submitForm}
                                                                        />
                                                                    }
                                                                    <label
                                                                        className={styles.test_answer_text}
                                                                        htmlFor={answer.text}
                                                                    >
                                                                        {answer.text}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </>
                                                    )}
                                                />
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </Layout >
    )
}

export default TestBlockTemplate