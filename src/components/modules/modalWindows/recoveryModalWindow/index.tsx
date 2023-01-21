import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import React from "react"
import RecoveryForm from "components/modules/forms/recovery"
import styles from "./RecoveryModalWindow.module.scss"

export interface RecoveryModalWindowProps extends ModalWindowProps {
    onSuccess: () => void,
    token: string
}

const RecoveryModalWindow = ({
    onSuccess,
    token
}: RecoveryModalWindowProps) => {

    return (
        <ModalWindow
            backgroundOverlap
            title="Сброс пароля"
            onOpenAnimation={false}
            className={styles.container}
        >
            <RecoveryForm
                {...{
                    token,
                    onSuccess
                }}
            />
        </ModalWindow>
    )
}

export default RecoveryModalWindow