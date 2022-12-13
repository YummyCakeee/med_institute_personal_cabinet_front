import Layout from "components/layouts/Layout"
import ItemList from "components/modules/itemList"
import Head from "next/head"
import React from "react"
import utilStyles from "styles/utils.module.scss"

const TestingTemplate = () => {


    return (
        <Layout>
            <Head>
                <title>
                    Коллекция тестов
                </title>
            </Head>
            <div>
                <div className={utilStyles.section_title}>Коллекция тестов</div>
                <ItemList
                    headers={[
                        {
                            title: "Тип теста",
                            field: "testTypeId",
                        },
                        {
                            title: "Тело теста",
                            field: "testBody",
                        },
                        {
                            title: "Дата создания",
                            field: "createDate",
                        },
                        {
                            title: "ID создателя",
                            field: "creatorId",
                        },
                        {
                            title: "Коллекция",
                            field: "collection",
                        }
                    ]}
                />
            </div>
            <div>
                <div className={utilStyles.section_title}>Коллекции</div>
                <ItemList
                    headers={[
                        {
                            title: "Название",
                            field: "name",
                        },
                        {
                            title: "Дата создания",
                            field: "createDate",
                        },
                        {
                            title: "ID создателя",
                            field: "creatorId",
                        }
                    ]}
                />
            </div>
            <div>
                <div className={utilStyles.section_title}>Тесты</div>
                <ItemList
                    headers={[
                        {
                            title: "Процент для зачёта",
                            field: "testScorePercent",
                        },
                        {
                            title: "Дата окончания",
                            field: "endDate",
                        }
                    ]}
                />
            </div>
        </Layout>
    )
}

export default TestingTemplate