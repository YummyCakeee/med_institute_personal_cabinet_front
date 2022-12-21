import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import ThemeForm from "components/modules/forms/theme"
import { CourseType, ThemeType } from "components/templates/courses/types"
import React from "react"

export interface ThemeModalWindowProps extends ModalWindowProps {
    mode?: "add" | "edit",
    theme?: ThemeType,
    course: CourseType,
    onSuccess?: (theme: ThemeType) => void,
    onError?: (error: any) => void
}

const ThemeModalWindow = ({
    mode,
    theme,
    course,
    onSuccess,
    onError,
    ...props
}: ThemeModalWindowProps) => {
    return (
        <ModalWindow
            {...{
                title: mode === "add" ?
                    "Добавление новой темы" :
                    "Изменение темы",
                ...props
            }}
        >
            <ThemeForm
                {...{
                    mode,
                    theme,
                    course,
                    onSuccess,
                    onError
                }}
            />
        </ModalWindow>
    )
}

export default ThemeModalWindow