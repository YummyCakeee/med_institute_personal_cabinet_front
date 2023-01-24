import React from "react"
import UsersTemplate from "components/templates/users"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"

const Users = () => {
    const user = useSelector(userSelector)
    return (
        <>
            {user.authorized ?
                <UsersTemplate /> :
                <UnauthorizedTemplate />
            }
        </>
    )
}

export default Users