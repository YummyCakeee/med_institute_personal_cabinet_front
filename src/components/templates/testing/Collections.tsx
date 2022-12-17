import React from "react"
import utilStyles from "styles/utils.module.scss"
import ItemList from "components/modules/itemList"
import { CollectionType } from "./useTesting"
import { useModalWindowContext } from "context/modalWindowContext"
import { useRouter } from "next/router"
import { ROUTE_COLLECTIONS } from "constants/routes"

type CollectionsProps = {
    collections: CollectionType[],
    setCollections: React.Dispatch<React.SetStateAction<CollectionType[]>>
}

const Collections = ({
    collections,
    setCollections
}: CollectionsProps) => {

    const router = useRouter()
    const {
        setConfirmActionModalWindowState,
        setCollectionModalWindowState
    } = useModalWindowContext()

    const onCollectionEditClick = (index: number) => {
        setCollectionModalWindowState({
            mode: "edit",
            collection: collections[index],
            backgroundOverlap: true,
            closable: true
        })
    }

    const deleteCollection = (index: number) => {

        const id = collections[index].collectionId
        setCollections(prev => prev.filter(el => el.collectionId !== id))

        setConfirmActionModalWindowState(undefined)
    }

    const onCollectionDeleteClick = (index: number) => {
        setConfirmActionModalWindowState({
            text: `Удалить коллекцию ${collections[index].collectionName}?`,
            onConfirm: () => deleteCollection(index),
            onDismiss: () => setConfirmActionModalWindowState(undefined),
            backgroundOverlap: true,
            closable: true,
        })
    }

    const onCollectionAddClick = () => {
        setCollectionModalWindowState({
            mode: "add",
            backgroundOverlap: true,
            closable: true
        })
    }

    const onCollectionTestsEditClick = (index: number) => {
        const id = collections[index].collectionId
        router.push(`${ROUTE_COLLECTIONS}/${id}`)
    }

    return (
        <>
            <div className={utilStyles.section_title}>Коллекции</div>
            <ItemList
                headers={[
                    {
                        title: "Название",
                        field: "collectionName",
                    },
                    {
                        title: "ID создателя",
                        field: "creatorId",
                    },
                ]}
                items={collections}
                itemControlButtons={() => [
                    {
                        title: "Редактировать",
                        size: "small",
                        stretchable: true,
                        onClick: onCollectionEditClick
                    },
                    {
                        title: "Редактировать тесты",
                        stretchable: true,
                        onClick: onCollectionTestsEditClick
                    },
                    {
                        title: "Удалить",
                        size: "small",
                        onClick: onCollectionDeleteClick
                    }
                ]}
                controlButtonsBottom={[
                    {
                        title: "Добавить",
                        size: "small",
                        onClick: onCollectionAddClick
                    }
                ]}
            />
        </>
    )
}

export default Collections