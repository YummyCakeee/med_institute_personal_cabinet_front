import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import TestForm from "components/modules/forms/test"
import { TestType } from "components/templates/testing/types"
import React from "react"

export interface TestModalWindowProps extends ModalWindowProps {
    mode?: "add" | "edit",
    test?: TestType,
    collectionId?: string,
    setTests?: React.Dispatch<React.SetStateAction<TestType[]>>
}

const TestModalWindow = ({
    mode,
    test,
    collectionId,
    setTests,
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
                mode={mode}
                test={test}
                collectionId={collectionId}
                setTests={setTests}
            />
        </ModalWindow>
    )
}

export default TestModalWindow