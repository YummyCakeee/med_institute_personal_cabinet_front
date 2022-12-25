import { useState } from "react"
import { useModalWindowContext } from "context/modalWindowContext"
import { useRouter } from "next/router"
import { ROUTE_COURSES, ROUTE_THEMES } from "constants/routes"
import { CourseType } from "./types"
import { Store } from "react-notifications-component"
import axiosApi from "utils/axios"
import { ENDPOINT_COURSES } from "constants/endpoints"

const useCourses = () => {
    const router = useRouter()
    const {
        setConfirmActionModalWindowState,
        setCourseModalWindowState,
    } = useModalWindowContext()

    const [courses, setCourses] = useState<CourseType[]>([])

    const onCourseSetupClick = (index: number) => {
        const id = courses[index].courseId
        router.push(`${ROUTE_COURSES}/${id}${ROUTE_THEMES}`)
    }

    const onCourseEditClick = (index: number) => {
        setCourseModalWindowState({
            mode: "edit",
            closable: true,
            backgroundOverlap: true,
            course: courses[index],
            onSuccess: (course) => {
                setCourses(prev => prev.map(el => {
                    if (el.courseId === course.courseId)
                        return course
                    return el
                }))
                setCourseModalWindowState(undefined)
                Store.addNotification({
                    container: "top-right",
                    type: "success",
                    title: "Курс обновлён",
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            },
            onError: (error) => {
                Store.addNotification({
                    container: "top-right",
                    type: "danger",
                    title: "Не удалось обновить курс",
                    message: error.code,
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            }
        })
    }

    const deleteCourse = (index: number) => {
        const id = courses[index].courseId
        axiosApi.delete(`${ENDPOINT_COURSES}/${id}`)
            .then(res => {
                setCourses(prev => prev.filter(el => el.courseId !== id))
                setConfirmActionModalWindowState(undefined)
                Store.addNotification({
                    container: "top-right",
                    type: "success",
                    title: "Курс удалён",
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            })
            .catch(err => {
                Store.addNotification({
                    container: "top-right",
                    type: "danger",
                    title: "Не удалось удалить курс",
                    message: err.code,
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            })
    }

    const onCourseDeleteClick = (index: number) => {
        setConfirmActionModalWindowState({
            text: `Удалить курс "${courses[index].title}"?`,
            onConfirm: () => deleteCourse(index),
            onDismiss: () => setConfirmActionModalWindowState(undefined),
            closable: true,
            backgroundOverlap: true
        })
    }

    const onCourseAddClick = () => {
        setCourseModalWindowState({
            mode: "add",
            closable: true,
            backgroundOverlap: true,
            onSuccess: (course) => {
                setCourses(prev => [...prev, course])
                setCourseModalWindowState(undefined)
                Store.addNotification({
                    container: "top-right",
                    type: "success",
                    title: "Курс добавлен",
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            },
            onError: (error) => {
                Store.addNotification({
                    container: "top-right",
                    type: "danger",
                    title: "Не удалось добавить курс",
                    message: error.code,
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            }
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