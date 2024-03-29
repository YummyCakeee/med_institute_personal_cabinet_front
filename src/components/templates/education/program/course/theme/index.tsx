import Button from "components/elements/button/Button"
import Layout from "components/layouts/Layout"
import ItemList from "components/modules/itemList"
import UserExerciseResultsInfo from "components/modules/userExerciseResultInfo"
import UserTestResultsInfo from "components/modules/userTestResultsInfo"
import { SolvedTestType, UserThemeType } from "components/templates/education/types"
import { TestBlockType } from "components/templates/testing/types"
import { ENDPOINT_EDUCATION } from "constants/endpoints"
import { ROUTE_EDUCATION } from "constants/routes"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect, useMemo, useRef, useState } from "react"
import utilStyles from "styles/utils.module.scss"
import axiosApi from "utils/axios"
import { convertSecondsToFullTime } from "utils/formatters"
import addNotification from "utils/notifications"
import styles from "./ThemeTemplate.module.scss"
import cn from "classnames"
import { getServerErrorResponse } from "utils/serverData"

type ThemeTemplateProps = {
    userTheme: UserThemeType,
    solvedTests?: SolvedTestType[],
    activeTest?: SolvedTestType,
    testBlock?: TestBlockType
}

const ThemeTemplate = ({
    userTheme,
    solvedTests,
    activeTest,
    testBlock
}: ThemeTemplateProps) => {

    const router = useRouter()
    const timeoutRef = useRef<NodeJS.Timeout>()
    const [activeAttemptLeftTime, setActiveAttemptLeftTime] = useState<number>(0)
    const [selectedSolvedTestIndex, setSelectedSolvedTestIndex] = useState<number>()
    const [isThemePassed, setIsThemePassed] = useState<boolean>(userTheme.themePassed)

    const hostName = (!process.env.NODE_ENV || process.env.NODE_ENV === "development") ?
        "http://localhost:5000" :
        "https://edu.instdpo.online"

    useEffect(() => {
        if (activeTest) {
            const endTime = new Date(activeTest.endTestTime).getTime()
            const currentTime = new Date().getTime()
            const leftTime = Math.floor((endTime - currentTime) / 1000)
            setActiveAttemptLeftTime(leftTime)
        }
    }, [activeTest])

    useEffect(() => {
        if (activeAttemptLeftTime > 0 && activeTest) {
            timeoutRef.current = setTimeout(() => {
                setActiveAttemptLeftTime(activeAttemptLeftTime - 1)
            }, 1000)
        }
        return () => clearTimeout(timeoutRef.current)
    }, [activeAttemptLeftTime, setActiveAttemptLeftTime, timeoutRef, activeTest])

    const html = useMemo(() => {
        return { __html: userTheme.theme.html }
    }, [userTheme.theme.html])

    const onTestStartClick = () => {
        const { programId, courseId, themeId } = router.query
        const requestUrl = `${ENDPOINT_EDUCATION}/Programs/${programId}/Courses/${courseId}/Themes/${themeId}/TestBlock`
        const route = `${ROUTE_EDUCATION}/${programId}/courses/${courseId}/themes/${themeId}/`
        axiosApi.post(requestUrl)
            .then(res => {
                router.push(route + (testBlock!.isFileTestBlock ? "exercise" : "test"))
            })
            .catch(err => {
                addNotification({
                    type: "danger", title: "Ошибка",
                    message: `Не удалось ${!testBlock!.isFileTestBlock ? "начать тест" : "приступить к упражнению"}:\n${getServerErrorResponse(err)}`
                })
            })
    }

    const onTestResumeClick = () => {
        const { programId, courseId, themeId } = router.query
        const route = `${ROUTE_EDUCATION}/${programId}/courses/${courseId}/themes/${themeId}/`
        router.push(route + (testBlock!.isFileTestBlock ? "exercise" : "test"))
    }

    const onTestInfoClick = (index: number) => {
        setSelectedSolvedTestIndex(index)
    }

    const onCloseTestInfoClick = () => {
        setSelectedSolvedTestIndex(undefined)
    }

    const onFinishThemeClick = () => {
        const { programId, courseId, themeId } = router.query
        axiosApi.put(`${ENDPOINT_EDUCATION}/Programs/${programId}/Courses/${courseId}/Themes/${themeId}/Finish`)
            .then(res => {
                setIsThemePassed(true)
                addNotification({ type: "success", title: "Успех", message: "Тема завершена" })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось завершить тему:\n${getServerErrorResponse(err)}` })
            })
    }

    return (
        <Layout>
            <Head>
                <title>{`Тема "${userTheme.theme.title}"`}</title>
            </Head>
            <div className={utilStyles.title} >{`Тема "${userTheme.theme.title}"`}</div>
            <div className={styles.container}>
                <div className={styles.theme_main_section}>
                    <div className={utilStyles.section}>
                        <div className={utilStyles.section_title}>Общая информация по теме</div>
                        <div dangerouslySetInnerHTML={html} />
                    </div>
                    {userTheme.theme.themeFiles &&
                        userTheme.theme.themeFiles.length > 0 &&
                        <div className={utilStyles.section}>
                            <div className={utilStyles.section_title}>Материалы темы</div>
                            <div className={styles.theme_files}>
                                {userTheme.theme.themeFiles.map((el, key) => (
                                    <div
                                        className={styles.theme_file}
                                        key={key}
                                    >
                                        <a href={`${hostName}${el.fileLink}`} target="_blank" rel="noreferrer" download>{el.fileName}</a>
                                        <div>
                                            {el.fileDescription}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    {testBlock ?
                        <div className={utilStyles.section}>
                            <div className={utilStyles.section_title}>Тестирование</div>
                            <div className={styles.test_time}>
                                Время на прохождение: <span>{testBlock.timeLimit} минут</span>
                            </div>
                            <div className={styles.test_date_end}>
                                Дата окончания: <span>{new Date(testBlock.dateEnd).toLocaleString()}</span>
                            </div>
                            {solvedTests && solvedTests.length > 0 &&
                                <PreviousAttempts
                                    {...{
                                        solvedTests,
                                        onTestInfoClick
                                    }}
                                />
                            }
                            <CurrentAttempt
                                {...{
                                    activeTest,
                                    activeAttemptLeftTime,
                                    onTestResumeClick,
                                    onTestStartClick,
                                    testBlock
                                }}
                            />
                        </div> :
                        <>
                            {!isThemePassed &&
                                <div className={utilStyles.section}>
                                    <div className={utilStyles.text_medium}>Для завершения темы нажмите на кнопку ниже:</div>
                                    <Button
                                        title="Завершить"
                                        size="small"
                                        onClick={onFinishThemeClick}
                                    />
                                </div>
                            }
                        </>
                    }
                </div>
                {solvedTests && selectedSolvedTestIndex !== undefined &&
                    <div className={styles.test_result_section}>
                        {solvedTests[selectedSolvedTestIndex].userQuestions.length > 0 ?
                            <UserTestResultsInfo
                                solvedTest={solvedTests[selectedSolvedTestIndex]}
                                onClose={onCloseTestInfoClick}
                                mode="student"
                            /> :
                            <UserExerciseResultsInfo
                                solvedTest={solvedTests[selectedSolvedTestIndex]}
                                onClose={onCloseTestInfoClick}
                                mode="student"
                            />
                        }
                    </div>
                }
            </div>
        </Layout >
    )
}

type PreviousAttemptsProps = {
    solvedTests: SolvedTestType[],
    onTestInfoClick: (index: number) => void
}

const PreviousAttempts = ({
    solvedTests,
    onTestInfoClick
}: PreviousAttemptsProps) => {

    return (
        <div className={utilStyles.section}>
            <div className={utilStyles.section_title}>Предыдущие попытки</div>
            <div className={styles.test_attempts}>
                <ItemList
                    headers={[
                        {
                            title: "Результат",
                            field: "resultPercent",
                            colSize: "120px",
                            textAlign: "center"
                        },
                        {
                            title: "Начата",
                            field: "startTestTime",
                            colSize: "200px",
                            textAlign: "center"
                        },
                        {
                            title: "Завершена",
                            field: "finishedTestTime",
                            colSize: "200px",
                            textAlign: "center"
                        }
                    ]}
                    items={solvedTests}
                    customFieldsRendering={[
                        {
                            fieldName: "resultPercent",
                            render: (value) => (`${Math.trunc(value)}%`)
                        },
                        {
                            fieldName: "startTestTime",
                            render: (value) => (new Date(value).toLocaleString())
                        },
                        {
                            fieldName: "finishedTestTime",
                            render: (value) => (new Date(value).toLocaleString())
                        }
                    ]}
                    itemControlButtons={() => [
                        {
                            title: "Подробнее",
                            size: "small",
                            onClick: onTestInfoClick
                        }
                    ]}
                    itemListClassName={styles.test_attempts_list}
                    deselectItemOnItemControlClick
                    scrollToBottomOnItemsUpdate
                />
            </div>
        </div>
    )
}

type CurrentAttemptProps = {
    activeTest?: SolvedTestType,
    activeAttemptLeftTime: number,
    onTestResumeClick: () => void,
    onTestStartClick: () => void,
    testBlock: TestBlockType,
}

const CurrentAttempt = ({
    activeTest,
    activeAttemptLeftTime,
    onTestResumeClick,
    onTestStartClick,
    testBlock
}: CurrentAttemptProps) => {

    const isOutdated = useMemo(() => {
        const currentTime = new Date().getTime()
        const endTime = new Date(testBlock.dateEnd).getTime()
        return currentTime >= endTime
    }, [testBlock])

    return (
        <div className={utilStyles.section}>
            {activeTest ?
                <>
                    <div className={utilStyles.section_title}>Текущая попытка</div>
                    <div>
                        <div className={styles.test_attempt_info}>
                            <div className={styles.test_attempt_info_section}>
                                <div className={styles.test_attempt_info_header}>
                                    Начата
                                </div>
                                <div className={styles.test_attempt_info_cell}>
                                    {new Date(activeTest.startTestTime).toLocaleString()}
                                </div>
                            </div>
                            <div className={styles.test_attempt_info_section}>
                                <div className={styles.test_attempt_info_header}>
                                    Дата завершения
                                </div>
                                <div className={styles.test_attempt_info_cell}>
                                    {new Date(activeTest.endTestTime).toLocaleString()}
                                </div>
                            </div>
                            {!testBlock.isFileTestBlock &&
                                <div className={styles.test_attempt_info_section}>
                                    <div className={styles.test_attempt_info_header}>
                                        Оставшееся время
                                    </div>
                                    <div className={styles.test_attempt_info_cell}>
                                        {convertSecondsToFullTime(activeAttemptLeftTime)}
                                    </div>
                                </div>
                            }
                        </div>
                        <Button
                            title={testBlock.isFileTestBlock ? "Редактировать" : "Продолжить"}
                            size="small"
                            stretchable={true}
                            onClick={onTestResumeClick}
                        />
                    </div>
                </>
                :
                <>
                    {!isOutdated ?
                        <>
                            <div className={utilStyles.section_title}>{`${testBlock.isFileTestBlock ? "Упражнение (ответ в виде файла)" : "Новая попытка (тест)"}`}</div>
                            <div>
                                <Button
                                    title={testBlock.isFileTestBlock ? "Добавить ответ" : "Начать"}
                                    size="small"
                                    stretchable={true}
                                    onClick={onTestStartClick}
                                />
                            </div>
                        </> :
                        <div className={cn(
                            utilStyles.text_medium,
                            utilStyles.text_bold
                        )}>
                            Новые попытки больше недоступны
                        </div>
                    }
                </>
            }
        </div>
    )
}

export default ThemeTemplate