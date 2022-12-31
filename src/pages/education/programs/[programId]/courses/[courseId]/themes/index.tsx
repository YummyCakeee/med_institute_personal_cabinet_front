import axios from "axios"
import { CourseType, ThemeType } from "components/templates/courses/types"
import CourseTemplate from "components/templates/education/program/course"
import LoadingErrorTemplate from "components/templates/loadingError"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { ENDPOINT_PROGRAMS, ENDPOINT_EDUCATION, ENDPOINT_COURSES } from "constants/endpoints"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
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
        if (user.authorized) {
            const { programId, courseId } = router.query
            axios.all([
                axiosApi.get(`${ENDPOINT_EDUCATION}/Programs/${programId}/Courses/${courseId}/Themes`),
                axiosApi.get(`${ENDPOINT_COURSES}/${courseId}`)
            ])
                .then(axios.spread(({ data: themes }, { data: course }) => {
                    setSuccess(true)
                    setThemes(themes)
                    setCourse(course)
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
                            {themes && course &&
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

export default Course