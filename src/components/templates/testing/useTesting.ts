import { useState } from "react"

export type CollectionType = {
    collectionId: string,
    collectionName: string,
    creatorId: string,
    createDate: string,
    tests: TestType[]
}

export type TestType = {
    testId: string,
    collectionId: string,
    testTypeId: number,
    questionText: string,
    answers: TestAnswerType[]
    creatorId?: string,
    createDate: string,
    collection?: string,
}

export type TestAnswerType = {
    text: string,
    correct: false,
}

export type TestBlockType = {
    test: TestType,
    collection: CollectionType
}

const useTesting = () => {

    const [tests, setTests] = useState<TestType[]>([])
    const [collections, setCollections] = useState<CollectionType[]>([])
    const [testBlocks, setTestBlocks] = useState<TestBlockType[]>()

    return {
        collections,
        setCollections,
        testBlocks,
        setTestBlocks
    }
}

export default useTesting