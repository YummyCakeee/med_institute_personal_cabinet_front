import ProgramTemplate from "components/templates/education/program"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { userSelector } from "store/userSlice"
import { useSelector } from "react-redux"
import { ProgramType, ReportModelType } from "components/templates/educationalPrograms/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import UnauthorizedTemplate from "components/templates/unauthorized"
import axiosApi from "utils/axios"
import { ENDPOINT_EDUCATION, ENDPOINT_PROGRAMS } from "constants/endpoints"
import { CourseInfoType } from "components/templates/courses/types"
import axios from "axios"

const Program = () => {

    const router = useRouter()
    const user = useSelector(userSelector)
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [program, setProgram] = useState<ProgramType>()
    const [programReport, setProgramReport] = useState<ReportModelType[]>()
    const [coursesInfo, setCoursesInfo] = useState<CourseInfoType[]>([])

    useEffect(() => {
        if (user.authorized && router.isReady) {
            const { programId } = router.query
            axios.all([
                axiosApi.get(`${ENDPOINT_EDUCATION}/Programs/${programId}`),
                axiosApi.get(`${ENDPOINT_EDUCATION}/Programs/${programId}/Courses`),
                axiosApi.get(`${ENDPOINT_EDUCATION}/Programs/${programId}/Report`)
            ])
                .then(axios.spread(({ data: program }, { data: courses }, { data: programReport }) => {
                    setSuccess(true)
                    setProgram(program)
                    setCoursesInfo(courses)
                    setProgramReport(programReport)
                }))
                .catch(err => {
                    setSuccess(false)
                    setError(err.code)
                })
        }

    }, [router, user.authorized])


    return (
        <>
            {user.authorized ?
                <>
                    {success ?
                        <>
                            {program && coursesInfo && programReport &&
                                <ProgramTemplate
                                    {...{
                                        program,
                                        coursesInfo,
                                        programReport
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

export default Program