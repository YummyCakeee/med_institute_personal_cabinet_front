import LoadingErrorTemplate from "components/templates/loadingError"
import TestingTemplate from "components/templates/testing"
import { CollectionType } from "components/templates/testing/types"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { UserRoleType } from "components/templates/users/types"
import { ENDPOINT_COLLECTIONS } from "constants/endpoints"
import { ROUTE_PROFILE } from "constants/routes"
import router from "next/router"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { wrapper } from "store"
import { clearBreadCrumbs } from "store/breadCrumbsSlice"
import { userSelector } from "store/userSlice"
import axiosApi from "utils/axios"
import { getServerErrorResponse } from "utils/serverData"

const Testing = () => {

    const user = useSelector(userSelector)
    const [collections, setCollections] = useState<CollectionType[]>([])
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (user.authorized) {
            if (!user.roles?.includes(UserRoleType.ADMINISTRATOR) && !user.roles?.includes(UserRoleType.TEACHER)) {
                router.replace(ROUTE_PROFILE)
                return
            }
            axiosApi.get(ENDPOINT_COLLECTIONS)
                .then(res => {
                    setSuccess(true)
                    setCollections(res.data)
                })
                .catch(err => {
                    setSuccess(false)
                    setError(getServerErrorResponse(err))
                })
        }
    }, [user])

    return (
        <>
            {user.authorized ?
                <>
                    {success ?
                        <TestingTemplate
                            collections={collections}
                        />
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

Testing.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(clearBreadCrumbs())
})

export default Testing