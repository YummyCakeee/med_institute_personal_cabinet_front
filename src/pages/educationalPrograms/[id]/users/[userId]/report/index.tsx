import { ProgramType, ReportModelType } from "components/templates/educationalPrograms/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import { ENDPOINT_PROGRAMS, ENDPOINT_USERS } from "constants/endpoints"
import React, { useEffect, useState } from "react"
import axiosApi from "utils/axios"
import axios from "axios"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import { useRouter } from "next/router"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { UserProfileType, UserWithCertificatesType } from "components/templates/users/types"
import EducationalProgramUserReportTemplate from "components/templates/educationalPrograms/userReport"
import { wrapper } from "store"
import { setBreadCrumbs } from "store/breadCrumbsSlice"
import { ROUTE_EDUCATIONAL_PROGRAMS } from "constants/routes"

const EducationalProgramUserReport = () => {

    const [programUserReport, setProgramUserReport] = useState<ReportModelType[]>()
    const [programUser, setProgramUser] = useState<UserWithCertificatesType>()
    const [program, setProgram] = useState<ProgramType>()
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const user = useSelector(userSelector)
    const router = useRouter()

    useEffect(() => {
        if (user.authorized && router.isReady) {
            const { id: programId, userId } = router.query
            axios.all([
                axiosApi.get(`${ENDPOINT_PROGRAMS}/${programId}/Users/${userId}/Report`),
                axiosApi.get(`${ENDPOINT_USERS}/${userId}`),
                axiosApi.get(`${ENDPOINT_PROGRAMS}/${programId}`)
            ])
                .then(axios.spread(({ data: programUserReport }, { data: programUser }, { data: program }) => {
                    setSuccess(true)
                    setProgramUserReport(programUserReport)
                    setProgram(program)
                    setProgramUser(programUser)
                })).catch(err => {
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
                            {programUserReport && program && programUser &&
                                <EducationalProgramUserReportTemplate
                                    {...{
                                        program,
                                        programUserReport,
                                        programUser
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

EducationalProgramUserReport.getInitialProps = wrapper.getInitialPageProps(store => ({ query }) => {
    store.dispatch(setBreadCrumbs([
        {
            title: "Программы обучения",
            route: ROUTE_EDUCATIONAL_PROGRAMS
        },
        {
            title: "Отчёт по программе",
            route: `${ROUTE_EDUCATIONAL_PROGRAMS}/${query.id}/report`
        }
    ]))
})

export default EducationalProgramUserReport