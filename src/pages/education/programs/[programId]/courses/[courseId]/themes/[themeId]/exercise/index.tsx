import ExerciseTemplate from "components/templates/education/program/course/theme/exercise"
import { SolvedTestType } from "components/templates/education/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { ENDPOINT_EDUCATION } from "constants/endpoints"
import { ROUTE_EDUCATION } from "constants/routes"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { wrapper } from "store"
import { setBreadCrumbs } from "store/breadCrumbsSlice"
import { userSelector } from "store/userSlice"
import axiosApi from "utils/axios"
import { getServerErrorResponse } from "utils/serverData"

const Exercise = () => {

    const user = useSelector(userSelector)
    const router = useRouter()
    const [test, setTest] = useState<SolvedTestType>()
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")


    useEffect(() => {
        if (user.authorized && router.isReady) {
            const { programId, courseId, themeId } = router.query
            const requestUrl = `${ENDPOINT_EDUCATION}/Programs/${programId}/Courses/${courseId}/Themes/${themeId}/TestBlock/Active`
            axiosApi.get(requestUrl)
                .then(res => {
                    setSuccess(true)
                    setTest(res.data)
                })
                .catch(err => {
                    setSuccess(false)
                    setError(getServerErrorResponse(err))
                })
        }
    }, [user.authorized, router])


    return (
        <>
            {user.authorized ?
                <>
                    {success && test ?
                        <ExerciseTemplate
                            test={test}
                        /> :
                        <LoadingErrorTemplate
                            error={error}
                        />
                    }
                </> :
                <UnauthorizedTemplate />
            }
        </>
    )
}

Exercise.getInitialProps = wrapper.getInitialPageProps(store => ({ query }) => {
    const { programId, courseId, themeId } = query
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
        },
        {
            title: "Тема курса",
            route: `${ROUTE_EDUCATION}/${programId}/courses/${courseId}/themes/${themeId}`
        }
    ]))
})

export default Exercise