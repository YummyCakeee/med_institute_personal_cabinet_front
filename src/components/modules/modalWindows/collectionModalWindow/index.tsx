import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import CollectionForm from "components/modules/forms/collection"
import { CollectionType } from "components/templates/testing/useTesting"
import React from "react"

export interface CollectionModalWindowProps extends ModalWindowProps {
    mode?: "add" | "edit",
    collection?: CollectionType
}

const CollectionModalWindow = ({
    mode,
    collection,
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
                mode={mode}
                collection={collection}
            />
        </ModalWindow>
    )
}

export default CollectionModalWindow