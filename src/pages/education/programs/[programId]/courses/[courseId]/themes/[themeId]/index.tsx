import axios from "axios"
import { ThemeType } from "components/templates/courses/types"
import ThemeTemplate from "components/templates/education/program/course/theme"
import { SolvedTestType, UserThemeType } from "components/templates/education/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import { TestBlockType } from "components/templates/testing/types"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { ENDPOINT_EDUCATION, ENDPOINT_THEMES } from "constants/endpoints"
import { ROUTE_EDUCATION } from "constants/routes"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { wrapper } from "store"
import { setBreadCrumbs } from "store/breadCrumbsSlice"
import { userSelector } from "store/userSlice"
import axiosApi from "utils/axios"

export type TestBlockInfoType = {
    isFileTestBlock: boolean
}

const Theme = () => {

    const router = useRouter()
    const user = useSelector(userSelector)
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [userTheme, setUserTheme] = useState<UserThemeType>()
    const [solvedTests, setSolvedTests] = useState<SolvedTestType[]>()
    const [activeTest, setActiveTest] = useState<SolvedTestType>()
    const [testBlock, setTestBlock] = useState<TestBlockType>()

    useEffect(() => {
        const fetchData = async () => {
            if (user.authorized && router.isReady) {
                const { programId, courseId, themeId } = router.query
                const requestUrl = `${ENDPOINT_EDUCATION}/Programs/${programId}/Courses/${courseId}/Themes/${themeId}`
                let userTheme: UserThemeType | undefined
                await axiosApi.get(requestUrl, { params: { userId: user.id } })
                    .then(res => {
                        userTheme = (res.data as UserThemeType)
                        setSuccess(true)
                        setUserTheme(userTheme)
                    })
                    .catch(err => {
                        setSuccess(false)
                        setError(err.code)
                        return
                    })
                if (userTheme?.theme.testBlockId !== undefined) {
                    await axios.all([
                        axiosApi.get(`${requestUrl}/TestBlock`),
                        axiosApi.get(`${requestUrl}/TestBlock/Active`),
                        axiosApi.get(`${ENDPOINT_THEMES}/${themeId}`)
                    ])
                        .then(axios.spread((
                            { data: solvedTests },
                            { status: activeTestStatus, data: activeTest },
                            { data: theme }
                        ) => {
                            setSuccess(true)
                            setSolvedTests(solvedTests)
                            if (activeTestStatus === 200) {
                                setActiveTest(activeTest)
                            }
                            setTestBlock((theme as ThemeType).testBlock)
                        }))
                        .catch(err => {
                            setSuccess(false)
                            setError(err.code)
                        })
                }
            }
        }

        fetchData()

    }, [user, router.query, router.isReady])

    return (
        <>
            {user.authorized ?
                <>
                    {success ?
                        <>
                            {userTheme &&
                                <ThemeTemplate
                                    {...{
                                        userTheme,
                                        solvedTests,
                                        activeTest,
                                        testBlock
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

Theme.getInitialProps = wrapper.getInitialPageProps(store => ({ query }) => {
    const { programId, courseId } = query
    store.dispatch(setBreadCrumbs([
        {
            title: "Программы обучения",
            route: ROUTE_EDUCATION
        },
        {
            title: "Курсы программы",
            route: `${ROUTE_EDUCATION}/${programId}/courses`
        },
        {
            title: "Темы курса",
            route: `${ROUTE_EDUCATION}/${programId}/courses/${courseId}/themes`
        }
    ]))
})

export default Theme