import Layout from "components/layouts/Layout"
import ItemList from "components/modules/itemList"
import { useModalWindowContext } from "context/modalWindowContext"
import Head from "next/head"
import { useEffect, useState } from "react"
import { CollectionType, TestAnswerType, TestType } from "../types"
import { Store } from "react-notifications-component"
import axiosApi from "utils/axios"
import { ENDPOINT_TESTS } from "constants/endpoints"

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
                Store.addNotification({
                    container: "top-right",
                    type: "success",
                    title: "Тест добавлен",
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            },
            onError: (error) => {
                Store.addNotification({
                    container: "top-right",
                    type: "danger",
                    title: "Не удалось добавить тест",
                    message: error.code,
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
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
                Store.addNotification({
                    container: "top-right",
                    type: "success",
                    title: "Тест изменён",
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            },
            onError: (error) => {
                Store.addNotification({
                    container: "top-right",
                    type: "danger",
                    title: "Не удалось добавить тест",
                    message: error.code,
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            }
        })
    }

    const deleteTest = (index: number) => {
        const id = tests[index].testId

        axiosApi.delete(`${ENDPOINT_TESTS}/${tests[index].testId}`)
            .then(res => {
                setTests(prev => prev.filter(el => el.testId !== id))
                setConfirmActionModalWindowState(undefined)
                Store.addNotification({
                    container: "top-right",
                    type: "success",
                    title: "Тест удалён",
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            })
            .catch(err => {
                Store.addNotification({
                    container: "top-right",
                    type: "danger",
                    title: "Не удалось удалить тест",
                    message: err.code,
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
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
                        (value === 0 ?
                            "С одним правильным вариантом" :
                            value === 1 ?
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
            />
        </Layout>
    )
}

export default CollectionTemplate