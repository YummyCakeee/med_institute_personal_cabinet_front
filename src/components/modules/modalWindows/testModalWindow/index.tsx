import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import TestForm from "components/modules/forms/test"
import { TestType } from "components/templates/testing/types"
import React from "react"

export interface TestModalWindowProps extends ModalWindowProps {
    mode: "add" | "edit",
    test?: TestType,
    collectionId: string,
    onSuccess?: (test: TestType) => void,
    onError?: (error: any) => void
}

const TestModalWindow = ({
    mode,
    test,
    collectionId,
    onSuccess,
    onError,
    ...props
}: TestModalWindowProps) => {
    return (
        <ModalWindow
            {...{
                title: mode === "add" ?
                    "Добавление нового теста" :
                    "Изменение теста",
                ...props
            }}
        >
            <TestForm
                {...{
                    mode,
                    test,
                    collectionId,
                    onSuccess,
                    onError
                }}
            />
        </ModalWindow>
    )
}

export default TestModalWindow