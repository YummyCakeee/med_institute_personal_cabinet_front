import { CrossIcon, FileIcon } from "components/elements/icons"
import { useModalWindowContext } from "context/modalWindowContext"
import React, { useState } from "react"
import styles from "./FileLoader.module.scss"
import cn from "classnames"

type FileLoaderProps = {
    files: File[],
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    className?: string
}

const FileLoader = ({
    files,
    setFiles,
    className
}: FileLoaderProps) => {

    const { setConfirmActionModalWindowState } = useModalWindowContext()

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const newFiles: File[] = []
        for (let i = 0; i < e.target.files.length || 0; i++) {
            newFiles.push(e.target.files[i])
        }
        setFiles(prev => [...prev, ...newFiles])
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
                <label className={styles.file_select}>
                    <input
                        type="file"
                        accept=".txt, .doc, .docx"
                        onChange={onFileSelect}
                        multiple
                    />
                    Добавить файлы
                </label>
            </div>
        </div>
    )

}

export default FileLoader