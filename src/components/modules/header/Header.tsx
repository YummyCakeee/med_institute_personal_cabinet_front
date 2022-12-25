import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import cn from "classnames"
import styles from "./Header.module.scss"
import {
    ROUTE_COURSES,
    ROUTE_EDUCATION,
    ROUTE_EDUCATIONAL_PROGRAMS,
    ROUTE_PROFILE,
    ROUTE_REGISTRATION,
    ROUTE_TESTING,
    ROUTE_USERS
} from "constants/routes"
import { LogoutIcon } from "components/elements/icons"
import axiosApi from "utils/axios"
import { ENDPOINT_LOGOUT } from "constants/endpoints"

const Header = () => {

    const router = useRouter()

    const [sections] = useState([
        {
            name: "Программы обучения",
            path: ROUTE_EDUCATIONAL_PROGRAMS
        },
        {
            name: "Пользователи",
            path: ROUTE_USERS
        },
        {
            name: "Курсы",
            path: ROUTE_COURSES
        },
        {
            name: "Тестирование",
            path: ROUTE_TESTING
        },
        {
            name: "Обучение",
            path: ROUTE_EDUCATION
        },
        {
            name: "Мой профиль",
            path: ROUTE_PROFILE
        }
    ])

    const onLogoutClick = () => {
        axiosApi.post(ENDPOINT_LOGOUT)
            .then(res => {
                router.replace(ROUTE_REGISTRATION)
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div className={styles.container}>
            <div className={styles.sections_list}>
                {sections.map((el, key) => (
                    <Link
                        key={key}
                        href={el.path}
                        className={cn(
                            styles.section,
                            { [styles.section_selected]: router.pathname.match(`^${el.path}(/.*|$)`) }
                        )}>
                        <p>{el.name}</p>
                    </Link>
                ))}
            </div>
            <div className={styles.logout_section}>
                <div
                    className={styles.logout_section_button}
                    onClick={onLogoutClick}
                >
                    Выйти из аккаунта
                    <LogoutIcon
                        className={styles.logout_section_button_icon}
                        width={15}
                        height={15}
                    />
                </div>
            </div>
        </div>
    )
}

export default Header