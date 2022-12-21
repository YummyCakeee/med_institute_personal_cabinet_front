import Layout from "components/layouts/Layout"
import ItemList from "components/modules/itemList"
import { useModalWindowContext } from "context/modalWindowContext"
import Head from "next/head"
import { useEffect, useState } from "react"
import { CollectionType, TestAnswerType, TestType } from "../types"

type CollectionTemplateProps = {
    collection: CollectionType
}

const CollectionTemplate = ({ collection }: CollectionTemplateProps) => {

    const [tests, setTests] = useState<TestType[]>([])
    console.log(tests)
    const {
        setConfirmActionModalWindowState,
        setTestModalWindowState
    } = useModalWindowContext()

    useEffect(() => {
        setTests(collection.tests)
    }, [collection.tests])

    const onTestAddClick = () => {
        setTestModalWindowState({
            mode: "add",
            collectionId: collection.collectionId,
            setTests: setTests,
            backgroundOverlap: true,
            closable: true
        })
    }

    const onTestEditClick = (index: number) => {
        setTestModalWindowState({
            mode: "edit",
            test: tests[index],
            backgroundOverlap: true,
            closable: true
        })
    }

    const deleteTest = (index: number) => {
        const id = tests[index].testId

        setTests(prev => prev.filter(el => el.testId !== id))
        setConfirmActionModalWindowState(undefined)
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
                        field: "questionText"
                    },
                    {
                        title: "Ответы",
                        field: "answers"
                    },
                    {
                        title: "Тип теста",
                        field: "testTypeId"
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