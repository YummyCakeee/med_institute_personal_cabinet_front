import Link from "next/link"
import { useRouter } from "next/router"
import React, { useMemo } from "react"
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
import { ENDPOINT_ACCOUNT } from "constants/endpoints"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "store"
import { userLoggedOut, userSelector } from "store/userSlice"
import Image from "next/image"

type SectionType = {
    name: string,
    path: string
}

type SectionCollectionType = {
    [field: string]: SectionType
}

enum UserRoleType {
    ADMINISTRATOR = "Administrator",
    TEACHER = "Teacher",
    STUDENT = "Student"
}

const Header = () => {

    const router = useRouter()
    const user = useSelector(userSelector)
    const dispatch = useDispatch<AppDispatch>()

    const sections = {
        educationalPrograms: {
            name: "Программы обучения",
            path: ROUTE_EDUCATIONAL_PROGRAMS
        },
        users: {
            name: "Пользователи",
            path: ROUTE_USERS
        },
        courses: {
            name: "Курсы",
            path: ROUTE_COURSES
        },
        testing: {
            name: "Тестирование",
            path: ROUTE_TESTING
        },
        education: {
            name: "Обучение",
            path: ROUTE_EDUCATION
        },
        profile: {
            name: "Мой профиль",
            path: ROUTE_PROFILE
        }
    }

    const userSections = useMemo(() => {
        const updatedUserSections: SectionCollectionType = {}

        if (user.roles?.includes(UserRoleType.ADMINISTRATOR)) {
            updatedUserSections.users = sections.users
            updatedUserSections.courses = sections.courses
            updatedUserSections.testing = sections.testing
            updatedUserSections.educationalPrograms = sections.educationalPrograms
        }

        if (user.roles?.includes(UserRoleType.TEACHER)) {
            updatedUserSections.courses = sections.courses
            updatedUserSections.testing = sections.testing
            updatedUserSections.educationalPrograms = sections.educationalPrograms
        }

        updatedUserSections.education = sections.education
        updatedUserSections.profile = sections.profile

        const sectionsArray: SectionType[] = []
        Object.values(updatedUserSections).forEach(el => {

            sectionsArray.push(el)
        })

        return sectionsArray
    }, [user.roles, sections])

    const onLogoutClick = () => {
        axiosApi.post(`${ENDPOINT_ACCOUNT}/Logout`)
            .then(res => {
                dispatch(userLoggedOut())
                router.replace(ROUTE_REGISTRATION)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const onLogoClick = () => {
        router.push(ROUTE_PROFILE)
    }

    return (
        <div className={styles.container}>
            <Image
                src="/images/logo.png"
                width={40}
                height={40}
                alt="Лого"
                onClick={onLogoClick}
                className={styles.logo}
            />
            <div className={styles.sections_list}>
                {userSections.map((el, key) => (
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
            {user.authorized &&
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
            }
        </div>
    )
}

export default Header