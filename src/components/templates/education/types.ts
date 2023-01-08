import { ThemeType } from "../courses/types"

export type UserThemeType = {
    userThemeId: string,
    userId: string,
    themeId: string,
    userTestBody?: string,
    userTestDate?: string,
    timeSpent?: number,
    createDate: string,
    theme: ThemeType
}

export type AllResultForUser = {
    userId: string,
    result: number[]
}

export type ThemeInfoType = {
    userTheme: UserThemeType,
    available: boolean
}