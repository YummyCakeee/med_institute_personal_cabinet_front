import { CourseType } from "../courses/types"

export type ProgramType = {
    programId?: string,
    title: string,
    createDate?: string,
    creatorId?: string,
    description: string,
    programCourses?: ProgramCourseType[]
    programCriteria?: any
    commonFiles?: any[],
    userPrograms?: UserProgramType[]
}

export type ProgramCourseType = {
    programCourseId: string,
    programId: string,
    courseId: string,
    sortOrder: number,
    dependencies: CourseDependencyType,
    createDate?: string,
    courseCriteria: CriteriaType,
    course?: CourseType,
    program?: ProgramType
}

export type CourseDependencyType = {
    courseIds: string[]
}

export type PercentageType = "Min" | "Max" | "Avg"

export type CriteriaType = {
    percentageType: PercentageType,
    value: number
}

export type UserProgramType = {
    userProgramId: string,
    userId: string,
    programId: string,
    report?: string
    certificateDate?: string,
    certificateName?: string,
    createDate?: string,
    program?: ProgramType
}

export type CountStudentsModelType = {
    totalCount: number,
    countPassed: number,
    countCurrent: number,
    countNotStarted: number
}

export type ReportModelType = {
    id: string,
    name: string,
    status: number
}