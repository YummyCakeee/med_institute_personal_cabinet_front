import React, { useEffect, useMemo, useRef, useState } from "react"
import { FieldProps } from "formik"
import styles from "./UserAvatarField.module.scss"
import Image from "next/image"
import cn from "classnames"
import { CrossIcon } from "components/elements/icons"

type UserAvatarFieldProps = FieldProps & {
    maxSize?: number
}

const UserAvatarField = ({
    form: { setFieldValue, setFieldError, errors },
    field: { name, value },
    maxSize = 500,
    ...props
}: UserAvatarFieldProps) => {

    const ref = useRef<HTMLInputElement>(null)
    const [initialPhoto, setInitialPhoto] = useState<string>()

    const image = useMemo(() => {
        if (ref.current && ref.current.files?.length) {
            return URL.createObjectURL(ref.current.files[0])
        }
        return initialPhoto || "/images/user.png"
    }, [ref.current?.files, initialPhoto])

    useEffect(() => {
        if (!initialPhoto)
            setInitialPhoto(value)
    }, [value])

    const onAvatarClick = () => {
        if (ref.current)
            ref.current.click()
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files?.length) {
            if (e.currentTarget.files[0].size <= maxSize * 1024) {
                setFieldValue(name, e.currentTarget.files[0])
                setFieldError(name, undefined)
            }
            else {
                setFieldError(name, `Максимальный размер изображения: ${maxSize} Кб`)
                e.preventDefault()
                e.currentTarget.value = ""
                setTimeout(() => {
                    setFieldError(name, undefined)
                }, 2000)
            }
        }
    }

    const onRemovePhotoClick = () => {
        setFieldValue(name, "")
        setFieldError(name, undefined)
        setInitialPhoto("")
        if (ref.current) ref.current.value = ""
    }

    return (
        <div className={styles.container}>
            <div className={styles.avatar_container}>
                <div className={styles.avatar}>
                    <div
                        className={styles.avatar_overlap}
                        onClick={onAvatarClick}
                    >
                        Выбрать
                    </div>
                    <input
                        {...{
                            type: "file",
                            name,
                            accept: ".png, .jpg, .jpeg",
                            ref,
                            style: { display: "none" },
                            onChange,
                            ...props
                        }}
                    />
                    <Image
                        width={100}
                        height={100}
                        quality={80}
                        src={image}
                        alt="Фото профиля"
                    />
                </div>
                <div className={styles.avatar_remove_container}>
                    <CrossIcon
                        className={styles.avatar_remove_button}
                        onClick={onRemovePhotoClick}
                    />
                </div>
            </div>
            <div className={cn(
                styles.avatar_error,
                { [styles.avatar_error_shown]: errors[name] }

            )}>
                {`${errors[name]}`}
            </div>
        </div>
    )
}

export default UserAvatarField