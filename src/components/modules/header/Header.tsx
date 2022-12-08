import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import cn from "classNames"
import styles from "./Header.module.scss"
import {
    ROUTE_COURSES,
    ROUTE_EDUCATIONAL_PROGRAMS,
    ROUTE_PROFILE,
    ROUTE_TESTS_COLLECTION,
    ROUTE_USERS
} from "constants/routes"

const Header = () => {

    const router = useRouter()

    const [sections] = useState([
        {
            name: "Образовательные программы",
            path: ROUTE_EDUCATIONAL_PROGRAMS,
        },
        {
            name: "Пользователи",
            path: ROUTE_USERS,
        },
        {
            name: "Курсы",
            path: ROUTE_COURSES,
        },
        {
            name: "Коллекция тестов",
            path: ROUTE_TESTS_COLLECTION,
        },
        {
            name: "Мой профиль",
            path: ROUTE_PROFILE,
        }
    ])

    return (
        <div className={styles.container}>
            <div className={styles.sections_list}>
                {sections.map((el, key) => (
                    <Link
                        key={key}
                        href={el.path}
                        className={cn(
                            styles.section,
                            { [styles.section_selected]: router.pathname === el.path }
                        )}>
                        <p>{el.name}</p>
                    </Link>
                ))}
            </div>
            <div className={styles.authorize_section}>
                <div className={styles.authorize_section_button}>
                    Регистрация
                </div>
                <div className={styles.authorize_section_button}>
                    Авторизация
                </div>
            </div>
        </div>
    )
}

export default Header