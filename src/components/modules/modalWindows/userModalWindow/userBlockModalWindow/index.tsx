import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import UserBlockForm from "components/modules/forms/user/block"
import { UserProfileType } from "components/templates/users/types"
import React, { useMemo } from "react"

export interface UserBlockModalWindowProps extends ModalWindowProps {
    user: UserProfileType,
    onSuccess?: (result: "blocked" | "unblocked", lockoutEnd: string) => void,
    onError?: (error: any) => void,
    onDismiss?: () => void
}

const UserBlockModalWindow = ({
    user,
    onSuccess,
    onError,
    onDismiss,
    ...props
}: UserBlockModalWindowProps) => {

    const title = useMemo(() => {
        if (user.user?.lockoutEnd &&
            new Date(user.user.lockoutEnd) > new Date())
            return "Разблокировка пользователя"
        return "Блокировка пользователя"
    }, [user])

    return (
        <ModalWindow
            {...{
                title,
                ...props
            }}
        >
            <UserBlockForm
                {...{
                    user,
                    onSuccess,
                    onError,
                    onDismiss
                }}
            />
        </ModalWindow>
    )
}

export default UserBlockModalWindow