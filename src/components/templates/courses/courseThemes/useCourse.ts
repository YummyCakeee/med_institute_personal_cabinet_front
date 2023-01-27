import { useRouter } from "next/router"
import { ROUTE_COURSES, ROUTE_THEMES } from "constants/routes"
import { useModalWindowContext } from "context/modalWindowContext"
import axiosApi from "utils/axios"
import { ENDPOINT_COURSES } from "constants/endpoints"
import { Store } from "react-notifications-component"
import { useEffect, useState } from "react"
import { CourseType, ThemeType } from "../types"
import { getServerErrorResponse } from "utils/serverData"
import addNotification from "utils/notifications"

const useCourse = (course: CourseType) => {

    const [themes, setThemes] = useState<ThemeType[]>([])
    const router = useRouter()
    const {
        setConfirmActionModalWindowState,
        setThemeModalWindowState,
        setThemesOrderModalWindowState
    } = useModalWindowContext()

    useEffect(() => {
        if (course.themes)
            setThemes(course.themes.sort(sortThemes))
    }, [course.themes])

    const sortThemes = (a: ThemeType, b: ThemeType) => {
        if (a.sortOrder > b.sortOrder) return 1
        if (a.sortOrder < b.sortOrder) return -1
        return 0
    }

    const onThemeEditClick = (index: number) => {
        setThemeModalWindowState({
            course,
            mode: "edit",
            theme: themes[index],
            onSuccess: (theme) => {
                setThemes(prev => prev.map(el => {
                    if (el.themeId === theme.themeId) {
                        return theme
                    }
                    return el
                }).sort(sortThemes))
                addNotification({ type: "success", title: "Успех", message: "Тема изменена" })
                setThemeModalWindowState(undefined)
            },
            onError: (err) => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось изменить тему:\n${getServerErrorResponse(err)}` })
            },
            backgroundOverlap: true,
            closable: true
        })
    }

    const onThemeSetupClick = (index: number) => {
        const courseId = course.courseId
        const themeId = themes[index].themeId
        router.push(`${ROUTE_COURSES}/${courseId}${ROUTE_THEMES}/${themeId}`)
    }

    const onThemeDeleteClick = (index: number) => {

        const deleteTheme = (index: number) => {
            const id = themes[index].themeId
            axiosApi.delete(`${ENDPOINT_COURSES}/Themes/${id}`)
                .then(res => {
                    if (res.status === 204) {
                        addNotification({ type: "success", title: "Успех", message: "Тема удалена" })
                        setThemes(prev => prev.filter(el => el.themeId !== id))
                        setConfirmActionModalWindowState(undefined)
                    }
                })
                .catch(err => {
                    addNotification({ type: "danger", title: "Ошибка", message: `Не удалось удалить тему:\n${getServerErrorResponse(err)}` })
                })
        }

        setConfirmActionModalWindowState({
            text: `Удалить тему?`,
            onConfirm: () => deleteTheme(index),
            onDismiss: () => setConfirmActionModalWindowState(undefined),
            backgroundOverlap: true,
            closable: true
        })
    }

    const onThemeAddClick = () => {
        setThemeModalWindowState({
            course,
            onSuccess: (theme) => {
                setThemes(prev => [...prev, theme].sort(sortThemes))
                addNotification({ type: "success", title: "Успех", message: "Новая тема добавлена" })
                setThemeModalWindowState(undefined)
            },
            onError: (err) => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось добавить тему:\n${getServerErrorResponse(err)}` })
            },
            mode: "add",
            backgroundOverlap: true,
            closable: true
        })
    }

    const onThemesChangeOrderClick = () => {
        setThemesOrderModalWindowState({
            courseId: course.courseId!,
            themes: themes,
            closable: true,
            backgroundOverlap: true,
            onSuccess: (themes) => {
                setThemes(themes)
                setThemesOrderModalWindowState(undefined)
                addNotification({ type: "success", title: "Успех", message: "Порядок тем сохранён" })
            },
            onError: (err) => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось изменить порядок тем:\n${getServerErrorResponse(err)}` })
            },
            onDismiss: () => setThemesOrderModalWindowState(undefined)
        })

    }

    return {
        themes,
        setThemes,
        onThemeAddClick,
        onThemeEditClick,
        onThemeSetupClick,
        onThemeDeleteClick,
        onThemesChangeOrderClick
    }
}

export default useCourse