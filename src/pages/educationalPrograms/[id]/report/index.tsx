import { CountStudentsModelType, ProgramType } from "components/templates/educationalPrograms/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import { ENDPOINT_EDUCATIONAL_PROGRAMS, ENDPOINT_USERS } from "constants/endpoints"
import React, { useEffect, useState } from "react"
import axiosApi from "utils/axios"
import axios from "axios"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import { useRouter } from "next/router"
import UnauthorizedTemplate from "components/templates/unauthorized"
import EducationalProgramReportTemplate from "components/templates/educationalPrograms/report"
import { UserProfileType } from "components/templates/users/types"

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
            axios.all([
                axiosApi.get(`${ENDPOINT_EDUCATIONAL_PROGRAMS}/${router.query.id}/Report`),
                axiosApi.get(`${ENDPOINT_EDUCATIONAL_PROGRAMS}/${router.query.id}`),
                axiosApi.get(`${ENDPOINT_EDUCATIONAL_PROGRAMS}/${router.query.id}/Users`)
            ])
                .then(axios.spread(({ data: programReport }, { data: program }, { data: programUsers }) => {
                    setSuccess(true)
                    setProgramReport(programReport)
                    setProgram(program)
                    setProgramUsers(programUsers)
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

export default EducationalProgramReport