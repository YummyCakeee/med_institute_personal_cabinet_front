import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import UserForm from "components/modules/forms/user"
import { UserProfileType } from "components/templates/users/types"
import React from "react"

export interface UserModalWindowProps extends ModalWindowProps {
    mode?: "add" | "edit",
    user?: UserProfileType,
    onSuccess?: (user: UserProfileType, emailSuccess: boolean) => void,
    onError?: (error: any) => void
}

const UserModalWindow = ({
    mode,
    user,
    onSuccess,
    onError,
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
                {...{
                    user,
                    mode,
                    onSuccess,
                    onError
                }}
            />
        </ModalWindow>
    )
}

export default UserModalWindow