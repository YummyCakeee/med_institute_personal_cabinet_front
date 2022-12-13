import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import UserForm from "components/modules/forms/user"
import { UserType } from "components/templates/users/useUsers"
import React from "react"

export interface UserModalWindowProps extends ModalWindowProps {
    mode?: "add" | "edit",
    user?: UserType
}

const UserModalWindow = ({
    mode,
    user,
    ...props
}: UserModalWindowProps) => {
    return (
        <ModalWindow
            {...{
                title: mode === "add" ?
                    "Добавление нового пользователя" :
                    "Редактирование пользователя",
                ...props
            }}
        >
            <UserForm
                mode={mode}
                user={user}
            />
        </ModalWindow>
    )
}

export default UserModalWindow