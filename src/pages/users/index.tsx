import React from "react"
import UsersTemplate from "components/templates/users"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import { wrapper } from "store"
import { clearBreadCrumbs } from "store/breadCrumbsSlice"

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

Users.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(clearBreadCrumbs())
})

export default Users