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
import { ENDPOINT_EDUCATION, ENDPOINT_THEMES } from "constants/endpoints"

const TestAttempt = () => {

    const router = useRouter()
    const user = useSelector(userSelector)
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [theme, setTheme] = useState<ThemeType>()
    const [themeStudents, setThemeStudents] = useState<UserProfileType[]>()

    useEffect(() => {
        if (user.authorized && router.isReady) {
            const { themeId } = router.query
            axios.all([
                axiosApi.get(`${ENDPOINT_THEMES}/${themeId}`),
                axiosApi.get(`${ENDPOINT_EDUCATION}/Themes/${themeId}/Students`)
            ])
                .then(axios.spread(({ data: theme }, { data: students }) => {
                    setSuccess(true)
                    setTheme(theme)
                    setThemeStudents(students)
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
                            {theme && themeStudents &&
                                <ThemeTemplate
                                    {...{
                                        theme,
                                        themeStudents
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

export default TestAttempt