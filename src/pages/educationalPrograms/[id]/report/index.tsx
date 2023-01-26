import { CountStudentsModelType, ProgramType } from "components/templates/educationalPrograms/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import { ENDPOINT_PROGRAMS, ENDPOINT_USERS } from "constants/endpoints"
import React, { useEffect, useState } from "react"
import axiosApi from "utils/axios"
import axios from "axios"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import { useRouter } from "next/router"
import UnauthorizedTemplate from "components/templates/unauthorized"
import EducationalProgramReportTemplate from "components/templates/educationalPrograms/report"
import { UserProfileType, UserRoleType } from "components/templates/users/types"
import { ROUTE_EDUCATIONAL_PROGRAMS, ROUTE_PROFILE } from "constants/routes"
import { wrapper } from "store"
import { setBreadCrumbs } from "store/breadCrumbsSlice"
import { getServerErrorResponse } from "utils/serverData"

const EducationalProgramReport = () => {

    const [programReport, setProgramReport] = useState<CountStudentsModelType>()
    const [programUsers, setProgramUsers] = useState<UserProfileType[]>()
    const [program, setProgram] = useState<ProgramType>()
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const user = useSelector(userSelector)
    const router = useRouter()

    useEffect(() => {
        if (user.authorized && router.isReady) {
            if (!user.roles?.includes(UserRoleType.ADMINISTRATOR) && !user.roles?.includes(UserRoleType.TEACHER)) {
                router.replace(ROUTE_PROFILE)
                return
            }
            axios.all([
                axiosApi.get(`${ENDPOINT_PROGRAMS}/${router.query.id}/Report`),
                axiosApi.get(`${ENDPOINT_PROGRAMS}/${router.query.id}`),
                axiosApi.get(`${ENDPOINT_PROGRAMS}/${router.query.id}/Users`)
            ])
                .then(axios.spread(({ data: programReport }, { data: program }, { data: programUsers }) => {
                    setSuccess(true)
                    setProgramReport(programReport)
                    setProgram(program)
                    setProgramUsers(programUsers)
                })).catch(err => {
                    setSuccess(false)
                    setError(getServerErrorResponse(err))
                })
        }
    }, [user, router])

    return (
        <>
            {user.authorized ?
                <>
                    {success ?
                        <>
                            {programReport && program && programUsers &&
                                <EducationalProgramReportTemplate
                                    {...{
                                        program,
                                        programReport,
                                        programUsers
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

EducationalProgramReport.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(setBreadCrumbs([
        {
            title: "Программы обучения",
            route: ROUTE_EDUCATIONAL_PROGRAMS
        }
    ]))
})

export default EducationalProgramReport