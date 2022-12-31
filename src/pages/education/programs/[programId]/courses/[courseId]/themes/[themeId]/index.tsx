import ThemeTemplate from "components/templates/education/program/course/theme"
import { AllResultForUser, UserThemeType } from "components/templates/education/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { ENDPOINT_EDUCATION } from "constants/endpoints"
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
    const [userTheme, setUserTheme] = useState<UserThemeType>()
    const [testResults, setTestResults] = useState<AllResultForUser>()

    useEffect(() => {
        const fetchData = async () => {
            if (user.authorized) {
                const { programId, courseId, themeId } = router.query
                const requestUrl = `${ENDPOINT_EDUCATION}/Programs/${programId}/Courses/${courseId}/Themes/${themeId}`
                let theme: UserThemeType | undefined
                await axiosApi.get(requestUrl, { params: { userId: user.id } })
                    .then(res => {
                        theme = (res.data as UserThemeType)
                        setUserTheme(theme)
                        setSuccess(true)
                    })
                    .catch(err => {
                        setSuccess(false)
                        setError(err.code)
                        return
                    })
                if (theme?.theme.testBlockId !== undefined) {
                    await axiosApi.get(`${requestUrl}/TestBlock`, { params: { userThemeId: theme.userThemeId } })
                        .then(res => {
                            setSuccess(true)
                            setTestResults(res.data)
                        })
                        .catch(err => {
                            setSuccess(false)
                            setError(err.code)
                        })
                }
            }
        }

        fetchData()

    }, [user, router.query])

    return (
        <>
            {user.authorized ?
                <>
                    {success && userTheme ?
                        <ThemeTemplate
                            userTheme={userTheme}
                            testResults={testResults}
                        />
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