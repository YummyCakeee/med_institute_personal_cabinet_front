import React, { useEffect, useState } from "react"
import axiosApi from "utils/axios"
import { ENDPOINT_USERS } from "constants/endpoints"
import { UserProfileType } from "components/templates/users/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { useRouter } from "next/router"
import UserTemplate from "components/templates/users/user/UserTemplate"
import { ROUTE_USERS } from "constants/routes"
import { wrapper } from "store"
import { setBreadCrumbs } from "store/breadCrumbsSlice"

const User = () => {

    const user = useSelector(userSelector)
    const router = useRouter()
    const [userProfile, setUserProfile] = useState<UserProfileType>()
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        const { id } = router.query
        if (user.authorized) {
            axiosApi.get(`${ENDPOINT_USERS}/${id}`)
                .then(res => {
                    setSuccess(true)
                    setUserProfile(res.data)
                })
                .catch(err => {
                    setSuccess(false)
                    setError(err.code)
                })
        }
    }, [user.authorized, router.query])

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