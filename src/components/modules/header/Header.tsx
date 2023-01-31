import Link from "next/link"
import { useRouter } from "next/router"
import React, { useMemo } from "react"
import cn from "classnames"
import styles from "./Header.module.scss"
import {
    ROUTE_COURSES,
    ROUTE_EDUCATION,
    ROUTE_EDUCATIONAL_PROGRAMS,
    ROUTE_EDUCATION_TEACHER,
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
import UserAvatar from "components/elements/userAvatar"
import { UserRoleType } from "components/templates/users/types"
import addNotification from "utils/notifications"
import { getServerErrorResponse } from "utils/serverData"

type SectionType = {
    name: string,
    path: string
}

type SectionCollectionType = {
    [field: string]: SectionType
}

const Header = () => {

    const router = useRouter()
    const user = useSelector(userSelector)
    const dispatch = useDispatch<AppDispatch>()

    const userSections = useMemo(() => {
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
            educationTeacher: {
                name: "Обучение студентов",
                path: ROUTE_EDUCATION_TEACHER
            },
            profile: {
                name: "Мой профиль",
                path: ROUTE_PROFILE
            }
        }
        const updatedUserSections: SectionCollectionType = {}

        if (user.roles?.includes(UserRoleType.ADMINISTRATOR)) {
            updatedUserSections.users = sections.users
            updatedUserSections.educationalPrograms = sections.educationalPrograms
            updatedUserSections.courses = sections.courses
            updatedUserSections.testing = sections.testing
            updatedUserSections.educationTeacher = sections.educationTeacher
        }

        if (user.roles?.includes(UserRoleType.TEACHER)) {
            updatedUserSections.educationalPrograms = sections.educationalPrograms
            updatedUserSections.courses = sections.courses
            updatedUserSections.testing = sections.testing
            updatedUserSections.educationTeacher = sections.educationTeacher
        }

        if (user.roles?.includes(UserRoleType.STUDENT)) {
            updatedUserSections.education = sections.education
        }
        updatedUserSections.profile = sections.profile

        const sectionsArray: SectionType[] = []
        Object.values(updatedUserSections).forEach(el => {

            sectionsArray.push(el)
        })

        return sectionsArray
    }, [user.roles])

    const onLogoutClick = () => {
        axiosApi.post(`${ENDPOINT_ACCOUNT}/Logout`)
            .then(res => {
                dispatch(userLoggedOut())
                router.replace(ROUTE_REGISTRATION)
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось выйти из аккаунта:\n${getServerErrorResponse(err)}` })
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
                    <UserAvatar />
                    <div
                        className={styles.logout_section_button}
                        onClick={onLogoutClick}
                        title="Выйти из аккаунта"
                    >
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