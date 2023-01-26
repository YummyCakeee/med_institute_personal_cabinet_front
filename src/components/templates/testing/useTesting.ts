import { useState } from "react"
import { CollectionType, TestBlockType } from "./types"
import { useModalWindowContext } from "context/modalWindowContext"
import { useRouter } from "next/router"
import { ROUTE_COLLECTIONS } from "constants/routes"
import { Store } from "react-notifications-component"
import axiosApi from "utils/axios"
import { ENDPOINT_COLLECTIONS } from "constants/endpoints"
import addNotification from "utils/notifications"
import { getServerErrorResponse } from "utils/serverData"

const useTesting = () => {

    const [collections, setCollections] = useState<CollectionType[]>([])


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
            closable: true,
            onSuccess: (collection) => {
                setCollections(prev => prev.map(el => {
                    if (el.collectionId === collection.collectionId) {
                        return {
                            ...el,
                            collectionName: collection.collectionName
                        }
                    }
                    return el
                }))
                setCollectionModalWindowState(undefined)
                Store.addNotification({
                    container: "top-right",
                    type: "success",
                    title: "Коллекция изменена",
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            },
            onError: (error) => {
                Store.addNotification({
                    container: "top-right",
                    type: "danger",
                    title: "Не удалось изменить коллекцию",
                    message: error.code,
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            }
        })
    }

    const deleteCollection = (index: number) => {
        const id = collections[index].collectionId
        axiosApi.delete(`${ENDPOINT_COLLECTIONS}/${id}`)
            .then(res => {
                setCollections(prev => prev.filter(el => el.collectionId !== id))
                setConfirmActionModalWindowState(undefined)
                addNotification({ type: "success", title: "Успех", message: "Коллекция удалена" })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось удалить коллекцию:\n${getServerErrorResponse(err)}` })
            })
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
            closable: true,
            onSuccess: (collection) => {
                setCollections([...collections, collection])
                setCollectionModalWindowState(undefined)
                Store.addNotification({
                    container: "top-right",
                    type: "success",
                    title: "Новая коллекция добавлена",
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            },
            onError: (error) => {
                Store.addNotification({
                    container: "top-right",
                    type: "danger",
                    title: "Не удалось добавить коллекцию",
                    message: error.code,
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            }
        })
    }

    const onCollectionTestsEditClick = (index: number) => {
        const id = collections[index].collectionId
        router.push(`${ROUTE_COLLECTIONS}/${id}`)
    }

    return {
        collections,
        setCollections,
        onCollectionAddClick,
        onCollectionDeleteClick,
        onCollectionEditClick,
        onCollectionTestsEditClick
    }
}

export default useTesting