import Input from "components/elements/input/Input"
import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import { CollectionType } from "components/templates/testing/types"
import React, { useState } from "react"
import utilStyles from "styles/utils.module.scss"
import styles from "./TestBlockModalWindow.module.scss"
import Button from "components/elements/button/Button"
import { maxMinConstraint } from "utils/computations"

export interface TestBlockModalWindowProps extends ModalWindowProps {
    collection: CollectionType,
    onConfirm?: (questionsAmount: number) => void,
    onDismiss?: () => void
}

const TestBlockModalWindow = ({
    collection,
    onConfirm = () => { },
    onDismiss = () => { },
    ...props
}: TestBlockModalWindowProps) => {

    const [questionsAmount, setQuestionsAmount] = useState<number>(0)

    const onQuestionsAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestionsAmount(maxMinConstraint(parseInt(e.target.value || "0"), 0, collection.tests?.length || 0))
    }

    return (
        <ModalWindow
            {...{
                title: "Добавление вопросов и упражнений из коллекции",
                ...props
            }}
        >
            <div className={utilStyles.modal_window_text}>Укажите количество вопросов и упражнений</div>
            <Input
                inputClassName={styles.questions_amount_input}
                type="number"
                value={questionsAmount}
                onChange={onQuestionsAmountChange}
                min={0}
                max={collection.tests?.length || 0}
            />
            <div className={utilStyles.modal_window_buttons_list}>
                <div className={utilStyles.modal_window_button}>
                    <Button
                        title="Добавить"
                        size="small"
                        onClick={() => onConfirm(questionsAmount)}
                    />
                </div>
                <div className={utilStyles.modal_window_button}>
                    <Button
                        title="Отмена"
                        size="small"
                        onClick={onDismiss}
                    />
                </div>
            </div>

        </ModalWindow>
    )
}

export default TestBlockModalWindow