import { CrossIcon, FileIcon } from "components/elements/icons"
import { useModalWindowContext } from "context/modalWindowContext"
import React, { useEffect, useRef, useState } from "react"
import styles from "./FileUploaderField.module.scss"
import cn from "classnames"
import Button from "components/elements/button/Button"
import { FieldProps } from "formik"

type FileUploaderFieldProps = FieldProps & {
    multiple?: boolean,
    accept?: string,
    className?: string
}

const FileUploaderField = ({
    field: { name, value },
    form: { setFieldValue },
    multiple,
    accept,
    className,
    ...props
}: FileUploaderFieldProps) => {

    const { setConfirmActionModalWindowState } = useModalWindowContext()
    const [files, setFiles] = useState<string[]>([])
    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!value) {
            setFiles([])
            return
        }
        if (multiple) {
            setFiles(value.map((el: File) => el.name))
        }
        else {
            setFiles([(value as File).name])
        }
    }, [value])

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.currentTarget.files?.length) return
        if (multiple) {
            const newFiles: File[] = []
            for (let i = 0; i < e.currentTarget.files.length || 0; i++) {
                newFiles.push(e.currentTarget.files[i])
            }
            setFieldValue(name, value.concat(newFiles))
        }
        else {
            setFieldValue(name, e.currentTarget.files[0])
        }
        e.currentTarget.value = ""
    }

    const onFileDetachClick = (index: number) => {
        if (multiple) {
            setFieldValue(name, value.filter((el: File, key: number) => key !== index))
        }
        else {
            setFieldValue(name, undefined)
        }
    }

    const onFilesAttachClick = () => {
        if (ref.current) ref.current.click()
    }

    return (
        <div className={cn(styles.container, className)}>
            <div className={styles.file_list}>
                {files.length ? files.map((el, key) => (
                    <div
                        key={key}
                        className={styles.file}
                        title={el}
                    >
                        <CrossIcon
                            className={styles.file_delete_icon}
                            onClick={() => onFileDetachClick(key)}
                        />
                        <FileIcon
                            className={styles.file_icon}
                        />
                        <div className={styles.file_name}>
                            {el}
                        </div>
                    </div>
                )) :
                    <div className={styles.file_list_empty}>{`Нет файл${multiple ? "ов" : "а"}`}</div>
                }
            </div>
            <div className={styles.control_section}>
                <input
                    {...{
                        name,
                        type: "file",
                        accept,
                        onChange: onFileSelect,
                        multiple,
                        style: { display: "none" },
                        ref
                    }}
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

export default FileUploaderField