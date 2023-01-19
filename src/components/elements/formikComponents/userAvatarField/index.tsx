import React, { useEffect, useMemo, useRef, useState } from "react"
import { FieldProps } from "formik"
import styles from "./UserAvatarField.module.scss"
import Image from "next/image"

type UserAvatarFieldProps = FieldProps & {

}

const UserAvatarField = ({
    form: { setFieldValue },
    field: { name, value },
    ...props
}: UserAvatarFieldProps) => {

    const ref = useRef<HTMLInputElement>(null)
    const [initialPhoto, setInitialPhoto] = useState<string>("")

    const image = useMemo(() => {
        if (ref.current && ref.current.files?.length) {
            return URL.createObjectURL(ref.current.files[0])
        }
        return initialPhoto !== "" ? initialPhoto : "/images/user.png"
    }, [ref.current?.files, initialPhoto])

    useEffect(() => {
        if (initialPhoto === "")
            setInitialPhoto(value)
    }, [value])

    const onAvatarClick = () => {
        if (ref.current)
            ref.current.click()
    }

    return (
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
                    accept: ".png, .jpg, .jpeg",
                    ref,
                    style: { display: "none" },
                    onChange: (e) => setFieldValue(name, e.currentTarget.files?.length ? e.currentTarget.files[0] : ""),
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
    )
}

export default UserAvatarField