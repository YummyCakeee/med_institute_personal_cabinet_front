import { ENDPOINT_PROGRAMS } from "constants/endpoints"
import { ROUTE_EDUCATIONAL_PROGRAMS } from "constants/routes"
import { useModalWindowContext } from "context/modalWindowContext"
import { useRouter } from "next/router"
import { useState } from "react"
import { Store } from "react-notifications-component"
import axiosApi from "utils/axios"
import addNotification from "utils/notifications"
import { ProgramType } from "./types"
import { getServerErrorResponse } from "utils/serverData"

const useEducationalPrograms = () => {

    const [programs, setPrograms] = useState<ProgramType[]>([])
    const router = useRouter()

    const {
        setEducationalProgramModalWindowState,
        setConfirmActionModalWindowState
    } = useModalWindowContext()

    const onEducationalProgramAddClick = () => {
        setEducationalProgramModalWindowState({
            mode: "add",
            closable: true,
            backgroundOverlap: true,
            onSuccess: (program) => {
                setPrograms(prev => [...prev, program])
                setEducationalProgramModalWindowState(undefined)
                addNotification({ type: "success", title: "Успех", message: "Программа добавлена" })
            },
            onError: (err) => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось добавить программу:\n${getServerErrorResponse(err)}` })
            }
        })
    }

    const onEducationalProgramEditClick = (index: number) => {
        setEducationalProgramModalWindowState({
            mode: "edit",
            program: programs[index],
            closable: true,
            backgroundOverlap: true,
            onSuccess: (program) => {
                setPrograms(prev => prev.map(el => {
                    if (el.programId === program.programId)
                        return program
                    return el
                }))
                setEducationalProgramModalWindowState(undefined)
                addNotification({ type: "success", title: "Успех", message: "Программа изменена" })
            },
            onError: (err) => {
                addNotification({
                    type: "danger", title: "Ошибка", message: `Не удалось изменить программу:\n${getServerErrorResponse(err)}`,
                })
            }
        })
    }

    const deleteEducationalProgram = (index: number) => {
        const id = programs[index].programId
        axiosApi.delete(`${ENDPOINT_PROGRAMS}/${id}`)
            .then(res => {
                setPrograms(prev => prev.filter(el => el.programId !== programs[index].programId))
                setConfirmActionModalWindowState(undefined)
                addNotification({ type: "success", title: "Успех", message: "Программа удалена" })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось удалить программу:\n${getServerErrorResponse(err)}` })
            })
    }

    const onEducationalProgramDeleteClick = (index: number) => {
        setConfirmActionModalWindowState({
            onConfirm: () => deleteEducationalProgram(index),
            onDismiss: () => setConfirmActionModalWindowState(undefined),
            text: `Удалить программу "${programs[index].title}"?`,
            closable: true,
            backgroundOverlap: true
        })
    }

    const onEducationalProgramCoursesClick = (index: number) => {
        const id = programs[index].programId
        router.push(`${ROUTE_EDUCATIONAL_PROGRAMS}/${id}/courses`)
    }

    const onEducationalProgramStudentsClick = (index: number) => {
        const id = programs[index].programId
        router.push(`${ROUTE_EDUCATIONAL_PROGRAMS}/${id}/students`)
    }

    const onEducationalProgramReportClick = (index: number) => {
        const id = programs[index].programId
        router.push(`${ROUTE_EDUCATIONAL_PROGRAMS}/${id}/report`)
    }

    return {
        programs,
        setPrograms,
        onEducationalProgramAddClick,
        onEducationalProgramEditClick,
        onEducationalProgramDeleteClick,
        onEducationalProgramCoursesClick,
        onEducationalProgramStudentsClick,
        onEducationalProgramReportClick
    }

}

export default useEducationalPrograms