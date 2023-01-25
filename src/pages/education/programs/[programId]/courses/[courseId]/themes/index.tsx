import axios from "axios"
import { CourseType, ThemeType } from "components/templates/courses/types"
import CourseTemplate from "components/templates/education/program/course"
import { ThemeInfoType } from "components/templates/education/types"
import { ReportModelType } from "components/templates/educationalPrograms/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { ENDPOINT_PROGRAMS, ENDPOINT_EDUCATION, ENDPOINT_COURSES } from "constants/endpoints"
import { ROUTE_EDUCATION, ROUTE_EDUCATIONAL_PROGRAMS } from "constants/routes"
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
    const [courseReport, setCourseReport] = useState<ReportModelType[]>()
    const [themeInfos, setThemeInfos] = useState<ThemeInfoType[]>()

    useEffect(() => {
        if (user.authorized) {
            const { programId, courseId } = router.query
            axios.all([
                axiosApi.get(`${ENDPOINT_EDUCATION}/Programs/${programId}/Courses/${courseId}/Themes`),
                axiosApi.get(`${ENDPOINT_EDUCATION}/Programs/${programId}/Courses/${courseId}`),
                axiosApi.get(`${ENDPOINT_EDUCATION}/Programs/${programId}/Courses/${courseId}/Report`)
            ])
                .then(axios.spread(({ data: themeInfos }, { data: course }, { data: courseReport }) => {
                    setSuccess(true)
                    setThemeInfos(themeInfos)
                    setCourse(course)
                    setCourseReport(courseReport)
                }))
                .catch(err => {
                    setSuccess(false)
                    setError(err.code)
                })
        }

    }, [user, router.query])

    return (
        <>
            {user.authorized ?
                <>
                    {success ?
                        <>
                            {themeInfos && course && courseReport &&
                                <CourseTemplate
                                    {...{
                                        course,
                                        themeInfos,
                                        courseReport
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

Course.getInitialProps = wrapper.getInitialPageProps(store => ({ query }) => {
    const { programId } = query
    store.dispatch(setBreadCrumbs([
        {
            title: "Программы обучения",
            route: ROUTE_EDUCATION
        },
        {
            title: "Курсы программы",
            route: `${ROUTE_EDUCATION}/${programId}/courses`
        }
    ]))
})

export default Course