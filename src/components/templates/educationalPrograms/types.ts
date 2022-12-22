import { CourseType } from "../courses/types"

export type ProgramType = {
    programId: string,
    createDate: string,
    creatorId: string,
    description: string,
    programCourses: ProgramCourseType[]
    programCriteria: any
    title: string,
    commonFiles: any[],
    userPrograms: any[]
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

export type CriteriaType = {
    percentageType: 0 | 1 | 2,
    value: number
}