import LoadingStatusWrapper, { LoadingStatusType } from "components/modules/LoadingStatusWrapper/LoadingStatusWrapper"
import Layout from "components/layouts/Layout"
import ItemList from "components/modules/itemList"
import UserExerciseResultInfo from "components/modules/userExerciseResultInfo"
import UserTestResultsInfo from "components/modules/userTestResultsInfo"
import { ThemeType } from "components/templates/courses/types"
import { ExerciseCommentType, SolvedTestType, UserExerciseType } from "components/templates/education/types"
import { UserProfileType } from "components/templates/users/types"
import { ENDPOINT_EDUCATION } from "constants/endpoints"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import utilStyles from "styles/utils.module.scss"
import axiosApi from "utils/axios"
import addNotification from "utils/notifications"
import styles from "./ThemeTemplate.module.scss"
import { useModalWindowContext } from "context/modalWindowContext"
import { getServerErrorResponse } from "utils/serverData"

type ThemeTemplateProps = {
    theme: ThemeType,
    themeStudents: UserProfileType[]
}

type AttemptType = {
    date: string
}

const ThemeTemplate = ({
    theme,
    themeStudents
}: ThemeTemplateProps) => {

    const router = useRouter()
    const [studentAttemptsStatus, setStudentAttemptsStatus] = useState<LoadingStatusType>(LoadingStatusType.LOADED)
    const [studentAttempts, setStudentAttempts] = useState<AttemptType[]>([])
    const [attempt, setAttempt] = useState<SolvedTestType>()
    const [selectedStudentIndex, setSelectedStudentIndex] = useState<number>()
    const { setExerciseScoreModalWindowState } = useModalWindowContext()

    useEffect(() => {
        setAttempt(undefined)
    }, [selectedStudentIndex])

    const onStudentAttemptsClick = async (index: number) => {
        setStudentAttemptsStatus(LoadingStatusType.LOADING)
        setSelectedStudentIndex(index)
        const themeId = theme.themeId
        const studentId = themeStudents[index].userId
        axiosApi.get(`${ENDPOINT_EDUCATION}/Themes/${themeId}/Student/${studentId}`)
            .then(res => {
                setStudentAttempts(res.data.map((el: string) => ({ date: el })))
                setStudentAttemptsStatus(LoadingStatusType.LOADED)
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось загрузить спосок попыток студента:\n${getServerErrorResponse(err)}` })
                setStudentAttemptsStatus(LoadingStatusType.LOAD_ERROR)
            })
    }

    const onAttemptInfoClick = (index: number) => {
        if (selectedStudentIndex === undefined) return
        const studentId = themeStudents[selectedStudentIndex].userId
        const themeId = theme.themeId
        const attemptDate = studentAttempts[index].date
        axiosApi.get(`${ENDPOINT_EDUCATION}/Themes/${themeId}/Student/${studentId}/Attemp/${attemptDate}`)
            .then(res => {
                setAttempt(res.data)
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось получить информацию о попытке:\n${getServerErrorResponse(err)}` })
            })
    }

    const onCommentSend = async (comment: string, exerciseIndex: number) => {
        if (!attempt || selectedStudentIndex === undefined) return
        const { themeId } = router.query
        const currentExercice = attempt.userExercises[exerciseIndex]
        const newComment: ExerciseCommentType = {
            text: comment
        }
        const data: UserExerciseType = {
            exerciseText: currentExercice.exerciseText,
            rating: currentExercice.rating,
            teacherComments: [newComment],
            userComments: [],
        }
        return axiosApi.put(`${ENDPOINT_EDUCATION}/Themes/${themeId}/Attemp/${attempt.startTestTime}/User/${themeStudents[selectedStudentIndex].userId}/Finish/false`, data)
            .then(res => {
                setAttempt({
                    ...attempt,
                    userExercises: attempt.userExercises.map((el, key) => {
                        if (key !== exerciseIndex) return el
                        return {
                            ...el,
                            teacherComments: [...(el.userComments || []), { text: newComment.text, dateTime: new Date().toISOString() }]
                        }
                    })
                })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось отправить комментарий:\n${getServerErrorResponse(err)}` })
                return Promise.reject()
            })
    }

    const onExerciseScoreSetClick = (exerciseIndex: number) => {
        const { themeId } = router.query
        if (!attempt || selectedStudentIndex === undefined || typeof themeId !== "string") return
        setExerciseScoreModalWindowState({
            attemptDate: attempt.startTestTime,
            exercise: attempt.userExercises[exerciseIndex],
            themeId,
            userId: themeStudents[selectedStudentIndex].userId!,
            backgroundOverlap: true,
            closable: true,
            onSuccess: (exercise) => {
                setAttempt({
                    ...attempt,
                    userExercises: attempt.userExercises.map((el, key) => {
                        if (key !== exerciseIndex) return el
                        return exercise
                    })
                })
                addNotification({ type: "success", title: "Успех", message: `За упражнение ${exerciseIndex + 1} выставлена оценка ${exercise.rating}` })
                setExerciseScoreModalWindowState(undefined)
            },
            onError: (err) => addNotification({ type: "danger", title: "Ошибка", message: `Не удалось выставить оценку:\n${getServerErrorResponse(err)}` })
        })
    }

    const onFinishAttemptClick = () => {
        if (!attempt || selectedStudentIndex === undefined) return
        const { themeId } = router.query
        const currentExercice = attempt.userExercises[0]
        const data: UserExerciseType = {
            exerciseText: currentExercice.exerciseText,
            rating: currentExercice.rating,
            teacherComments: [],
            userComments: [],
        }
        return axiosApi.put(`${ENDPOINT_EDUCATION}/Themes/${themeId}/Attemp/${attempt.startTestTime}/User/${themeStudents[selectedStudentIndex].userId}/Finish/true`, data)
            .then(res => {
                setAttempt({
                    ...attempt,
                    finishedTestTime: res.data
                })
                addNotification({ type: "success", title: "Успех", message: "Попытка завершена" })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось завершить попытку:\n${getServerErrorResponse(err)}` })
            })
    }

    return (
        <Layout>
            <Head>
                <title>{`Тема "${theme.title}"`}</title>
            </Head>
            <div className={utilStyles.title} >{`Тема "${theme.title}"`}</div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>
                    Список студентов с темой
                </div>
                <div className={styles.lists_container}>
                    <ItemList
                        headers={[
                            {
                                title: "Фамилия",
                                field: "lastName"
                            },
                            {
                                title: "Имя",
                                field: "firstName"
                            },
                            {
                                title: "Отчество",
                                field: "secondName"
                            }
                        ]}
                        items={themeStudents}
                        itemControlButtons={() => [
                            {
                                title: "Попытки",
                                size: "small",
                                onClick: onStudentAttemptsClick
                            }
                        ]}
                        className={styles.students_list}
                    />
                    <LoadingStatusWrapper
                        status={studentAttemptsStatus}
                    >
                        <ItemList
                            headers={[
                                {
                                    title: "Дата начала попытки",
                                    field: "date"
                                }
                            ]}
                            items={studentAttempts}
                            customFieldsRendering={[
                                {
                                    fieldName: "date",
                                    render: (value) => new Date(value).toLocaleString()
                                }
                            ]}
                            itemControlButtons={() => [
                                {
                                    title: "Результат",
                                    size: "small",
                                    stretchable: true,
                                    onClick: onAttemptInfoClick
                                }
                            ]}
                            className={styles.attempts_list}
                            scrollToBottomOnItemsUpdate
                        />
                    </LoadingStatusWrapper>
                    {attempt &&
                        <>
                            {attempt.userExercises && attempt.userExercises.length > 0 &&
                                <UserExerciseResultInfo
                                    {...{
                                        mode: "teacher",
                                        solvedTest: attempt,
                                        onCommentSend,
                                        onExerciseScoreSetClick,
                                        onFinishAttemptClick,
                                    }}
                                />
                            }
                            {attempt.userQuestions && attempt.userQuestions.length > 0 && selectedStudentIndex !== undefined &&
                                <UserTestResultsInfo
                                    {...{
                                        mode: "teacher",
                                        solvedTest: attempt,
                                        user: themeStudents[selectedStudentIndex]
                                    }}
                                />
                            }
                        </>
                    }
                </div>
            </div>
        </Layout >
    )
}

export default ThemeTemplate