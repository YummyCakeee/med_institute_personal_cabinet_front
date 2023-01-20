import axios from "axios"
import { ThemeType } from "components/templates/courses/types"
import ThemeTemplate from "components/templates/educationTeacher/program/course/theme"
import { SolvedTestType } from "components/templates/education/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import axiosApi from "utils/axios"
import { UserProfileType } from "components/templates/users/types"
import { ENDPOINT_EDUCATION, ENDPOINT_USERS } from "constants/endpoints"

const TestAttempt = () => {

    const router = useRouter()
    const user = useSelector(userSelector)
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [student, setStudent] = useState<UserProfileType>()
    const [attempt, setAttempt] = useState<SolvedTestType>()

    useEffect(() => {
        if (user.authorized && router.isReady) {
            const { themeId, studentId } = router.query
            axios.all([
                axiosApi.get(`${ENDPOINT_USERS}/${studentId}`),
                axiosApi.get(`${ENDPOINT_EDUCATION}/Themes/${themeId}/Students/${studentId}/Attemp/`)
            ])
                .then(axios.spread(({ data: student }, { data: attempt }) => {
                    setSuccess(true)
                    setStudent(student)
                    setAttempt(attempt)
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
                            {/* {student && attempt &&
                                <ThemeTemplate
                                    {...{
                                        theme,
                                        themeStudents
                                    }}
                                />
                            } */}
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

export default TestAttempt