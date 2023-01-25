import LoadingErrorTemplate from "components/templates/loadingError"
import { ENDPOINT_COURSES } from "constants/endpoints"
import React, { useEffect, useState } from "react"
import axiosApi from "utils/axios"
import axios from "axios"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import { useRouter } from "next/router"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { UserProfileType } from "components/templates/users/types"
import { CourseType } from "components/templates/courses/types"
import CourseReportTemplate from "components/templates/courses/courseReport"
import { ROUTE_COURSES } from "constants/routes"
import { wrapper } from "store"
import { setBreadCrumbs } from "store/breadCrumbsSlice"

const CourseReport = () => {

    const [courseUsers, setCourseUsers] = useState<UserProfileType[]>()
    const [course, setCourse] = useState<CourseType>()
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const user = useSelector(userSelector)
    const router = useRouter()

    useEffect(() => {
        if (user.authorized && router.isReady) {
            axios.all([
                axiosApi.get(`${ENDPOINT_COURSES}/${router.query.id}`),
                axiosApi.get(`${ENDPOINT_COURSES}/${router.query.id}/Users`)
            ])
                .then(axios.spread(({ data: course }, { data: courseUsers }) => {
                    setSuccess(true)
                    setCourse(course)
                    setCourseUsers(courseUsers)
                })).catch(err => {
                    setSuccess(false)
                    setError(err.code)
                })
        }
    }, [user, router])

    return (
        <>
            {user.authorized ?
                <>
                    {success ?
                        <>
                            {course && courseUsers &&
                                <CourseReportTemplate
                                    {...{
                                        course,
                                        courseUsers,
                                    }}
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

CourseReport.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(setBreadCrumbs([
        {
            title: "Курсы",
            route: ROUTE_COURSES
        }
    ]))
})

export default CourseReport