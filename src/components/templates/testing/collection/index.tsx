import Layout from "components/layouts/Layout"
import ItemList from "components/modules/itemList"
import { useModalWindowContext } from "context/modalWindowContext"
import Head from "next/head"
import { useEffect, useState } from "react"
import { CollectionType, TestAnswerType, TestType, TestTypeId } from "../types"
import { Store } from "react-notifications-component"
import axiosApi from "utils/axios"
import { ENDPOINT_TESTS } from "constants/endpoints"
import styles from "./CollectionTemplate.module.scss"
import addNotification from "utils/notifications"
import { getServerErrorResponse } from "utils/serverData"

type CollectionTemplateProps = {
    collection: CollectionType
}

const CollectionTemplate = ({ collection }: CollectionTemplateProps) => {

    const [tests, setTests] = useState<TestType[]>([])
    const {
        setConfirmActionModalWindowState,
        setTestModalWindowState
    } = useModalWindowContext()

    useEffect(() => {
        if (collection.tests)
            setTests(collection.tests)
    }, [collection.tests])

    const onTestAddClick = () => {
        setTestModalWindowState({
            mode: "add",
            collectionId: collection.collectionId!,
            backgroundOverlap: true,
            closable: true,
            onSuccess: (test) => {
                setTests(prev => [...prev, test])
                setTestModalWindowState(undefined)
                addNotification({ type: "success", title: "Успех", message: "Тест добавлен" })
            },
            onError: (err) => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось добавить тест:\n${getServerErrorResponse(err)}` })
            }
        })
    }

    const onTestEditClick = (index: number) => {
        setTestModalWindowState({
            mode: "edit",
            collectionId: collection.collectionId!,
            backgroundOverlap: true,
            test: tests[index],
            closable: true,
            onSuccess: (test) => {
                setTests(prev => prev.map(el => {
                    if (el.testId === test.testId)
                        return test
                    return el
                }))
                setTestModalWindowState(undefined)
                addNotification({ type: "success", title: "Успех", message: "Тест изменён" })
            },
            onError: (err) => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось добавить тест:\n${getServerErrorResponse(err)}` })
            }
        })
    }

    const deleteTest = (index: number) => {
        const id = tests[index].testId

        axiosApi.delete(`${ENDPOINT_TESTS}/${tests[index].testId}`)
            .then(res => {
                setTests(prev => prev.filter(el => el.testId !== id))
                setConfirmActionModalWindowState(undefined)
                addNotification({ type: "success", title: "Успех", message: "Тест удалён" })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Успех", message: `Не удалось удалить тест:\n${getServerErrorResponse(err)}` })
            })

    }

    const onTestDeleteClick = (index: number) => {
        setConfirmActionModalWindowState({
            text: `Удалить тест "${tests[index].questionText}"?`,
            onConfirm: () => deleteTest(index),
            onDismiss: () => setConfirmActionModalWindowState(undefined),
            backgroundOverlap: true,
            closable: true
        })
    }

    return (
        <Layout>
            <Head>
                <title>Редактирование тестов коллекции {collection?.collectionName}</title>
            </Head>
            <ItemList
                headers={[
                    {
                        title: "Вопрос",
                        field: "questionText",
                        colSize: "400px"
                    },
                    {
                        title: "Ответы",
                        field: "answers",
                        colSize: "400px"
                    },
                    {
                        title: "Тип теста",
                        field: "testTypeId",
                        colSize: "300px"
                    }
                ]}
                customFieldsRendering={[
                    {
                        render: (value) =>
                        (value === TestTypeId.ONE_ANSWER ?
                            "С одним правильным вариантом" :
                            value === TestTypeId.MULTIPLE_ANSWERS ?
                                "С несколькими правильными ответами" :
                                "С ответом в виде файла"
                        ),
                        fieldName: "testTypeId"
                    },
                    {
                        render: (value) => (value.map((el: TestAnswerType, index: number) => (
                            `${index + 1}) ${el.text}${el.correct ? ": Верно" : ""}`
                        )).join('; ')),
                        fieldName: "answers"
                    }
                ]}
                items={tests}
                itemControlButtons={() => [
                    {
                        title: "Редактировать",
                        size: "small",
                        stretchable: true,
                        onClick: onTestEditClick
                    },
                    {
                        title: "Удалить",
                        size: "small",
                        onClick: onTestDeleteClick
                    }
                ]}
                controlButtonsBottom={[
                    {
                        title: "Добавить",
                        size: "small",
                        onClick: onTestAddClick
                    }
                ]}
                className={styles.collection_list}
            />
        </Layout>
    )
}

export default CollectionTemplate