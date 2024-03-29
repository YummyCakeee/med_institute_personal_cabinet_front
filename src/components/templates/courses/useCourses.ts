import { useState } from "react"
import { useModalWindowContext } from "context/modalWindowContext"
import { useRouter } from "next/router"
import { ROUTE_COURSES, ROUTE_THEMES } from "constants/routes"
import { CourseType } from "./types"
import { Store } from "react-notifications-component"
import axiosApi from "utils/axios"
import { ENDPOINT_COURSES } from "constants/endpoints"
import { getServerErrorResponse } from "utils/serverData"
import addNotification from "utils/notifications"

const useCourses = () => {
    const router = useRouter()
    const {
        setConfirmActionModalWindowState,
        setCourseModalWindowState,
    } = useModalWindowContext()

    const [courses, setCourses] = useState<CourseType[]>([])

    const onCourseThemesClick = (index: number) => {
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
                addNotification({ type: "success", title: "Успех", message: "Курс обновлён" })
            },
            onError: (err) => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось обновить курс:\n${getServerErrorResponse(err)}` })
            }
        })
    }

    const deleteCourse = (index: number) => {
        const id = courses[index].courseId
        axiosApi.delete(`${ENDPOINT_COURSES}/${id}`)
            .then(res => {
                setCourses(prev => prev.filter(el => el.courseId !== id))
                setConfirmActionModalWindowState(undefined)
                addNotification({ type: "success", title: "Успех", message: "Курс удалён" })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось удалить курс:\n${getServerErrorResponse(err)}` })
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
                addNotification({ type: "success", title: "Успех", message: "Курс добавлен" })
            },
            onError: (err) => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось добавить курс:\n${getServerErrorResponse(err)}` })
            }
        })
    }

    const onCourseReportClick = (index: number) => {
        router.push(`${ROUTE_COURSES}/${courses[index].courseId}/report`)
    }

    return {
        courses,
        setCourses,
        onCourseThemesClick,
        onCourseDeleteClick,
        onCourseEditClick,
        onCourseAddClick,
        onCourseReportClick
    }

}

export default useCourses