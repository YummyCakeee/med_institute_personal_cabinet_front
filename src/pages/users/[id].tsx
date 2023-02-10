import React, { useEffect, useState } from "react"
import axiosApi from "utils/axios"
import { ENDPOINT_USERS } from "constants/endpoints"
import { UserProfileType, UserRoleType, UserWithCertificatesType } from "components/templates/users/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { useRouter } from "next/router"
import UserTemplate from "components/templates/users/user/UserTemplate"
import { ROUTE_PROFILE, ROUTE_USERS } from "constants/routes"
import { wrapper } from "store"
import { setBreadCrumbs } from "store/breadCrumbsSlice"
import { getServerErrorResponse } from "utils/serverData"

const User = () => {

    const user = useSelector(userSelector)
    const router = useRouter()
    const [userProfile, setUserProfile] = useState<UserProfileType>()
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        const { id } = router.query
        if (user.authorized) {
            if (!user.roles?.includes(UserRoleType.ADMINISTRATOR)) {
                router.replace(ROUTE_PROFILE)
                return
            }
            axiosApi.get(`${ENDPOINT_USERS}/${id}`)
                .then(res => {
                    setSuccess(true)
                    setUserProfile((res.data as UserWithCertificatesType).user)
                })
                .catch(err => {
                    setSuccess(false)
                    setError(getServerErrorResponse(err))
                })
        }
    }, [user, router])

    return (
        <>
            {user.authorized ?
                <>
                    {success ?
                        <>
                            {userProfile &&
                                <UserTemplate
                                    user={userProfile}
                                />
                            }
                        </>
                        :
                        <LoadingErrorTemplate
                            error={error}
                        />
                    }
                </>
                :
                <UnauthorizedTemplate />
            }
        </>
    )
}

User.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(setBreadCrumbs([
        {
            title: "Пользователи",
            route: ROUTE_USERS
        }
    ]))
})

export default User