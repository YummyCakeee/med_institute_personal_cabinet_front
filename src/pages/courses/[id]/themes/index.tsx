import React, { useEffect, useState } from "react"
import { CourseType } from "components/templates/courses/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import axiosApi from "utils/axios"
import { ENDPOINT_COURSES } from "constants/endpoints"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import UnauthorizedTemplate from "components/templates/unauthorized"
import CourseThemesTemplate from "components/templates/courses/courseThemes"
import { wrapper } from "store"
import { setBreadCrumbs } from "store/breadCrumbsSlice"
import { ROUTE_COURSES, ROUTE_PROFILE } from "constants/routes"
import { getServerErrorResponse } from "utils/serverData"
import { UserRoleType } from "components/templates/users/types"

const CourseThemes = () => {


    const router = useRouter()
    const user = useSelector(userSelector)
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [course, setCourse] = useState<CourseType>()

    useEffect(() => {
        if (user.authorized) {
            if (!user.roles?.includes(UserRoleType.ADMINISTRATOR) && !user.roles?.includes(UserRoleType.TEACHER)) {
                router.replace(ROUTE_PROFILE)
                return
            }
            const { id } = router.query
            axiosApi.get(`${ENDPOINT_COURSES}/${id}`)
                .then(res => {
                    setSuccess(true)
                    setCourse(res.data)
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
                            {course &&
                                <CourseThemesTemplate
                                    course={course}
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

CourseThemes.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(setBreadCrumbs([
        {
            title: "Курсы",
            route: ROUTE_COURSES
        }
    ]))
})

export default CourseThemes