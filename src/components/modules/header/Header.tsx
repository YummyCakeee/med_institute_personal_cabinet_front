import Link from "next/link"
import React, { useState } from "react"
import styles from "./Header.module.scss"

const Header = () => {

    const [sections] = useState([
        {
            name: "Образовательные программы",
            link: "/educationalPrograms",
        },
        {
            name: "Пользователи",
            link: "/users",
        },
        {
            name: "Курсы",
            link: "/courses",
        },
        {
            name: "Коллекция тестов",
            link: "/testsCollection",
        },
        {
            name: "Мой профиль",
            link: "/",
        }
    ])

    return (
        <div className={styles.container}>
            <div className={styles.sections_list}>
                {sections.map((el, key) => (
                    <Link
                        key={key}
                        href={el.link}
                        className={styles.section}>
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