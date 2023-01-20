import React, { memo, useEffect, useMemo, useRef } from "react"
import { EduFileType, SolvedTestType } from "components/templates/education/types"
import styles from "./UserExerciseResultInfo.module.scss"
import Button from "components/elements/button/Button"
import { convertSecondsToFullTime } from "utils/formatters"
import ExerciseComments, { CommentType } from "../exerciseComments"
import { ENDPOINT_EDUCATION } from "constants/endpoints"
import axiosApi from "utils/axios"
import addNotification from "utils/notifications"
import { ExerciseCommentType } from "components/templates/education/types"


type UserExerciseResultsInfoProps = {
    solvedTest: SolvedTestType,
    onClose?: () => void,
    mode: "student" | "teacher"
}

const UserExerciseResultsInfo = ({
    solvedTest,
    onClose,
    mode
}: UserExerciseResultsInfoProps) => {

    const downloadFileRef = useRef<HTMLAnchorElement>(null)

    const elapsedTime = useMemo(() => {
        const startTime = new Date(solvedTest.startTestTime).getTime()
        const endTime = new Date(solvedTest.finishedTestTime).getTime()
        const time = Math.floor((endTime - startTime) / 1000)
        return time
    }, [solvedTest])

    const isFinished = useMemo(() => {
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
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось скачать файл:\n${err.code}` })
            })
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
                            {(el.teacherComments && el.teacherComments.length > 0) ||
                                (el.userComments && el.userComments.length > 0) ?
                                <ExerciseComments
                                    {...{
                                        mode,
                                        userComments: el.userComments,
                                        teacherComments: el.teacherComments,
                                        readOnly: true,
                                        className: styles.exercise_comments_container
                                    }}
                                />
                                :
                                <div className={styles.exercise_comments_absent}>
                                    Комментарии отсутствуют
                                </div>
                            }
                        </div>
                        <div className={styles.exercise_score}>
                            Оценка: <span>{el.rating}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.result_info}>
                {/* <div className={styles.correct_answers_amount}>
                    Верных ответов: <span>{correctAnswersAmount}/{solvedTest.userQuestions.length}</span>
                </div> */}
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