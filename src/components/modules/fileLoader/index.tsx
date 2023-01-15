import { CrossIcon, FileIcon } from "components/elements/icons"
import { useModalWindowContext } from "context/modalWindowContext"
import React, { useRef } from "react"
import styles from "./FileLoader.module.scss"
import cn from "classnames"
import Button from "components/elements/button/Button"
import axiosApi from "utils/axios"
import { ENDPOINT_FILES } from "constants/endpoints"

type FileLoaderProps = {
    files: File[],
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    multiple?: boolean,
    accept?: string,
    className?: string
}

const FileLoader = ({
    files,
    setFiles,
    multiple,
    accept,
    className
}: FileLoaderProps) => {

    const { setConfirmActionModalWindowState } = useModalWindowContext()
    const inputRef = useRef<HTMLInputElement>(null)


    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const newFiles: File[] = []
        for (let i = 0; i < e.target.files.length || 0; i++) {
            newFiles.push(e.target.files[i])
        }
        if (multiple)
            setFiles(prev => [...prev, ...newFiles])
        else setFiles(newFiles)
        e.target.value = ""
    }

    const onFileDelete = (index: number) => {
        const deleteFile = (index: number) => {
            setFiles(prev => prev.filter((el, key) => key !== index))
            setConfirmActionModalWindowState(undefined)
        }
        setConfirmActionModalWindowState({
            text: `Удалить файл ${files[index].name}?`,
            onDismiss: () => setConfirmActionModalWindowState(undefined),
            onConfirm: () => deleteFile(index),
            backgroundOverlap: true,
            closable: true
        })
    }

    const onFilesAttachClick = () => {
        if (inputRef.current) inputRef.current.click()
    }

    return (
        <div className={cn(styles.container, className)}>
            <div className={styles.file_list}>
                {files?.length ? files.map((el, key) => (
                    <div
                        key={key}
                        className={styles.file}
                        title={el.name}
                    >
                        <CrossIcon
                            className={styles.file_delete_icon}
                            onClick={() => onFileDelete(key)}
                        />
                        <FileIcon
                            className={styles.file_icon}
                        />
                        <div className={styles.file_name}>
                            {el.name}
                        </div>
                    </div>
                )) :
                    <div className={styles.file_list_empty}>Список пуст</div>
                }
            </div>
            <div className={styles.control_section}>
                <input
                    type="file"
                    accept={accept}
                    onChange={onFileSelect}
                    multiple={multiple}
                    style={{ display: "none" }}
                    ref={inputRef}
                />
                <Button
                    title={`Прикрепить файл${multiple ? "ы" : ""}`}
                    onClick={onFilesAttachClick}
                    stretchable={true}
                />
            </div>
        </div>
    )

}

export default FileLoader