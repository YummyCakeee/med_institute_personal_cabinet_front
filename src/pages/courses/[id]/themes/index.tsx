import CourseTemplate from "components/templates/courses/course"
import React, { useEffect, useState } from "react"
import { CourseType } from "components/templates/courses/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import axiosApi from "utils/axios"
import { ENDPOINT_COURSES } from "constants/endpoints"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import UnauthorizedTemplate from "components/templates/unauthorized"

const Course = () => {


    const router = useRouter()
    const user = useSelector(userSelector)
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [course, setCourse] = useState<CourseType>()

    useEffect(() => {
        if (user.authorized) {
            const { id } = router.query
            axiosApi.get(`${ENDPOINT_COURSES}/${id}`)
                .then(res => {
                    setSuccess(true)
                    setCourse(res.data)
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
                            {course &&
                                <CourseTemplate
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

export default Course