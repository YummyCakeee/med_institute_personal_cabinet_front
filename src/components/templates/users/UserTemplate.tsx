import Layout from "components/layouts/Layout"
import React from "react"
import utilStyles from "styles/utils.module.scss"
import styles from "./UserTemplate.module.scss"
import cn from "classNames"
import { UserType } from "./useUsers"
import Image from "next/image"
import Link from "next/link"
import { ROUTE_USERS } from "constants/routes"
import { ArrowIcon } from "components/elements/icons"

type UserTemplateProps = {
    user: UserType
}

const UserTemplate = ({
    user
}: UserTemplateProps) => {

    const userInfo = [
        {
            name: "Фамилия",
            value: user.surname,
        },
        {
            name: "Имя",
            value: user.surname,
        },
        {
            name: "Отчество",
            value: user.patronymic,
        },
        {
            name: "Логин",
            value: user.login,
        },
        {
            name: "Email",
            value: user.email,
        },
        {
            name: "Роли",
            value: user.roles.join(', '),
        },
        {
            name: "Доступ",
            value: user.blocked ? "Заблокирован" : "Открыт"
        },
    ]

    return (
        <Layout>
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
                        src={"https://get.pxhere.com/photo/person-people-portrait-facial-expression-hairstyle-smile-emotion-portrait-photography-134689.jpg"}
                        alt="Фото профиля пользователя"
                        width={150}
                        height={200}
                        quality={100}
                    />
                </div>
            </div>
        </Layout>
    )
}

export default UserTemplate