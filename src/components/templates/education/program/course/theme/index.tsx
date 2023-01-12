import Button from "components/elements/button/Button"
import Layout from "components/layouts/Layout"
import ItemList from "components/modules/itemList"
import { SolvedTestType, UserThemeType } from "components/templates/education/types"
import { ROUTE_EDUCATION } from "constants/routes"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect, useMemo, useRef, useState } from "react"
import utilStyles from "styles/utils.module.scss"
import { convertSecondsToFullTime } from "utils/formatters"
import styles from "./ThemeTemplate.module.scss"

type ThemeTemplateProps = {
    userTheme: UserThemeType,
    solvedTests?: SolvedTestType[],
    activeTest?: SolvedTestType,
}

const ThemeTemplate = ({
    userTheme,
    solvedTests,
    activeTest
}: ThemeTemplateProps) => {


    const router = useRouter()
    const timeoutRef = useRef<NodeJS.Timeout>()
    const [activeAttemptLeftTime, setActiveAttemptLeftTime] = useState<number>(0)

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
        router.push({
            pathname: `${ROUTE_EDUCATION}/${programId}/courses/${courseId}/themes/${themeId}/testBlock`,
            query: {
                attempt: "new"
            }
        })
    }

    const onTestResumeClick = () => {
        const { programId, courseId, themeId } = router.query
        router.push({
            pathname: `${ROUTE_EDUCATION}/${programId}/courses/${courseId}/themes/${themeId}/testBlock`,
        })
    }

    return (
        <Layout>
            <Head>
                <title>{`Тема "${userTheme.theme.title}"`}</title>
            </Head>
            <div className={utilStyles.title} >{`Тема "${userTheme.theme.title}"`}</div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>Общая информация по теме</div>
                <div dangerouslySetInnerHTML={html} />
            </div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>Материалы темы</div>
            </div>
            {solvedTests && solvedTests.length > 0 &&
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
                            itemListClassName={styles.test_attempts_list}
                        />
                    </div>
                </div>
            }
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
                                <div className={styles.test_attempt_info_section}>
                                    <div className={styles.test_attempt_info_header}>
                                        Оставшееся время
                                    </div>
                                    <div className={styles.test_attempt_info_cell}>
                                        {convertSecondsToFullTime(activeAttemptLeftTime)}
                                    </div>
                                </div>
                            </div>
                            <Button
                                title="Продолжить"
                                size="small"
                                stretchable={true}
                                onClick={onTestResumeClick}
                            />
                        </div>
                    </>
                    :
                    <>
                        <div className={utilStyles.section_title}>Новая попытка</div>
                        <div>
                            <Button
                                title="Начать"
                                size="small"
                                onClick={onTestStartClick}
                            />
                        </div>
                    </>
                }
            </div>
        </Layout >
    )
}

export default ThemeTemplate