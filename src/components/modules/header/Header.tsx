import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import cn from "classNames"
import styles from "./Header.module.scss"

const Header = () => {

    const router = useRouter()

    const [sections] = useState([
        {
            name: "Образовательные программы",
            path: "/educationalPrograms",
        },
        {
            name: "Пользователи",
            path: "/users",
        },
        {
            name: "Курсы",
            path: "/courses",
        },
        {
            name: "Коллекция тестов",
            path: "/testsCollection",
        },
        {
            name: "Мой профиль",
            path: "/",
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