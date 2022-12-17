import { useEffect, useState } from "react"
import { useModalWindowContext } from "context/modalWindowContext"
import axiosApi from "utils/axios"
import { ENDPOINT_COURSES } from "constants/endpoints"
import { Store } from "react-notifications-component"

export type CourseType = {
    courseId: string,
    title: string,
    description: string,
    createDate: string,
    creatorId: string
}

const useCourses = () => {
    const {
        setConfirmActionModalWindowState,
        setCourseModalWindowState,
    } = useModalWindowContext()

    const [courses, setCourses] = useState<CourseType[]>([])

    const onCourseDetailsClick = (index: number) => {

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
        onCourseDetailsClick,
        onCourseDeleteClick,
        onCourseEditClick,
        onCourseAddClick
    }

}

export default useCourses