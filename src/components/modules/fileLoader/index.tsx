import { ArrowIcon, FileIcon, FolderIcon } from "components/elements/icons"
import { ENDPOINT_FILES } from "constants/endpoints"
import React, { useCallback, useEffect, useRef, useState } from "react"
import axiosApi from "utils/axios"
import styles from "./FileLoader.module.scss"
import { CopyCommandType, CreateCommandType, DeleteCommandType, FileSystemObjectInfoType, FolderStructureInfoType, GetFolderStructureQueryType, MoveCommandType, RenameCommandType } from "./types"
import cn from "classnames"
import Button from "components/elements/button/Button"
import ContextMenu, { ContextMenuProps } from "components/elements/contextMenu/ContextMenu"
import addNotification from "utils/notifications"
import { useModalWindowContext } from "context/modalWindowContext"

type BufferElementType = {
    name: string,
    sourceDirectory: string,
    isFile: boolean,
    mode: "copy" | "cut"
}

type EditingItemType = {
    index: number,
    originName: string,
    newName: string,
    isFile: boolean
}

const FileLoader = () => {

    const [currentFolderPath, setCurrentFolderPath] = useState<string>(".")
    const [folderStructureInfo, setFolderStructureInfo] = useState<FolderStructureInfoType>()
    const [selectedFileIndex, setSelectedFileIndex] = useState<number>(-1)
    const [contextMenuState, setContextMenuState] = useState<ContextMenuProps>()
    const [bufferElement, setBufferElement] = useState<BufferElementType>()
    const [editingItem, setEditingItem] = useState<EditingItemType>()
    const { setConfirmActionModalWindowState } = useModalWindowContext()

    const selectedFileRef = useRef<HTMLDivElement>(null)
    const structureNavigationRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const editingItemRef = useRef<HTMLInputElement>(null)

    const fetchFolderData = useCallback(async () => {
        const data: GetFolderStructureQueryType = {
            currentFolderPath,
        }
        axiosApi.post(`${ENDPOINT_FILES}/GetFiles`, data)
            .then(res => {
                setFolderStructureInfo(res.data)
                setSelectedFileIndex(-1)
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Не удалось загрузить файлы", message: err.code })
            })
    }, [currentFolderPath])

    useEffect(() => {
        fetchFolderData()
    }, [currentFolderPath, fetchFolderData])

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (selectedFileRef.current && structureNavigationRef.current &&
                !selectedFileRef.current.contains(e.target as Node) &&
                structureNavigationRef.current.contains(e.target as Node)) {
                setSelectedFileIndex(-1)
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [selectedFileRef, structureNavigationRef, editingItemRef]);


    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (editingItemRef.current && !editingItemRef.current.contains(e.target as Node)) {
                if (!editingItem || !folderStructureInfo || editingItem.newName === editingItem.originName) {
                    setEditingItem(undefined)
                    return
                }
                const data: RenameCommandType = {
                    ...editingItem,
                    currentFolderPath
                }
                axiosApi.post(`${ENDPOINT_FILES}/Rename`, data)
                    .then(res => {
                        setFolderStructureInfo({
                            ...folderStructureInfo,
                            ...(editingItem.isFile && {
                                files: folderStructureInfo.files.map((el, key) => {
                                    if (key !== editingItem.index) return el
                                    return {
                                        ...el,
                                        name: editingItem.newName
                                    }
                                })
                            }),
                            ...(!editingItem.isFile && {
                                folders: folderStructureInfo.folders.map((el, key) => {
                                    if (key !== editingItem.index) return el
                                    return {
                                        ...el,
                                        name: editingItem.newName
                                    }
                                })
                            })
                        })
                        setEditingItem(undefined)
                    })
                    .catch(err => {
                        addNotification({ type: "danger", title: "Не удалось переименовать файл", message: err.code })
                    })
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [editingItemRef, editingItem, folderStructureInfo, currentFolderPath]);

    const onFolderDoubleClick = (folderName: string) => {
        setCurrentFolderPath(currentFolderPath + '/' + folderName)
    }

    const onFileSelect = (index: number) => {
        setSelectedFileIndex(index)
    }

    const onGoBackArrowClick = () => {
        const match = currentFolderPath.match(/(.*)\/.*$/)
        if (match && match[1]) setCurrentFolderPath(match[1])
    }

    const onStructureContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        setContextMenuState({
            items: [
                {
                    title: "Загрузить файл",
                    onClick: () => {
                        if (fileInputRef.current)
                            fileInputRef.current.click()
                    }
                },
                ...(bufferElement ? [{
                    title: "Вставить",
                    onClick: pasteFile
                }] : []),
                {
                    title: "Создать папку",
                    onClick: createFolder
                }
            ],
            onClose: () => setContextMenuState(undefined),
            x: e.pageX,
            y: e.pageY
        })
    }

    const onItemContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, isFile: boolean, index: number) => {
        e.preventDefault()
        e.stopPropagation()
        setContextMenuState({
            items: [
                {
                    title: "Копировать",
                    onClick: () => {
                        setBufferElement({
                            name: folderStructureInfo!.files[index].name,
                            sourceDirectory: currentFolderPath,
                            isFile,
                            mode: "copy"
                        })
                    }
                },
                {
                    title: "Вырезать",
                    onClick: () => {
                        setBufferElement({
                            name: folderStructureInfo!.files[index].name,
                            sourceDirectory: currentFolderPath,
                            isFile,
                            mode: "cut"
                        })
                    }
                },
                {
                    title: "Переименовать",
                    onClick: () => {
                        const name = isFile ? folderStructureInfo!.files[index].name :
                            folderStructureInfo!.folders[index].name
                        setEditingItem({
                            index,
                            isFile,
                            originName: name,
                            newName: name
                        })
                    }
                },
                {
                    title: "Удалить",
                    onClick: () => {
                        const text = "Вы действительно хотите удалить" +
                            (isFile ? `файл ${folderStructureInfo!.files[index].name}` :
                                `папку ${folderStructureInfo!.folders[index].name}`)

                        setConfirmActionModalWindowState({
                            text,
                            onConfirm: () => deleteItem(index, isFile),
                            onDismiss: () => setConfirmActionModalWindowState(undefined),
                            closable: true,
                            backgroundOverlap: true
                        })
                    }
                }
            ],
            onClose: () => setContextMenuState(undefined),
            x: e.pageX,
            y: e.pageY
        })
    }

    const onFileInputFilesLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const fd = new FormData()
        const filesCount = e.target.files.length
        for (let i = 0; i < filesCount; i++) {
            fd.append("files", e.target.files[i])
        }

        const params = {
            folder: "."
        }

        await axiosApi.post(`${ENDPOINT_FILES}/Upload`, fd, { params })
            .then(res => {
                fetchFolderData()
                const count = res.data.count
                const ending = count > 1 ? "ы" : ""
                addNotification({ type: "success", title: "Успех", message: `Файл${ending} загружен${ending} (${count} шт.)` })
            })
            .catch(err => {
                const ending = filesCount > 1 ? "ы" : ""
                addNotification({ type: "danger", title: `Не удалось загрузить файл${ending}`, message: err.code })
            })
        e.target.value = ""
    }

    const deleteItem = (index: number, isFile: boolean) => {
        if (!folderStructureInfo) return
        const name = isFile ?
            folderStructureInfo.files[index].name :
            folderStructureInfo.folders[index].name
        const data: DeleteCommandType = {
            currentFolderPath,
            isFile,
            targetName: name
        }
        axiosApi.post(`${ENDPOINT_FILES}/Delete`, data)
            .then(res => {
                setFolderStructureInfo({
                    ...folderStructureInfo,
                    ...(isFile && { files: folderStructureInfo.files.filter((el, key) => key !== index) }),
                    ...(!isFile && {
                        folders: folderStructureInfo.folders.filter((el, key) => key !== index),
                        folderCount: folderStructureInfo.folderCount - 1
                    })
                })
                addNotification({ type: "success", title: isFile ? "Файл удалён" : "Папка удалена" })
                setConfirmActionModalWindowState(undefined)
            })
            .catch(err => {
                addNotification({ type: "danger", title: `Не удалось удалить ${isFile ? "файл" : "папку"}`, message: err.code })
            })
    }

    const pasteFile = () => {
        if (!bufferElement ||
            bufferElement.sourceDirectory === currentFolderPath) return
        if (bufferElement.mode === "copy") {
            const data: CopyCommandType = {
                currentFolderPath,
                ...bufferElement,
                overwrite: false
            }
            axiosApi.post(`${ENDPOINT_FILES}/Copy`, data)
                .then(res => {
                    addNotification({ type: "success", title: "Файл скопирован" })
                    fetchFolderData()
                })
                .catch(err => {
                    addNotification({ type: "danger", title: "Не удалось скопировать файл", message: err.code })
                })
        }
        else {
            const data: MoveCommandType = {
                currentFolderPath,
                ...bufferElement,
                overwrite: false
            }
            axiosApi.post(`${ENDPOINT_FILES}/Move`, data)
                .then(res => {
                    addNotification({ type: "success", title: "Файл перемещён" })
                    fetchFolderData()
                })
                .catch(err => {
                    addNotification({ type: "danger", title: "Не удалось переместить файл", message: err.code })
                })
        }
    }

    const onItemNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditingItem({
            ...editingItem!,
            newName: e.target.value
        })
    }

    const createFolder = () => {
        const regex = /(Новая папка)\(?(\d*)\)?/

        const maxFolderNumber = folderStructureInfo!.folders.map(el => {
            const match = el.name.match(regex)
            if (match) {
                console.log(match[2])
                if (match[2])
                    return parseInt(match[2])
                if (match[1]) return 1
            }
            return 0
        }).reduce((acc, cur) => (
            acc > cur ? acc : cur
        ), 0)
        const name = "Новая папка" + (maxFolderNumber > 0 ? `(${maxFolderNumber + 1})` : "")
        const data: CreateCommandType = {
            name,
            currentFolderPath
        }
        axiosApi.post(`${ENDPOINT_FILES}/Create`, data)
            .then(res => {
                if (!folderStructureInfo) return
                const newFolder: FileSystemObjectInfoType = {
                    name,
                    properties: []
                }
                const folderCount = folderStructureInfo.folderCount
                setFolderStructureInfo(prev => ({
                    ...folderStructureInfo,
                    folderCount: folderCount + 1,
                    folders: [...folderStructureInfo.folders, newFolder]
                }))
                console.log(folderStructureInfo)
                setEditingItem({
                    index: folderCount,
                    isFile: false,
                    originName: name,
                    newName: name
                })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Не удалось создать папку", message: err.code })
            })
    }

    return (
        <div className={styles.container}>
            <div className={styles.navigation_section}>
                <div className={styles.path_navigation}>
                    <ArrowIcon
                        className={styles.go_back_arrow}
                        onClick={onGoBackArrowClick}
                    />
                    <div className={styles.current_path}>
                        {currentFolderPath}
                    </div>
                </div>
                <div
                    className={styles.structure_navigation}
                    ref={structureNavigationRef}
                    onContextMenu={onStructureContextMenu}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: "none" }}
                        multiple
                        onChange={onFileInputFilesLoad}
                    />
                    {contextMenuState &&
                        <ContextMenu
                            {...contextMenuState}
                        />
                    }
                    {folderStructureInfo?.folders.map((el, key) => (
                        <div
                            className={styles.navigation_section_item}
                            onDoubleClick={() => onFolderDoubleClick(el.name)}
                            key={key}
                            onContextMenu={(e) => onItemContextMenu(e, false, key)}
                        >
                            <FolderIcon
                                className={styles.item_icon}
                            />
                            {editingItem && editingItem.index === key && !editingItem.isFile ?
                                <input
                                    className={styles.item_name}
                                    value={editingItem.newName}
                                    onChange={onItemNameChange}
                                    ref={editingItemRef}
                                    autoFocus
                                />
                                :
                                <div className={styles.item_name}>
                                    {el.name}
                                </div>
                            }
                        </div>
                    ))}
                    {folderStructureInfo?.files.map((el, key) => (
                        <div
                            className={cn(
                                styles.navigation_section_item,
                                { [styles.navigation_section_item_selected]: key === selectedFileIndex }
                            )}
                            key={key}
                            onClick={() => onFileSelect(key)}
                            ref={key === selectedFileIndex ? selectedFileRef : null}
                            onContextMenu={(e) => onItemContextMenu(e, true, key)}
                        >
                            <FileIcon
                                className={styles.item_icon}
                            />
                            {editingItem && editingItem.index === key && editingItem.isFile ?
                                <input
                                    className={styles.item_name}
                                    value={editingItem.newName}
                                    onChange={onItemNameChange}
                                    ref={editingItemRef}
                                    autoFocus
                                />
                                :
                                <div className={styles.item_name}>
                                    {el.name}
                                </div>
                            }
                        </div>
                    ))}
                </div>
                <div className={styles.controls}>
                    <Button
                        title="Загрузить"
                        size="small"
                    />
                </div>
            </div>
            <div className={styles.file_section}>
                {
                    folderStructureInfo?.files[selectedFileIndex] &&
                    <>
                        <div className={styles.file_name}>
                            {folderStructureInfo.files[selectedFileIndex].name}
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default FileLoader