import { useEffect, useState } from "react"
import { useModalWindowContext } from "context/modalWindowContext"
import axiosApi from "utils/axios"
import { ENDPOINT_COURSES } from "constants/endpoints"

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
        closeConfirmActionModalWindow,
        setCourseModalWindowState,
        closeCourseModalWindow
    } = useModalWindowContext()

    const [courses, setCourses] = useState<CourseType[]>([])

    const loadCourses = () => {
        axiosApi.get(ENDPOINT_COURSES)
            .then(res => {
                const data: CourseType[] = res.data;
                setCourses(data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        loadCourses()
    }, [])

    const onCourseDetailsClick = (index: number) => {

    }

    const onCourseEditClick = (index: number) => {
        setCourseModalWindowState({
            isShowing: true,
            mode: "edit",
            closable: true,
            backgroundOverlap: true,
            course: courses[index]
        })
    }

    const onCourseDeleteClick = (index: number) => {
        setConfirmActionModalWindowState({
            isShowing: true,
            text: `Удалить курс "${courses[index].title}"?`,
            onConfirm: () => {
                setCourses(courses => courses.filter((el, key) => (
                    key !== index
                )))
                closeConfirmActionModalWindow()
            },
            onDismiss: closeConfirmActionModalWindow,
            closable: true,
            backgroundOverlap: true
        })
    }

    const onCourseAddClick = () => {
        setCourseModalWindowState({
            isShowing: true,
            mode: "add",
            closable: true,
            backgroundOverlap: true
        })
    }

    return {
        courses,
        onCourseDetailsClick,
        onCourseDeleteClick,
        onCourseEditClick,
        onCourseAddClick
    }

}

export default useCourses