import RegistrationTemplate from "components/templates/registration"
import { ROUTE_PROFILE } from "constants/routes"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { wrapper } from "store"
import { clearBreadCrumbs } from "store/breadCrumbsSlice"
import { userSelector } from "store/userSlice"

const Registration = () => {

    const user = useSelector(userSelector)
    const router = useRouter()

    useEffect(() => {
        if (user.authorized) router.replace(ROUTE_PROFILE)
    }, [user.authorized, router])

    return (
        <RegistrationTemplate />
    )
}

Registration.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(clearBreadCrumbs())
})

export default Registration