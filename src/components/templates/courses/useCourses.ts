import { useState } from "react"
import { useModalWindowContext } from "context/modalWindowContext"
import { useRouter } from "next/router"
import { ROUTE_COURSES, ROUTE_THEMES } from "constants/routes"
import { TestBlockType } from "../testing/types"
import { CourseType } from "./types"

const useCourses = () => {
    const router = useRouter()
    const {
        setConfirmActionModalWindowState,
        setCourseModalWindowState,
    } = useModalWindowContext()

    const [courses, setCourses] = useState<CourseType[]>([])

    const onCourseSetupClick = (index: number) => {
        const id = courses[index].courseId
        router.push(`${ROUTE_COURSES}/${id}/${ROUTE_THEMES}`)
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