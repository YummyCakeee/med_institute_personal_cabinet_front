import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import ExerciseScoreForm from "components/modules/forms/exerciseScore"
import { UserExerciseType } from "components/templates/education/types"
import React from "react"
import utilStyles from "styles/utils.module.scss"

export interface ExerciseScoreModalWindowProps extends ModalWindowProps {
    exercise: UserExerciseType,
    themeId: string,
    userId: string,
    attemptDate: string,
    onSuccess?: (exercise: UserExerciseType) => void,
    onError?: (err: any) => void,
}

const ExerciseScoreModalWindow = ({
    exercise,
    themeId,
    userId,
    attemptDate,
    onSuccess,
    onError,
    ...props
}: ExerciseScoreModalWindowProps) => {

    return (
        <ModalWindow
            {...{
                title: "Оценка упражнения",
                ...props
            }}
        >
            <div className={utilStyles.modal_window_text}>Оценка студента:</div>
            <ExerciseScoreForm
                {...{
                    attemptDate,
                    exercise,
                    themeId,
                    userId,
                    onSuccess,
                    onError
                }}
            />
        </ModalWindow>
    )
}

export default ExerciseScoreModalWindow