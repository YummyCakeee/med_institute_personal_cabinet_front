import React, { memo, useEffect, useMemo, useRef } from "react"
import { EduFileType, SolvedTestType } from "components/templates/education/types"
import styles from "./UserExerciseResultInfo.module.scss"
import Button from "components/elements/button/Button"
import ExerciseComments from "../exerciseComments"
import { ENDPOINT_EDUCATION } from "constants/endpoints"
import axiosApi from "utils/axios"
import addNotification from "utils/notifications"
import { getServerErrorResponse } from "utils/serverData"

type UserExerciseResultsInfoProps = {
    solvedTest: SolvedTestType,
    onClose?: () => void,
    onCommentSend?: (comment: string, exerciseIndex: number) => Promise<any>,
    onExerciseScoreSetClick?: (exerciseIndex: number) => void,
    onFinishAttemptClick?: () => void,
    mode: "student" | "teacher",
}

const UserExerciseResultsInfo = ({
    solvedTest,
    onClose,
    onCommentSend = () => Promise.resolve(),
    onExerciseScoreSetClick = () => { },
    onFinishAttemptClick: finishAttempt = () => { },
    mode
}: UserExerciseResultsInfoProps) => {

    const downloadFileRef = useRef<HTMLAnchorElement>(null)

    const isFinished = useMemo(() => {
        if (!solvedTest.finishedTestTime) return false
        const currentTime = new Date().getTime()
        const endTime = new Date(solvedTest.finishedTestTime).getTime()
        return currentTime >= endTime
    }, [solvedTest])

    const onAttachedFileDownload = async (file: EduFileType) => {
        const params = {
            filename: file.fileLink
        }
        axiosApi.get(`${ENDPOINT_EDUCATION}/DownloadFile`, { params, responseType: "blob" })
            .then(res => {
                let url = window.URL.createObjectURL(res.data);
                if (downloadFileRef.current) {
                    const extension = file.fileLink.match(/.*(\..*)$/)
                    downloadFileRef.current.href = url
                    downloadFileRef.current.download = `${file.fileName}${extension?.length ? extension[1] : "txt"}`
                    downloadFileRef.current.click()
                }
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось скачать файл:\n${getServerErrorResponse(err)}` })
            })
    }

    const onFinishAttemptClick = () => {
        const unscoredExercises: number[] = []
        solvedTest.userExercises.forEach((el, index) => {
            if (!el.rating) unscoredExercises.push(index)
        })
        if (unscoredExercises.length) {
            addNotification({ type: "danger", title: "Ошибка", message: `Вы не выставили оценки за упражнения: ${unscoredExercises.join(', ')}` })
        }
        else finishAttempt()
    }

    return (
        <div className={styles.container}>
            <div className={styles.exercise_results_title}>
                {isFinished ? "Результаты выполнения упражнений" : "Упражнения"} от <span>{new Date(solvedTest.startTestTime).toLocaleString()}</span>
            </div>
            <div className={styles.exercise_list}>
                <a ref={downloadFileRef} target="_blank" rel="noreferrer" download></a>
                {solvedTest.userExercises.map((el, key) => (
                    <div
                        className={styles.exercise}
                        key={key}
                    >
                        <div className={styles.exercise_title}>{`Упражнение ${key + 1}`}</div>
                        <div className={styles.exercise_text}>
                            {el.exerciseText}
                        </div>
                        <div className={styles.exercise_file}>
                            {el.file ?
                                <>
                                    <div className={styles.exercise_file_title}>Прикреплённый файл: </div>
                                    <div
                                        className={styles.exercise_file_name}
                                        onClick={() => onAttachedFileDownload(el.file!)}
                                    >
                                        Название: <span>{el.file.fileName}</span>
                                    </div>
                                    <div
                                        className={styles.exercise_file_description}
                                    >
                                        Описание: <span>{el.file.fileDescription}</span>
                                    </div>
                                </> :
                                <div className={styles.exercise_file_absent}>
                                    Файл не прикреплён
                                </div>
                            }
                        </div>
                        <div className={styles.exercise_comments}>
                            {((el.teacherComments && el.teacherComments.length > 0) ||
                                (el.userComments && el.userComments.length > 0)) ||
                                mode === "teacher" ?
                                <ExerciseComments
                                    {...{
                                        mode,
                                        userComments: el.userComments,
                                        teacherComments: el.teacherComments,
                                        readOnly: mode === "student",
                                        className: styles.exercise_comments_container,
                                        onCommentSend: (comment) => onCommentSend(comment, key)
                                    }}
                                />
                                :
                                <div className={styles.exercise_comments_absent}>
                                    Комментарии отсутствуют
                                </div>
                            }
                        </div>
                        <div className={styles.exercise_score}>
                            Оценка: <span>{el.rating || "Не выставлена"}</span>
                            {mode === "teacher" &&
                                <Button
                                    title={el.rating ? "Поменять оценку" : "Выставить оценку"}
                                    size="small"
                                    stretchable
                                    className={styles.exercise_score_button}
                                    onClick={() => onExerciseScoreSetClick(key)}
                                />
                            }
                        </div>
                    </div>
                ))}
            </div>
            {mode === "teacher" && !isFinished &&
                < Button
                    title="Завершить попытку"
                    size="small"
                    stretchable
                    className={styles.finish_attempt_button}
                    onClick={onFinishAttemptClick}
                />
            }
            <div className={styles.result_info}>
                <div className={styles.result}>
                    Итоговый результат: <span>{solvedTest.resultPercent.toFixed()}%</span>
                </div>
            </div>
            {onClose &&
                <Button
                    title="Закрыть"
                    size="small"
                    className={styles.close_result_info_button}
                    onClick={onClose}
                />
            }
        </div>
    )
}


export default memo(UserExerciseResultsInfo)