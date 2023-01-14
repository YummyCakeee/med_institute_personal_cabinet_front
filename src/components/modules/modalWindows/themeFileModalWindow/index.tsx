import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import ThemeFileForm from "components/modules/forms/themeFile"
import { EduFileType } from "components/templates/education/types"
import React from "react"

export interface ThemeFileModalWindowProps extends ModalWindowProps {
    mode: "add" | "edit",
    file: EduFileType,
    onConfirm?: (file: EduFileType) => void,
}

const ThemeFileModalWindow = ({
    mode,
    file,
    onConfirm,
    ...props
}: ThemeFileModalWindowProps) => {
    return (
        <ModalWindow
            {...{
                title: mode === "add" ?
                    "Добавление нового файла" :
                    "Изменение файла",
                ...props
            }}
        >
            <ThemeFileForm
                {...{
                    file,
                    mode,
                    onConfirm
                }}
            />
        </ModalWindow>
    )
}

export default ThemeFileModalWindow