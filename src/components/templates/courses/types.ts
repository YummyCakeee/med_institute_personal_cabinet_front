import { EduFileType } from "../education/types"
import { ProgramCourseType } from "../educationalPrograms/types"
import { TestBlockType } from "../testing/types"

export type CourseType = {
    courseId?: string,
    title: string,
    description: string,
    createDate?: string,
    creatorId?: string,
    themes?: ThemeType[],
    programCourses?: ProgramCourseType[]
}

export type CourseInfoType = {
    course: CourseType,
    available: boolean
}

export type ThemeType = {
    themeId: string,
    title: string,
    courseId: string
    html: string,
    themeFiles?: EduFileType[]
    testBlockId?: string,
    sortOrder: number,
    createDate?: string,
    themePassed?: boolean
    userThemes?: null
    course?: CourseType,
    testBlock?: TestBlockType
}