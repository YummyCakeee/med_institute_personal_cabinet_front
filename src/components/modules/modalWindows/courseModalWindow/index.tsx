import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import CourseForm from "components/modules/forms/course"
import { CourseType } from "components/templates/courses/types"
import React from "react"

export interface CourseModalWindowProps extends ModalWindowProps {
    mode: "add" | "edit",
    course?: CourseType,
    onSuccess?: (course: CourseType) => void,
    onError?: (error: any) => void
}

const CourseModalWindow = ({
    mode,
    course,
    onSuccess = () => { },
    onError = () => { },
    ...props
}: CourseModalWindowProps) => {
    return (
        <ModalWindow
            {...{
                title: mode === "add" ?
                    "Добавление нового курса" :
                    "Изменение курса",
                ...props
            }}
        >
            <CourseForm
                {...{
                    mode,
                    course,
                    onSuccess,
                    onError
                }}
            />
        </ModalWindow>
    )
}

export default CourseModalWindow