import { CourseType } from "components/templates/courses/types"
import { ProgramType } from "components/templates/educationalPrograms/types"
import EducationalProgramCoursesTemplate from "components/templates/educationalPrograms/courses"
import LoadingErrorTemplate from "components/templates/loadingError"
import { ENDPOINT_COURSES, ENDPOINT_PROGRAMS } from "constants/endpoints"
import React, { useEffect, useState } from "react"
import axiosApi from "utils/axios"
import axios from "axios"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import { useRouter } from "next/router"
import UnauthorizedTemplate from "components/templates/unauthorized"

const EducationalProgramCourses = () => {

    const [program, setProgram] = useState<ProgramType>()
    const [courses, setCourses] = useState<CourseType[]>([])
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const user = useSelector(userSelector)
    const router = useRouter()

    useEffect(() => {
        if (user.authorized) {
            axios.all([
                axiosApi.get(`${ENDPOINT_PROGRAMS}/${router.query.id}`),
                axiosApi.get(ENDPOINT_COURSES)
            ]).then(axios.spread(({ data: program }, { data: courses }) => {
                setSuccess(true)
                setProgram(program)
                setCourses(courses)
            })).catch(err => {
                setSuccess(false)
                setError(err.code)
            })
        }
    }, [user, router.query])

    return (
        <>
            {user.authorized ?
                <>
                    {success && program && courses ?
                        <EducationalProgramCoursesTemplate
                            {...{
                                program,
                                courses
                            }}
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

export default EducationalProgramCourses