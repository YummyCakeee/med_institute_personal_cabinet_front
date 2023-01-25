import axios from "axios"
import { CourseType, ThemeType } from "components/templates/courses/types"
import CourseTemplate from "components/templates/educationTeacher/program/course"
import LoadingErrorTemplate from "components/templates/loadingError"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { ENDPOINT_COURSES } from "constants/endpoints"
import { ROUTE_EDUCATION_TEACHER } from "constants/routes"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { wrapper } from "store"
import { setBreadCrumbs } from "store/breadCrumbsSlice"
import { userSelector } from "store/userSlice"
import axiosApi from "utils/axios"

const Course = () => {

    const router = useRouter()
    const user = useSelector(userSelector)
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [course, setCourse] = useState<CourseType>()
    const [themes, setThemes] = useState<ThemeType[]>()

    useEffect(() => {
        if (user.authorized && router.isReady) {
            const { programId, courseId } = router.query
            axios.all([
                axiosApi.get(`${ENDPOINT_COURSES}/${courseId}`),
                axiosApi.get(`${ENDPOINT_COURSES}/${courseId}/Themes`)
            ])
                .then(axios.spread(({ data: course }, { data: themes }) => {
                    setSuccess(true)
                    setCourse(course)
                    setThemes(themes)
                }))
                .catch(err => {
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
                            {course && themes &&
                                <CourseTemplate
                                    course={course}
                                    themes={themes}
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

Course.getInitialProps = wrapper.getInitialPageProps(store => ({ query }) => {
    const { programId } = query
    store.dispatch(setBreadCrumbs([
        {
            title: "Программы обучения",
            route: ROUTE_EDUCATION_TEACHER
        },
        {
            title: "Курсы программы",
            route: `${ROUTE_EDUCATION_TEACHER}/${programId}/courses`
        }
    ]))
})

export default Course