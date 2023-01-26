import axios from "axios"
import EducationalProgramStudentsTemplate from "components/templates/educationalPrograms/students"
import { ProgramType } from "components/templates/educationalPrograms/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import { UserProfileType, UserRoleType } from "components/templates/users/types"
import { ENDPOINT_PROGRAMS, ENDPOINT_USERS } from "constants/endpoints"
import { ROUTE_EDUCATIONAL_PROGRAMS, ROUTE_PROFILE } from "constants/routes"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { wrapper } from "store"
import { setBreadCrumbs } from "store/breadCrumbsSlice"
import { userSelector } from "store/userSlice"
import axiosApi from "utils/axios"
import { getServerErrorResponse } from "utils/serverData"

const EducationalProgramStudents = () => {

    const router = useRouter()
    const user = useSelector(userSelector)
    const [programUsers, setProgramUsers] = useState<UserProfileType[]>()
    const [program, setProgram] = useState<ProgramType>()
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        const { id } = router.query
        if (user.authorized) {
            if (!user.roles?.includes(UserRoleType.ADMINISTRATOR) && !user.roles?.includes(UserRoleType.TEACHER)) {
                router.replace(ROUTE_PROFILE)
                return
            }
            axios.all([
                axiosApi.get(`${ENDPOINT_PROGRAMS}/${id}`),
                axiosApi.get(`${ENDPOINT_PROGRAMS}/${id}/Users`),
            ]).then(axios.spread(({ data: program }, { data: programUsers }) => {
                setSuccess(true)
                setProgram(program)
                setProgramUsers(programUsers)
            })).catch(err => {
                setSuccess(false)
                setError(getServerErrorResponse(err))
            })
        }
    }, [user.authorized, router.query])

    return (
        <>
            {success ?
                <>
                    {program && programUsers &&
                        <EducationalProgramStudentsTemplate
                            {...{
                                program,
                                programUsers
                            }}
                        />
                    }
                </> :
                <LoadingErrorTemplate
                    error={error}
                />
            }
        </>
    )
}

EducationalProgramStudents.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(setBreadCrumbs([
        {
            title: "Программы обучения",
            route: ROUTE_EDUCATIONAL_PROGRAMS
        }
    ]))
})

export default EducationalProgramStudents