import React, { memo, useCallback, useMemo, useRef } from "react"
import { SolvedTestType, UserAnswerType } from "components/templates/education/types"
import styles from "./UserTestResultInfo.module.scss"
import { convertSecondsToFullTime } from "utils/formatters"
import cn from "classnames"
import Button from "components/elements/button/Button"
import ReactToPrint from "react-to-print"
import { UserProfileType } from "components/templates/users/types"

type UserTestResultsInfoProps = {
    solvedTest: SolvedTestType,
    onClose?: () => void,
    mode: "teacher" | "student",
    user?: UserProfileType
}

const UserTestResultsInfo = ({
    solvedTest,
    onClose,
    mode,
    user
}: UserTestResultsInfoProps) => {


    const elapsedTime = (() => {
        const startTime = new Date(solvedTest.startTestTime).getTime()
        const endTime = new Date(solvedTest.finishedTestTime).getTime()
        const time = Math.floor((endTime - startTime) / 1000)
        return time
    })()

    const getScore = (score: number) => {
        if (score === 0 || score === 1) return score
        return score.toFixed(2)
    }

    const correctAnswersAmount = solvedTest.userQuestions.reduce((acc, cur) => (
        cur.score === 1 ? acc + 1 : acc
    ), 0)

    const resultComponentRef = useRef(null)

    const reactToPrintContent = useCallback(() => {
        return resultComponentRef.current;
    }, []);

    return (
        <div className={styles.container} ref={resultComponentRef}>
            <div className={styles.test_results_title}>
                Результаты теста от <span>{new Date(solvedTest.startTestTime).toLocaleString()}</span>
            </div>
            {user &&
                <div className={styles.test_student_info}>
                    {`Студент ${user.lastName} ${user.firstName} ${user.secondName}`}
                </div>
            }
            <div className={styles.questions_title}>
                Вопросы
            </div>
            <div className={styles.question_list}>
                {solvedTest.userQuestions.map((userQuestion, userQuestionKey) => (
                    <div
                        key={userQuestionKey}
                        className={styles.question}
                    >
                        <div className={styles.question_text}>
                            {userQuestion.questionText}
                        </div>
                        <div>
                            <div>
                                Ответ:
                            </div>
                            <div className={styles.question_answer_list}>
                                <UserAnswers
                                    answers={userQuestion.answers}
                                />
                            </div>
                        </div>
                        <div className={cn(
                            styles.question_score,
                            { [styles.max]: userQuestion.score === 1 },
                            { [styles.zero]: userQuestion.score === 0 }
                        )}>
                            Баллы за ответ: <span>{getScore(userQuestion.score || 0)}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.result_info}>
                <div className={styles.elapsed_time}>
                    Затраченное время: <span>{convertSecondsToFullTime(elapsedTime)}</span>
                </div>
                <div className={styles.correct_answers_amount}>
                    Верных ответов: <span>{correctAnswersAmount}/{solvedTest.userQuestions.length}</span>
                </div>
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
            {mode === "teacher" &&
                <div className={styles.print_result_section}>
                    <ReactToPrint
                        trigger={() =>
                            <Button
                                title="Распечатать"
                                stretchable
                                size="small"
                            />}
                        content={reactToPrintContent}
                    />
                </div>
            }
        </div>
    )
}

const UserAnswers = ({
    answers
}: { answers: UserAnswerType[] }) => {

    const leftAnswers = useMemo(() => {
        return answers.filter(el => el.selected)
    }, [answers])

    return (
        <>
            {leftAnswers.length ?
                <>
                    {leftAnswers.map((answer, answerKey) => (
                        <div
                            key={answerKey}
                            className={styles.question_answer}
                        >
                            {(answerKey + 1) + ") " + answer.text}
                        </div>
                    ))}
                </> :
                <div className={styles.question_answer}>
                    Нет ответа
                </div>
            }
        </>
    )
}

export default memo(UserTestResultsInfo)