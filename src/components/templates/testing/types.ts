export type CollectionType = {
    collectionId: string,
    collectionName: string,
    creatorId: string,
    createDate: string,
    tests: TestType[]
}

export enum TestTypeId {
    ONE_ANSWER, MULTIPLE_ANSWERS, FILE_ANSWER
}

export type TestType = {
    testId: string,
    collectionId: string,
    testTypeId: TestTypeId,
    questionText: string,
    exerciseText: string,
    answers: TestAnswerType[]
    creatorId?: string,
    createDate?: string,
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
    creatorId?: string,
    createDate?: string,
    isFileTestBlock: boolean,
    testBlockCollections?: TestBlockCollectionsType[]
}

export type TestBlockCollectionsType = {
    testBlockCollectionId?: string,
    testBlockId: string,
    collectionId: string,
    questionsAmount: number,
    createDate?: string,
    testBlock?: TestBlockType,
    collection?: CollectionType
}