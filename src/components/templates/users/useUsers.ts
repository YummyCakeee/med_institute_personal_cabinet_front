import { ENDPOINT_USERS } from "constants/endpoints"
import { ROUTE_USERS } from "constants/routes"
import { useModalWindowContext } from "context/modalWindowContext"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axiosApi from "utils/axios"
import { UserProfileType } from "./types"

export enum UserField {
    SURNAME = "secondName", NAME = "firstName", PATRONYMIC = "lastName",
    LOGIN = "user.userName", EMAIL = "user.email", ROLES = "user.userRoles"
}

const useUsers = () => {

    const router = useRouter()
    const [sortingFieldName, setSortingFieldName] = useState<UserField | undefined>(UserField.SURNAME)
    const [filteringFieldName, setFilteringFieldName] = useState<UserField | undefined>(undefined)
    const [filteringFieldValue, setFilteringFieldValue] = useState<string>("")
    const [totalUsersCount, setTotalUsersCount] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const usersPerPage = 10

    const [users, setUsers] = useState<UserProfileType[]>([])
    const [headers] = useState([
        {
            title: "Фамилия",
            field: UserField.SURNAME,
            clickable: true
        },
        {
            title: "Имя",
            field: UserField.NAME,
            clickable: true
        },
        {
            title: "Отчество",
            field: UserField.PATRONYMIC,
            clickable: true
        },
        {
            title: "Логин",
            field: UserField.LOGIN,
            clickable: true
        },
        {
            title: "Email",
            field: UserField.EMAIL,
            clickable: true
        },
        {
            title: "Роли",
            field: UserField.ROLES,
            clickable: true
        }
    ])

    const {
        setConfirmActionModalWindowState,
        setUserModalWindowState
    } = useModalWindowContext()

    useEffect(() => {
        // TODO: Поменять на более оптимизированный расчёт

        axiosApi.get(ENDPOINT_USERS)
            .then(res => {
                setTotalUsersCount(res.data.length)
            })
            .catch(err => {
                console.log(err)
            })

    }, [])

    const getUsers = () => {
        const params = {
            limit: usersPerPage,
            offset: (currentPage - 1) * usersPerPage,
        }
        axiosApi.get(ENDPOINT_USERS, { params })
            .then(res => {
                setUsers(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getUsers()
    }, [sortingFieldName, filteringFieldName, filteringFieldValue, currentPage, usersPerPage])

    const onFieldFilterSelect = (option: string) => {
        const field = headers.find(el => el.title === option)?.field
        setFilteringFieldName(field || undefined)
    }

    const onFieldFilterValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilteringFieldValue(e.target.value)
    }

    const onHeaderClick = (index: number) => {
        const newSortingFieldName = headers[index].field
        if (newSortingFieldName === sortingFieldName)
            setSortingFieldName(undefined)
        else
            setSortingFieldName(headers[index].field)
    }

    const onUserDetailsClick = (index: number) => {
        const id = users[index].userId
        router.push(`${ROUTE_USERS}/${id}`)
    }

    const onUserEditClick = (index: number) => {
        setUserModalWindowState({
            mode: "edit",
            user: users[index],
            closable: true,
            backgroundOverlap: true
        })
    }

    const onUserDeleteClick = (index: number) => {
        setConfirmActionModalWindowState({
            onDismiss: () => setConfirmActionModalWindowState(undefined),
            onConfirm: () => {
                const deletedUserId = users[index].userId
                setUsers(users.filter(el => el.userId !== deletedUserId))
                setConfirmActionModalWindowState(undefined)
            },
            text: `Удалить пользователя ${users[index].secondName} ${users[index].firstName}?`,
            backgroundOverlap: true,
            closable: true
        })
    }

    const onUserBlockClick = (index: number) => {
        const blocked = users[index].blocked
        setConfirmActionModalWindowState({
            onDismiss: () => setConfirmActionModalWindowState(undefined),
            onConfirm: () => {
                const id = users[index].userId
                setUsers(users.map(el => {
                    if (el.userId === id) return { ...el, blocked: !el.blocked }
                    return el
                }))
                setConfirmActionModalWindowState(undefined)
            },
            text: `${blocked ? 'Разблокировать' : 'Заблокировать'} пользователя ${users[index].secondName} ${users[index].firstName}?`,
            backgroundOverlap: true,
            closable: true
        })
    }

    const onUserAddClick = () => {
        setUserModalWindowState({
            mode: "add",
            closable: true,
            backgroundOverlap: true
        })
    }

    return {
        headers,
        sortingFieldName,
        users,
        totalUsersCount,
        usersPerPage,
        onUserDetailsClick,
        onUserEditClick,
        onUserDeleteClick,
        onUserBlockClick,
        onUserAddClick,
        onHeaderClick,
        onFieldFilterSelect,
        onFieldFilterValueChanged
    }
}

export default useUsers