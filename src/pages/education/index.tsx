import EducationTemplate from "components/templates/education"
import { UserThemeType } from "components/templates/education/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import { ENDPOINT_USER_THEMES } from "constants/endpoints"
import React, { useEffect } from "react"
import axiosApi from "utils/axios"
import { wrapper } from "store"
import { NextPageContext } from 'next'
import { ROUTE_REGISTRATION } from "constants/routes"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"

type EducationPageProps = {
    success: boolean,
    error: string,
    userThemes: UserThemeType[],
    redirectPath?: string
}

const Education = ({
    success,
    error,
    userThemes,
    redirectPath
}: EducationPageProps) => {
    const router = useRouter()
    const user = useSelector(userSelector)

    useEffect(() => {
        if (!success && redirectPath || !user.authorized)
            router.replace(redirectPath || ROUTE_REGISTRATION)
    }, [success, redirectPath, user])

    return (
        <>
            {success ?
                <EducationTemplate
                    userThemes={userThemes}
                />
                :
                <LoadingErrorTemplate
                    error={error}
                />
            }
        </>
    )
}

Education.getInitialProps = wrapper.getInitialPageProps(store => async ({ pathname, req, res }: NextPageContext) => {
    const pageProps: EducationPageProps = {
        success: true,
        error: "",
        userThemes: []
    }

    const user = store.getState().user
    if (!user.authorized) {
        pageProps.success = false
        pageProps.redirectPath = ROUTE_REGISTRATION
        return pageProps
    }

    await axiosApi.get(ENDPOINT_USER_THEMES)
        .then(res => {
            pageProps.userThemes = res.data
        })
        .catch(err => {
            pageProps.success = false
            pageProps.error = err.code
        })

    return pageProps
});

export default Education