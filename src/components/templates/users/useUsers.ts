import { ROUTE_USERS } from "constants/routes"
import { useModalWindowContext } from "context/modalWindowContext"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

enum UserField {
    SURNAME = "surname", NAME = "name", PATRONYMIC = "patronymic",
    LOGIN = "login", EMAIL = "email", ROLES = "roles"
}

export type UserType = {
    id: number,
    surname: string,
    name: string,
    patronymic: string,
    login: string,
    email: string,
    roles: string[],
    blocked: boolean,
}

const useUsers = () => {

    const [sortingFieldName, setSortingFieldName] = useState<UserField | undefined>(UserField.SURNAME)
    const [filteringFieldName, setFilteringFieldName] = useState<UserField | undefined>(undefined)
    const [filteringFieldValue, setFilteringFieldValue] = useState<string>("")
    const [users, setUsers] = useState<UserType[]>([
        {
            id: 1,
            surname: "Иванов",
            name: "Иван",
            patronymic: "Иванович",
            login: "dangerous_man_3000",
            email: "cuteBarbie@yandex.ru",
            roles: ["administrator", "student"],
            blocked: false
        },
        {
            id: 2,
            surname: "Петров",
            name: "Дмитрий",
            patronymic: "Евгеньевич",
            login: "good_man",
            email: "mrMister@yandex.ru",
            roles: ["student"],
            blocked: false
        },
        {
            id: 3,
            surname: "Алексеев",
            name: "Никита",
            patronymic: "Никифорович",
            login: "unused_login1111",
            email: "chebupelly@yandex.ru",
            roles: ["administrator"],
            blocked: false
        },
        {
            id: 4,
            surname: "Тарасов",
            name: "Олег",
            patronymic: "Богданович",
            login: "ghdfgredfrf",
            email: "cacaboba@yandex.ru",
            roles: ["teacher"],
            blocked: false
        }
    ])
    const [itemListUsers, setItemListUsers] = useState<UserType[]>([])
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
    const router = useRouter()

    const {
        setConfirmActionModalWindowState,
        setUserModalWindowState
    } = useModalWindowContext()

    useEffect(() => {
        let newUsers: UserType[] = []
        if (filteringFieldName) {
            newUsers = users.filter(el => {
                return el[filteringFieldName] === filteringFieldValue
            })
        }
        else {
            newUsers = users.slice()
        }
        if (sortingFieldName) {
            newUsers.sort((a, b) => {
                if (a[sortingFieldName] < b[sortingFieldName]) return -1;
                if (a[sortingFieldName] > b[sortingFieldName]) return 1;
                return 0;
            })
            setItemListUsers(newUsers)
        }
        else {
            setItemListUsers(newUsers)
        }
    }, [users, sortingFieldName, filteringFieldName, filteringFieldValue])

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
        const id = itemListUsers[index].id
        router.push(`${ROUTE_USERS}/${id}`)
    }

    const onUserEditClick = (index: number) => {
        setUserModalWindowState({
            mode: "edit",
            user: itemListUsers[index],
            closable: true,
            backgroundOverlap: true
        })
    }

    const onUserDeleteClick = (index: number) => {
        setConfirmActionModalWindowState({
            onDismiss: () => setConfirmActionModalWindowState(undefined),
            onConfirm: () => {
                const deletedUserId = itemListUsers[index].id
                setUsers(users.filter(el => el.id !== deletedUserId))
                setConfirmActionModalWindowState(undefined)
            },
            text: `Удалить пользователя ${itemListUsers[index].surname} ${itemListUsers[index].name}?`,
            backgroundOverlap: true,
            closable: true
        })
    }

    const onUserBlockClick = (index: number) => {
        const blocked = itemListUsers[index].blocked
        setConfirmActionModalWindowState({
            onDismiss: () => setConfirmActionModalWindowState(undefined),
            onConfirm: () => {
                const id = itemListUsers[index].id
                setUsers(users.map(el => {
                    if (el.id === id) return { ...el, blocked: !el.blocked }
                    return el
                }))
                setConfirmActionModalWindowState(undefined)
            },
            text: `${blocked ? 'Разблокировать' : 'Заблокировать'} пользователя ${itemListUsers[index].surname} ${itemListUsers[index].name}?`,
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
        users: itemListUsers,
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