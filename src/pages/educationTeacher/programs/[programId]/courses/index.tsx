import ProgramTemplate from "components/templates/educationTeacher/program"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { userSelector } from "store/userSlice"
import { useSelector } from "react-redux"
import { ProgramType } from "components/templates/educationalPrograms/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import UnauthorizedTemplate from "components/templates/unauthorized"
import axiosApi from "utils/axios"
import { ENDPOINT_COURSES, ENDPOINT_PROGRAMS } from "constants/endpoints"
import { CourseType } from "components/templates/courses/types"
import axios from "axios"
import { ROUTE_EDUCATION_TEACHER, ROUTE_PROFILE } from "constants/routes"
import { wrapper } from "store"
import { setBreadCrumbs } from "store/breadCrumbsSlice"
import { getServerErrorResponse } from "utils/serverData"
import { UserRoleType } from "components/templates/users/types"

const Program = () => {

    const router = useRouter()
    const user = useSelector(userSelector)
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [program, setProgram] = useState<ProgramType>()
    const [courses, setCourses] = useState<CourseType[]>([])

    useEffect(() => {
        if (user.authorized) {
            if (!user.roles?.includes(UserRoleType.ADMINISTRATOR) && !user.roles?.includes(UserRoleType.TEACHER)) {
                router.replace(ROUTE_PROFILE)
                return
            }
            const { programId } = router.query
            axios.all([
                axiosApi.get(`${ENDPOINT_PROGRAMS}/${programId}`),
                axiosApi.get(`${ENDPOINT_COURSES}`)
            ])
                .then(axios.spread(({ data: program }, { data: courses }) => {
                    setSuccess(true)
                    setProgram(program)
                    setCourses(courses)
                }))
                .catch(err => {
                    setSuccess(false)
                    setError(getServerErrorResponse(err))
                })
        }

    }, [router, user])


    return (
        <>
            {user.authorized ?
                <>
                    {success ?
                        <>
                            {program && courses &&
                                <ProgramTemplate
                                    program={program}
                                    courses={courses}
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

Program.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(setBreadCrumbs([
        {
            title: "Программы обучения",
            route: ROUTE_EDUCATION_TEACHER
        }
    ]))
})

export default Program