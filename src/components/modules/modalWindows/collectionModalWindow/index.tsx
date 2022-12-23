import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import CollectionForm from "components/modules/forms/collection"
import { CollectionType } from "components/templates/testing/types"
import React from "react"

export interface CollectionModalWindowProps extends ModalWindowProps {
    mode: "add" | "edit",
    collection?: CollectionType,
    onSuccess?: (collection: CollectionType) => void,
    onError?: (error: any) => void
}

const CollectionModalWindow = ({
    mode,
    collection,
    onSuccess,
    onError,
    ...props
}: CollectionModalWindowProps) => {
    return (
        <ModalWindow
            {...{
                title: mode === "add" ?
                    "Добавление новой коллекции" :
                    "Редактирование коллекции",
                ...props
            }}
        >
            <CollectionForm
                {...{
                    mode,
                    collection,
                    onSuccess,
                    onError
                }}
            />
        </ModalWindow>
    )
}

export default CollectionModalWindow