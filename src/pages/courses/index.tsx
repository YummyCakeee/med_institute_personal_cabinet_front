import CoursesTemplate from "components/templates/courses"
import React, { useEffect } from "react"
import axiosApi from "utils/axios"
import { ENDPOINT_COURSES } from "constants/endpoints"
import { CourseType } from "components/templates/courses/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import { NextPageContext } from "next"
import { wrapper } from "store"
import { ROUTE_REGISTRATION } from "constants/routes"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import { useRouter } from "next/router"

type CoursesPageProps = {
    success: boolean,
    courses: CourseType[],
    redirectPath?: string
}

const Courses = ({
    success,
    courses,
    redirectPath
}: CoursesPageProps) => {

    const user = useSelector(userSelector)
    const router = useRouter()

    useEffect(() => {
        if (!success && redirectPath || !user.authorized)
            router.replace(redirectPath || ROUTE_REGISTRATION)
    }, [success, redirectPath, user, router])

    return (
        <>
            {success ?
                <CoursesTemplate
                    courses={courses}
                /> :
                <LoadingErrorTemplate />
            }
        </>
    )
}

Courses.getInitialProps = wrapper.getInitialPageProps(store => async ({ }: NextPageContext) => {
    const pageProps: CoursesPageProps = {
        success: true,
        courses: []
    }

    if (!store.getState().user.authorized) {
        pageProps.success = false
        pageProps.redirectPath = ROUTE_REGISTRATION
        return
    }

    await axiosApi.get(ENDPOINT_COURSES)
        .then(res => {
            const data: CourseType[] = res.data;
            pageProps.courses = data
        })
        .catch(err => {
            pageProps.success = false
        })

    return pageProps
})

export default Courses