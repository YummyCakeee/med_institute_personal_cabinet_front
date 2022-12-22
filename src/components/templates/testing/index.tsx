import Layout from "components/layouts/Layout"
import Head from "next/head"
import React, { useEffect } from "react"
import Collections from "./Collections"
import TestBlocks from "./TestBlocks"
import useTesting from "./useTesting"
import { CollectionType, TestBlockType } from "./types"

type TestingTemplateProps = {
    testBlocks: TestBlockType[],
    collections: CollectionType[],
}

const TestingTemplate = ({
    collections: initialCollections,
    testBlocks: initialTestBlocks
}: TestingTemplateProps) => {

    const {
        collections,
        setCollections,
        testBlocks,
        setTestBlocks
    } = useTesting()

    useEffect(() => {
        setCollections(initialCollections)
    }, [initialCollections])

    useEffect(() => {
        setTestBlocks(initialTestBlocks)
    }, [initialTestBlocks])

    return (
        <Layout>
            <Head>
                <title>
                    Тестирование
                </title>
            </Head>
            <div>
                <Collections
                    {...{
                        collections,
                        setCollections
                    }}
                />
            </div>
            <div>
                <TestBlocks
                    {...{
                        testBlocks,
                        setTestBlocks
                    }}
                />
            </div>
        </Layout>
    )
}

export default TestingTemplate