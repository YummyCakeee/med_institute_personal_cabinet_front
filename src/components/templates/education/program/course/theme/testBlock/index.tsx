import Layout from "components/layouts/Layout"
import Head from "next/head"
import React, { useEffect, useMemo, useRef, useState } from "react"
import styles from "./testBlock.module.scss"
import utilStyles from "styles/utils.module.scss"
import cn from "classnames"


const TestBlockTemplate = () => {

    const [leftTime, setLeftTime] = useState<number>(3000)
    const timeoutRef = useRef<NodeJS.Timeout>()

    ///
    const [tests, setTests] = useState<{ question: string, answers: string[] }[]>([])
    useEffect(() => {
        const testsArray: { question: string, answers: string[] }[] = []
        for (let i = 0; i < 40; i++) {
            testsArray.push({
                question: "В каком году был открыт пенициллин? Выберите верную дату из представленных",
                answers: ["2010", "1900", "1500", "2022"]
            })
        }
        setTests(testsArray)
    }, [])
    ///

    useEffect(() => {
        if (leftTime > 0) {
            timeoutRef.current = setTimeout(() => {
                setLeftTime(leftTime - 1)
            }, 1000)
        }
        return () => clearTimeout(timeoutRef.current)
    }, [leftTime, setLeftTime, timeoutRef])

    const convertedLeftTime = () => {
        const hours = Math.floor(leftTime / 3600).toString()
        const minutes = (Math.floor(leftTime / 60) % 60).toString().padStart(2, "0")
        const seconds = (leftTime % 60).toString().padStart(2, "0")
        return `${hours}:${minutes}:${seconds}`
    }

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

    return (
        <Layout>
            <Head>
                <title>{`Тест "${null}"`}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.time_left_container}>
                    <div className={styles.text}>Оставшееся время:</div>
                    <div className={cn(
                        styles.time,
                        { [styles.time_out]: leftTime === 0 }
                    )}>
                        {convertedLeftTime()}
                    </div>
                </div>
                <div className={styles.test_list_mini_container}>
                    <div>Вопросы</div>
                    <div className={styles.test_list_mini}>
                        {tests.map((el, key) => (
                            <div
                                key={key}
                                className={styles.item}
                                onClick={() => onTestListMiniItemClick(key)}
                            >
                                {key + 1}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.test_list}>
                    {tests.map((test, testKey) => (
                        <section id={`${testKey}`}>
                            <div key={testKey} className={styles.test}>
                                <div className={styles.test_number}>{testKey + 1}</div>
                                <div className={styles.test_question}>{test.question}</div>
                                <div className={styles.test_answers}>
                                    {test.answers.map((answer, answerKey) => (
                                        <div key={answerKey}>{answer}</div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </Layout >
    )
}

export default TestBlockTemplate