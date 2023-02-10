import CoursesTemplate from "components/templates/courses"
import React, { useEffect, useState } from "react"
import axiosApi from "utils/axios"
import { ENDPOINT_COURSES } from "constants/endpoints"
import { CourseType } from "components/templates/courses/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import { useRouter } from "next/router"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { clearBreadCrumbs } from "store/breadCrumbsSlice"
import { wrapper } from "store"
import { getServerErrorResponse } from "utils/serverData"
import { UserRoleType } from "components/templates/users/types"
import { ROUTE_PROFILE } from "constants/routes"


const Courses = () => {

    const router = useRouter()
    const user = useSelector(userSelector)
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [courses, setCourses] = useState<CourseType[]>([])

    useEffect(() => {
        if (user.authorized && router.isReady) {
            if (!user.roles?.includes(UserRoleType.ADMINISTRATOR) && !user.roles?.includes(UserRoleType.TEACHER)) {
                router.replace(ROUTE_PROFILE)
                return
            }
            axiosApi.get(ENDPOINT_COURSES)
                .then(res => {
                    setSuccess(true)
                    setCourses(res.data)
                })
                .catch(err => {
                    setSuccess(false)
                    setError(getServerErrorResponse(err))
                })
        }

    }, [router, user])

    return (
        <>
            {user.authorized ?
                <>
                    {success ?
                        <>
                            {courses &&
                                <CoursesTemplate
                                    courses={courses}
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

Courses.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(clearBreadCrumbs())
})

export default Courses