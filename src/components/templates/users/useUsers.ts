import { LoadingStatusType } from "components/modules/LoadingStatusWrapper/LoadingStatusWrapper"
import { ENDPOINT_USERS } from "constants/endpoints"
import { ROUTE_USERS } from "constants/routes"
import { useModalWindowContext } from "context/modalWindowContext"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import axiosApi from "utils/axios"
import addNotification from "utils/notifications"
import { getServerErrorResponse } from "utils/serverData"
import { UserProfileType } from "./types"

export enum UserField {
    SECOND_NAME = "secondName", FIRST_NAME = "firstName", LAST_NAME = "lastName",
    LOGIN = "userName", EMAIL = "user.email", ROLES = "user.userRoles"
}

export enum FilterSortField {
    LAST_NAME = "LastName", FIRST_NAME = "FirstName",
    SECOND_NAME = "SecondName", LOGIN = "Login", EMAIL = "Email", ROLES = "Roles"
}

const useUsers = () => {

    const router = useRouter()
    const [sortingFieldName, setSortingFieldName] = useState<FilterSortField | undefined>(FilterSortField.LAST_NAME)
    const [sortOrder, setsortOrder] = useState<"Asc" | "Desc">("Asc")
    const [filteringFieldName, setFilteringFieldName] = useState<FilterSortField>(FilterSortField.LAST_NAME)
    const [filteringFieldValue, setFilteringFieldValue] = useState<string>("")
    const [totalUsersCount, setTotalUsersCount] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [usersLoadingStatus, setUsersLoadingStatus] = useState<LoadingStatusType>(LoadingStatusType.LOADING)
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
        setUserModalWindowState,
        setUserBlockModalWindowState
    } = useModalWindowContext()

    useEffect(() => {
        setUsersLoadingStatus(LoadingStatusType.LOADING)
        const params = {
            filterField: filteringFieldName,
            filterString: filteringFieldValue
        }
        axiosApi.get(`${ENDPOINT_USERS}/Count`, { params })
            .then(res => {
                setTotalUsersCount(res.data)
                setUsersLoadingStatus(LoadingStatusType.LOADED)
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось получить число всех пользователей:\n${getServerErrorResponse(err)}` })
                setUsersLoadingStatus(LoadingStatusType.LOAD_ERROR)
            })

    }, [filteringFieldName, filteringFieldValue])

    useEffect(() => {
        const getUsers = () => {
            setUsersLoadingStatus(LoadingStatusType.LOADING)
            const params = {
                limit: usersPerPage,
                offset: (currentPage - 1) * usersPerPage,
                ...(filteringFieldName && { filterField: filteringFieldName }),
                ...(filteringFieldName && { filterString: filteringFieldValue }),
                ...(sortingFieldName && {
                    sortFieldEnum: sortingFieldName,
                    sortOrder
                }),
            }
            axiosApi.get(ENDPOINT_USERS, { params })
                .then(res => {
                    setUsers(res.data)
                    setUsersLoadingStatus(LoadingStatusType.LOADED)
                })
                .catch(err => {
                    addNotification({ type: "danger", title: "Ошибка", message: `Не удалось загрузить список пользователей:\n${getServerErrorResponse(err)}` })
                    setUsersLoadingStatus(LoadingStatusType.LOAD_ERROR)
                })
        }
        getUsers()
    }, [sortingFieldName, sortOrder, filteringFieldName, filteringFieldValue, currentPage, usersPerPage])

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
        if (filterField)
            setFilteringFieldName(filterField)
    }

    const onFieldFilterValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilteringFieldValue(e.target.value)
    }

    const onHeaderClick = (index: number) => {
        const newSortingFieldName = headers[index].filterSortFieldName
        if (newSortingFieldName === sortingFieldName)
            setsortOrder(sortOrder === "Asc" ? "Desc" : "Asc")
        else {
            setSortingFieldName(newSortingFieldName)
            setsortOrder("Asc")
        }
    }

    const onUserDetailsClick = (index: number) => {
        const id = users[index].userId
        router.push(`${ROUTE_USERS}/${id}`)
    }

    const onUserAddClick = () => {
        setUserModalWindowState({
            mode: "add",
            closable: true,
            backgroundOverlap: true,
            onSuccess: (user) => {
                setUsers([...users, user])
                addNotification({ type: "success", title: "Успех", message: "Пользователь добавлен" })
                setUserModalWindowState(undefined)
            },
            onError: (err) => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось добавить пользователя:\n${getServerErrorResponse(err)}` })
            }
        })
    }

    const onUserEditClick = (index: number) => {
        setUserModalWindowState({
            mode: "edit",
            user: users[index],
            closable: true,
            backgroundOverlap: true,
            onSuccess: (user) => {
                setUsers(users.map(el => {
                    if (el.userId !== user.userId) return el
                    return {
                        ...el,
                        ...user
                    }
                }))
                addNotification({ type: "success", title: "Успех", message: "Данные пользователя обновлены" })
                setUserModalWindowState(undefined)
            },
            onError: (err) => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось обновить данные пользователя:\n${getServerErrorResponse(err)}` })
            }
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
                addNotification({
                    type: "success", title: "Успех",
                    message: result === "blocked" ?
                        "Пользователь заблокирован" :
                        "Пользователь разблокирован"
                })
            },
            onError: (err) => {
                const user = users[index]
                const initialLockout = user.user!.lockoutEnd &&
                    new Date(user.user!.lockoutEnd) > new Date()
                addNotification({
                    type: "danger", title: "Ошибка",
                    message: `Не удалось ${initialLockout ? "раз" : "за"}блокировать пользователя:\n${getServerErrorResponse(err)}`,
                })
            },
            onDismiss: () => setUserBlockModalWindowState(undefined),
            backgroundOverlap: true,
            closable: true
        })
    }

    const sortingFieldHeaderTitle = useMemo(() => {
        return headers.find(el => el.filterSortFieldName === sortingFieldName)?.title
    }, [headers, sortingFieldName])

    return {
        headers,
        sortOrder,
        users,
        usersLoadingStatus,
        totalUsersCount,
        usersPerPage,
        sortingFieldHeaderTitle,
        onUserDetailsClick,
        onUserEditClick,
        onUserBlockClick,
        onUserAddClick,
        onHeaderClick,
        onFieldFilterSelect,
        onFieldFilterValueChanged,
        setCurrentPage
    }
}

export default useUsers