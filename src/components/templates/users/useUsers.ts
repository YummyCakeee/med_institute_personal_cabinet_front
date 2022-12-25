import { ENDPOINT_USERS } from "constants/endpoints"
import { ROUTE_USERS } from "constants/routes"
import { useModalWindowContext } from "context/modalWindowContext"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Store } from "react-notifications-component"
import axiosApi from "utils/axios"
import { UserProfileType } from "./types"

export enum UserField {
    SECOND_NAME = "secondName", FIRST_NAME = "firstName", LAST_NAME = "lastName",
    LOGIN = "user.userName", EMAIL = "user.email", ROLES = "user.userRoles"
}

export enum FilterSortField {
    LAST_NAME = "LastName", FIRST_NAME = "FirstName",
    SECOND_NAME = "SecondName", LOGIN = "Login", EMAIL = "Email", ROLES = "Roles"
}

const useUsers = () => {

    const router = useRouter()
    const [sortingFieldName, setSortingFieldName] = useState<FilterSortField | undefined>(FilterSortField.LAST_NAME)
    const [filteringFieldName, setFilteringFieldName] = useState<FilterSortField | undefined>(undefined)
    const [filteringFieldValue, setFilteringFieldValue] = useState<string>("")
    const [totalUsersCount, setTotalUsersCount] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const usersPerPage = 10

    const [users, setUsers] = useState<UserProfileType[]>([])
    const [headers] = useState([
        {
            title: "Фамилия",
            field: UserField.LAST_NAME,
            filterSortFieldName: FilterSortField.LAST_NAME,
            clickable: true
        },
        {
            title: "Имя",
            field: UserField.FIRST_NAME,
            filterSortFieldName: FilterSortField.FIRST_NAME,
            clickable: true
        },
        {
            title: "Отчество",
            field: UserField.SECOND_NAME,
            filterSortFieldName: FilterSortField.SECOND_NAME,
            clickable: true
        },
        {
            title: "Логин",
            field: UserField.LOGIN,
            filterSortFieldName: FilterSortField.LOGIN,
            clickable: true
        },
        {
            title: "Email",
            field: UserField.EMAIL,
            filterSortFieldName: FilterSortField.EMAIL,
            clickable: true
        },
        {
            title: "Роли",
            field: UserField.ROLES,
            filterSortFieldName: FilterSortField.ROLES
        }
    ])

    const {
        setConfirmActionModalWindowState,
        setUserModalWindowState,
        setUserBlockModalWindowState
    } = useModalWindowContext()
    useEffect(() => {
        const params = {
            filterField: filteringFieldName
        }
        axiosApi.get(`${ENDPOINT_USERS}/Count`, { params })
            .then(res => {
                setTotalUsersCount(res.data)
            })
            .catch(err => {
                console.log(err)
            })

    }, [])

    const getUsers = () => {
        const params = {
            limit: usersPerPage,
            offset: (currentPage - 1) * usersPerPage,
            ...(filteringFieldName && { filterField: filteringFieldName }),
            ...(filteringFieldName && { filterString: filteringFieldValue }),
            ...(sortingFieldName && { sortFieldEnum: sortingFieldName })
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
        let filterField: FilterSortField | undefined = undefined
        switch (field) {
            case UserField.FIRST_NAME:
                filterField = FilterSortField.FIRST_NAME
                break
            case UserField.SECOND_NAME:
                filterField = FilterSortField.SECOND_NAME
                break
            case UserField.LAST_NAME:
                filterField = FilterSortField.LAST_NAME
                break
            case UserField.LOGIN:
                filterField = FilterSortField.LOGIN
                break
            case UserField.EMAIL:
                filterField = FilterSortField.EMAIL
                break
            case UserField.ROLES:
                filterField = FilterSortField.ROLES
                break
        }
        setFilteringFieldName(filterField)
    }

    const onFieldFilterValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilteringFieldValue(e.target.value)
    }

    const onHeaderClick = (index: number) => {
        const newSortingFieldName = headers[index].filterSortFieldName
        if (newSortingFieldName === sortingFieldName)
            setSortingFieldName(undefined)
        else
            setSortingFieldName(newSortingFieldName)
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
        setUserBlockModalWindowState({
            user: users[index],
            onSuccess: (result, lockoutEnd) => {
                setUsers(prev => prev.map(el => {
                    if (el.userId === users[index].userId) {
                        return {
                            ...el,
                            user: {
                                ...el.user,
                                lockoutEnd
                            }
                        }
                    }
                    return el
                }))
                setUserBlockModalWindowState(undefined)
                Store.addNotification({
                    container: "top-right",
                    type: "success",
                    title: result === "blocked" ?
                        "Пользователь заблокирован" :
                        "Пользователь разблокирован",
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                })
            },
            onError: (err) => {
                Store.addNotification({
                    container: "top-right",
                    type: "danger",
                    title: "Ошибка",
                    message: err.code,
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                })
            },
            onDismiss: () => setUserBlockModalWindowState(undefined),
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