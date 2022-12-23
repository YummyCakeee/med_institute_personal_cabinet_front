import { TestBlockType } from "../testing/types"

export type CourseType = {
    courseId: string,
    title: string,
    description: string,
    createDate: string,
    creatorId: string,
    themes: ThemeType[]
}

export type ThemeType = {
    themeId: string,
    title: string,
    courseId: string
    html: string,
    themeFiles?: string
    testBlockId?: string,
    sortOrder: number,
    createDate?: string,
    themePassed?: boolean
    userThemes?: null
    course?: CourseType,
    testBlock?: TestBlockType
}