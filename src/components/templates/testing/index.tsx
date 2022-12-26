import Layout from "components/layouts/Layout"
import Head from "next/head"
import React, { useEffect } from "react"
import useTesting from "./useTesting"
import { CollectionType } from "./types"
import utilStyles from "styles/utils.module.scss"
import ItemList from "components/modules/itemList"

type TestingTemplateProps = {
    collections: CollectionType[]
}

const TestingTemplate = ({
    collections: initialCollections
}: TestingTemplateProps) => {

    const {
        collections,
        setCollections,
        onCollectionAddClick,
        onCollectionDeleteClick,
        onCollectionEditClick,
        onCollectionTestsEditClick
    } = useTesting()

    useEffect(() => {
        setCollections(initialCollections)
    }, [initialCollections, setCollections])

    return (
        <Layout>
            <Head>
                <title>
                    Тестирование
                </title>
            </Head>
            <div>
                <div className={utilStyles.section_title}>Коллекции</div>
                <ItemList
                    headers={[
                        {
                            title: "Название",
                            field: "collectionName",
                            colSize: "300px"
                        },
                        {
                            title: "Число тестов",
                            field: "tests.length",
                            colSize: "300px",
                            textAlign: "center"
                        },
                    ]}
                    items={collections}
                    itemControlButtons={() => [
                        {
                            title: "Редактировать",
                            size: "small",
                            stretchable: true,
                            onClick: onCollectionEditClick
                        },
                        {
                            title: "Редактировать тесты",
                            stretchable: true,
                            onClick: onCollectionTestsEditClick
                        },
                        {
                            title: "Удалить",
                            size: "small",
                            onClick: onCollectionDeleteClick
                        }
                    ]}
                    controlButtonsBottom={[
                        {
                            title: "Добавить",
                            size: "small",
                            onClick: onCollectionAddClick
                        }
                    ]}
                />
            </div>
        </Layout>
    )
}

export default TestingTemplate