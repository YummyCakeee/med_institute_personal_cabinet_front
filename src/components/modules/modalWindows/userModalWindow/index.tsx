import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import UserForm from "components/modules/forms/user"
import { UserProfileType } from "components/templates/users/types"
import React from "react"

export interface UserModalWindowProps extends ModalWindowProps {
    mode?: "add" | "edit",
    user?: UserProfileType
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