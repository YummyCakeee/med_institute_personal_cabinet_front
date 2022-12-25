import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import EducationalProgramForm from "components/modules/forms/educationalProgram"
import { ProgramType } from "components/templates/educationalPrograms/types"
import React from "react"

export interface EducationalProgramModalWindowProps extends ModalWindowProps {
    mode: "add" | "edit",
    program?: ProgramType,
    onSuccess?: (program: ProgramType) => void,
    onError?: (error: any) => void
}

const EducationalProgramModalWindow = ({
    mode,
    program,
    onSuccess,
    onError,
    ...props
}: EducationalProgramModalWindowProps) => {
    return (
        <ModalWindow
            {...{
                title: mode === "add" ?
                    "Добавление новой программы" :
                    "Изменение программы",
                ...props
            }}
        >
            <EducationalProgramForm
                {...{
                    mode,
                    program,
                    onSuccess,
                    onError
                }}
            />
        </ModalWindow>
    )
}

export default EducationalProgramModalWindow