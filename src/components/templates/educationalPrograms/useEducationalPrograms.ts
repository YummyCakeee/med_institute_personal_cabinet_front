import { ROUTE_EDUCATIONAL_PROGRAMS } from "constants/routes"
import { useModalWindowContext } from "context/modalWindowContext"
import { useRouter } from "next/router"
import { useState } from "react"
import { EducationalProgramType } from "."

const useEducationalPrograms = () => {

    const [programs, setPrograms] = useState<EducationalProgramType[]>([])
    const router = useRouter()

    const {
        setEducationalProgramModalWindowState,
        setConfirmActionModalWindowState
    } = useModalWindowContext()

    const onEducationalProgramAddClick = () => {
        setEducationalProgramModalWindowState({
            mode: "add",
            closable: true,
            backgroundOverlap: true
        })
    }

    const onEducationalProgramEditClick = (index: number) => {
        setEducationalProgramModalWindowState({
            mode: "edit",
            program: programs[index],
            closable: true,
            backgroundOverlap: true
        })
    }

    const onEducationalProgramDeleteClick = (index: number) => {
        setConfirmActionModalWindowState({
            onConfirm: () => {
                setPrograms(prevState => prevState.filter(el => el.programId !== programs[index].programId))
                setConfirmActionModalWindowState(undefined)
            },
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