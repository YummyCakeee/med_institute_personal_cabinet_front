import { ENDPOINT_PROGRAMS } from "constants/endpoints"
import { ROUTE_EDUCATIONAL_PROGRAMS } from "constants/routes"
import { useModalWindowContext } from "context/modalWindowContext"
import { useRouter } from "next/router"
import { useState } from "react"
import { Store } from "react-notifications-component"
import axiosApi from "utils/axios"
import { ProgramType } from "./types"

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
                Store.addNotification({
                    container: "top-right",
                    type: "success",
                    title: "Программа добавлена",
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
                    title: "Не удалось добавить программу",
                    message: error.code,
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
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
                Store.addNotification({
                    container: "top-right",
                    type: "success",
                    title: "Программа изменена",
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
                    title: "Не удалось изменить программу",
                    message: error.code,
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
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
                Store.addNotification({
                    container: "top-right",
                    type: "success",
                    title: "Программа удалена",
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
                    title: "Не удалось удалить программу",
                    message: err.code,
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
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

    return {
        programs,
        setPrograms,
        onEducationalProgramAddClick,
        onEducationalProgramEditClick,
        onEducationalProgramDeleteClick,
        onEducationalProgramCoursesClick,
        onEducationalProgramStudentsClick
    }

}

export default useEducationalPrograms