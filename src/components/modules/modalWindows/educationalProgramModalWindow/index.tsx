import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import EducationalProgramForm from "components/modules/forms/educationalProgram"
import { ProgramType } from "components/templates/educationalPrograms"
import React from "react"

export interface EducationalProgramModalWindowProps extends ModalWindowProps {
    mode?: "add" | "edit",
    program?: ProgramType
}

const EducationalProgramModalWindow = ({
    mode,
    program,
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
                mode={mode}
                program={program}
            />
        </ModalWindow>
    )
}

export default EducationalProgramModalWindow