import React, { useEffect } from "react"
import UsersTemplate from "components/templates/users"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import { wrapper } from "store"
import { clearBreadCrumbs } from "store/breadCrumbsSlice"
import { UserRoleType } from "components/templates/users/types"
import { useRouter } from "next/router"
import { ROUTE_PROFILE } from "constants/routes"

const Users = () => {
    const user = useSelector(userSelector)
    const router = useRouter()

    useEffect(() => {
        if (user.authorized && !user.roles?.includes(UserRoleType.ADMINISTRATOR))
            router.replace(ROUTE_PROFILE)
            return
    }, [user, router])
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