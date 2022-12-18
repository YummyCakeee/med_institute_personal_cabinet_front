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
    testBlockId: string,
    percentSuccess: number,
    timeLimit: number,
    dateEnd: string,
    creatorId: string,
    createDate: string,
    isFileTestBlock: boolean,
    testBlockCollections: []
}

export type TestBlockCollections = {
    testBlockCollectionId: string,
    testBlockId: string,
    collectionId: string,
    questionsAmount: string,
    createDate: string,
    testBlock: TestBlockType,
    collection: CollectionType
}

const useTesting = () => {

    const [collections, setCollections] = useState<CollectionType[]>([])
    const [testBlocks, setTestBlocks] = useState<TestBlockType[]>([])

    return {
        collections,
        setCollections,
        testBlocks,
        setTestBlocks
    }
}

export default useTesting