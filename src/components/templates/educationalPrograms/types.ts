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
    userPrograms?: any[]
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

export enum PercentageType {
    MIN, MAX, AVG
}

export type CriteriaType = {
    percentageType: PercentageType,
    value: number
}