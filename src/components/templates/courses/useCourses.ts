import { useState } from "react"
import { useModalWindowContext } from "context/modalWindowContext"
import { useRouter } from "next/router"
import { ROUTE_COURSES } from "constants/routes"
import { TestBlockType } from "../testing/useTesting"

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
    courseId: string
    html: string,
    themeFiles?: string
    testBlockId?: string,
    sortOrder: number,
    createDate: string,
    themePassed: boolean
    userThemes?: null
    course?: CourseType,
    testBlock?: TestBlockType
}

const useCourses = () => {
    const router = useRouter()
    const {
        setConfirmActionModalWindowState,
        setCourseModalWindowState,
    } = useModalWindowContext()

    const [courses, setCourses] = useState<CourseType[]>([])

    const onCourseSetupClick = (index: number) => {
        const id = courses[index].courseId
        router.push(`${ROUTE_COURSES}/${id}`)
    }

    const onCourseEditClick = (index: number) => {
        setCourseModalWindowState({
            mode: "edit",
            closable: true,
            backgroundOverlap: true,
            course: courses[index]
        })
    }

    const onCourseDeleteClick = (index: number) => {
        setConfirmActionModalWindowState({
            text: `Удалить курс "${courses[index].title}"?`,
            onConfirm: () => {
                setCourses(courses => courses.filter((el, key) => (
                    key !== index
                )))
                setConfirmActionModalWindowState(undefined)
            },
            onDismiss: () => setConfirmActionModalWindowState(undefined),
            closable: true,
            backgroundOverlap: true
        })
    }

    const onCourseAddClick = () => {
        setCourseModalWindowState({
            mode: "add",
            closable: true,
            backgroundOverlap: true
        })
    }

    return {
        courses,
        setCourses,
        onCourseSetupClick,
        onCourseDeleteClick,
        onCourseEditClick,
        onCourseAddClick
    }

}

export default useCourses