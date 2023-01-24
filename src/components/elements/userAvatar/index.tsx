import Image from "next/image"
import React, { useMemo } from "react"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import styles from "./UserAvatar.module.scss"


const UserAvatar = () => {

    const user = useSelector(userSelector)

    const avatar = useMemo(() => {
        if (user.profilePicture && user.profilePicture.length)
            return user.profilePicture
        return "/images/user.png"
    }, [user.profilePicture])
    return (
        <div
            className={styles.container}
            title={user.login}
        >
            <Image
                width={40}
                height={40}
                quality={70}
                src={avatar}
                alt="Фото профиля"
            />
        </div>
    )
}

export default UserAvatar