import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import CourseForm from "components/modules/forms/courseForm"
import { CourseType } from "components/templates/courses/useCourses"
import React from "react"

export interface CourseModalWindowProps extends ModalWindowProps {
    mode: "add" | "edit",
    course?: CourseType
}

const CourseModalWindow = ({
    mode,
    course,
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
                mode={mode}
                course={course}
            />
        </ModalWindow>
    )
}

export default CourseModalWindow