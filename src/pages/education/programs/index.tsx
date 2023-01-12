import EducationTemplate from "components/templates/education"
import LoadingErrorTemplate from "components/templates/loadingError"
import { ENDPOINT_EDUCATION } from "constants/endpoints"
import React, { useEffect, useState } from "react"
import axiosApi from "utils/axios"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import { UserProgramType } from "components/templates/educationalPrograms/types"
import UnauthorizedTemplate from "components/templates/unauthorized"

const Education = ({ }) => {

    const user = useSelector(userSelector)
    const [userPrograms, setUserPrograms] = useState<UserProgramType[]>([])
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (user.authorized) {
            axiosApi.get(`${ENDPOINT_EDUCATION}/Programs`)
                .then(res => {
                    setSuccess(true)
                    setUserPrograms(res.data)
                })
                .catch(err => {
                    setSuccess(false)
                    setError(err.code)
                })
        }
    }, [user.authorized])

    return (
        <>
            {user.authorized ?
                <>
                    {success ?
                        <EducationTemplate
                            userPrograms={userPrograms}
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

export default Education