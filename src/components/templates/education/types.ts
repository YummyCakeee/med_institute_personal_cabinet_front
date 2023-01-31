import { ThemeType } from "../courses/types"
import { TestTypeId } from "../testing/types"

export type UserThemeType = {
    userThemeId: string,
    userId: string,
    themeId: string,
    userTestBody?: string,
    userTestDate?: string,
    timeSpent?: number,
    createDate: string,
    theme: ThemeType,
    themePassed: boolean
}

export type SolvedTestType = {
    userQuestions: UserQuestionType[],
    userExercises: UserExerciseType[],
    startTestTime: string,
    endTestTime: string,
    finishedTestTime: string,
    resultPercent: number
}

export type UserQuestionType = {
    questionText: string,
    answers: UserAnswerType[],
    testType: TestTypeId,
    score?: number
}

export type UserAnswerType = {
    text: string,
    correct: boolean,
    selected: boolean
}

export type UserExerciseType = {
    file?: EduFileType,
    exerciseText: string,
    rating: number,
    userComments?: ExerciseCommentType[],
    teacherComments?: ExerciseCommentType[]
}

export type ExerciseCommentType = {
    text: string,
    dateTime?: string
}

export type EduFileType = {
    fileName: string,
    fileLink: string,
    fileDescription: string
}

export type ThemeInfoType = {
    userTheme: UserThemeType,
    available: boolean
}