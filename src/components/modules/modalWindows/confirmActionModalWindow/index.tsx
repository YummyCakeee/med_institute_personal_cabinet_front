import ModalWindow from "components/elements/modalWindow/ModalWindow"
import React from "react"
import { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import Button from "components/elements/button/Button"
import utilStyles from "styles/utils.module.scss"

export interface ConfirmActionModalWindowProps extends ModalWindowProps {
    onConfirm?: () => void,
    onDismiss?: () => void,
    text?: string,
}

const ConfirmActionModalWindow = ({
    onConfirm = () => { },
    onDismiss = () => { },
    text,
    ...props
}: ConfirmActionModalWindowProps) => {

    return (
        <ModalWindow
            {...{
                title: "Подтвердите действие",
                ...props
            }}
        >
            <div className={utilStyles.modal_window_text}>
                {text}
            </div>
            <div className={utilStyles.modal_window_buttons_list}>
                <div className={utilStyles.modal_window_button}>
                    <Button
                        title="Да"
                        size="small"
                        onClick={onConfirm}
                    />
                </div>
                <div className={utilStyles.modal_window_button}>
                    <Button
                        title="Нет"
                        size="small"
                        onClick={onDismiss}
                    />
                </div>
            </div>
        </ModalWindow>
    )
}

export default ConfirmActionModalWindow