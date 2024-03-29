export type CollectionType = {
    collectionId?: string,
    collectionName: string,
    creatorId?: string,
    createDate?: string,
    tests?: TestType[]
}

export enum TestTypeId {
    ONE_ANSWER = "One", MULTIPLE_ANSWERS = "Many", FILE_ANSWER = "Exercise"
}

export type TestType = {
    testId?: string,
    collectionId: string,
    testTypeId: TestTypeId,
    testBody?: string,
    questionText?: string,
    exerciseText?: string,
    answers?: TestAnswerType[]
    creatorId?: string,
    createDate?: string,
    collection?: string,
}

export type TestAnswerType = {
    text: string,
    correct: false,
}

export type TestBlockType = {
    testBlockId?: string,
    percentSuccess: number,
    timeLimit: number,
    dateEnd: string,
    creatorId?: string,
    createDate?: string,
    isFileTestBlock: boolean,
    testBlockCollections?: TestBlockCollectionType[]
}

export type TestBlockCollectionType = {
    testBlockCollectionId?: string,
    testBlockId: string,
    collectionId: string,
    questionsAmount: number,
    createDate?: string,
    testBlock?: TestBlockType,
    collection?: CollectionType
}