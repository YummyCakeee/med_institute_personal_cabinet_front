import Layout from "components/layouts/Layout"
import React from "react"
import utilStyles from "styles/utils.module.scss"
import styles from "./UserTemplate.module.scss"
import cn from "classnames"
import Image from "next/image"
import Link from "next/link"
import { ROUTE_USERS } from "constants/routes"
import { ArrowIcon } from "components/elements/icons"
import { UserProfileType } from "../types"
import Head from "next/head"

type UserTemplateProps = {
    user: UserProfileType
}

const UserTemplate = ({
    user
}: UserTemplateProps) => {

    const userInfo = [
        {
            name: "Фамилия",
            value: user.secondName,
        },
        {
            name: "Имя",
            value: user.firstName,
        },
        {
            name: "Отчество",
            value: user.lastName,
        },
        {
            name: "Логин",
            value: user.user?.userName,
        },
        {
            name: "Email",
            value: user.user?.email,
        },
        {
            name: "Роли",
            value: user.user?.userRoles?.map(el => el.role.name).join(', '),
        },
        {
            name: "Доступ",
            value: user.user?.lockoutEnd && new Date(user.user.lockoutEnd) > new Date() ? "Заблокирован" : "Открыт"
        },
    ]

    return (
        <Layout>
            <Head>
                <title>{`Пользователь ${user.lastName} ${user.firstName}`}</title>
            </Head>
            <Link href={ROUTE_USERS}>
                <div className={styles.back_to_user_list}>
                    <ArrowIcon
                        className={styles.back_to_user_list_arrow}
                    />
                    <p className={styles.back_to_user_list_text}>Список пользователей</p>
                </div>
            </Link>
            <div className={styles.personal_info_section}>
                <div
                    className={utilStyles.section_title}>
                    Личная информация
                </div>
                <div className={styles.personal_info_data}>
                    <div className={styles.personal_info_text}>
                        {userInfo.map((el, key) => (
                            <div
                                key={key}
                                className={styles.personal_info_line}
                            >
                                <p className={cn(
                                    utilStyles.text,
                                    utilStyles.text_bold,
                                    styles.personal_info_col
                                )}>{el.name}</p>
                                <p className={cn(
                                    utilStyles.text,
                                    styles.personal_info_col
                                )}>{el.value}</p>
                            </div>
                        ))}
                    </div>
                    <Image
                        className={styles.personal_info_photo}
                        src={user.profilePicture || "/images/user.png"}
                        alt="Фото профиля пользователя"
                        width={150}
                        height={150}
                        quality={100}
                    />
                </div>
            </div>
        </Layout>
    )
}

export default UserTemplate