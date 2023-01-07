import axios from "axios"
import EducationalProgramStudentsTemplate from "components/templates/educationalPrograms/students"
import { ProgramType } from "components/templates/educationalPrograms/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import { UserProfileType } from "components/templates/users/types"
import { ENDPOINT_EDUCATIONAL_PROGRAMS, ENDPOINT_USERS } from "constants/endpoints"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import axiosApi from "utils/axios"

const EducationalProgramStudents = () => {

    const router = useRouter()
    const user = useSelector(userSelector)
    const [users, setUsers] = useState<UserProfileType[]>([])
    const [program, setProgram] = useState<ProgramType>()
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        const { id } = router.query
        if (user.authorized) {
            axios.all([
                axiosApi.get(ENDPOINT_USERS),
                axiosApi.get(`${ENDPOINT_EDUCATIONAL_PROGRAMS}/${id}`)
            ]).then(axios.spread(({ data: users }, { data: program },) => {
                setSuccess(true)
                setUsers(users)
                setProgram(program)
            })).catch(err => {
                setSuccess(false)
                setError(err.code)
            })
        }
    }, [user.authorized])

    return (
        <>
            {success && program ?
                <EducationalProgramStudentsTemplate
                    {...{
                        program,
                        users
                    }}
                /> :
                <LoadingErrorTemplate
                    error={error}
                />
            }
        </>
    )
}

export default EducationalProgramStudents