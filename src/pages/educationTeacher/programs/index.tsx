import LoadingErrorTemplate from "components/templates/loadingError"
import { ENDPOINT_PROGRAMS } from "constants/endpoints"
import React, { useEffect, useState } from "react"
import axiosApi from "utils/axios"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import { ProgramType } from "components/templates/educationalPrograms/types"
import UnauthorizedTemplate from "components/templates/unauthorized"
import EducationTeacherTemplate from "components/templates/educationTeacher"
import { wrapper } from "store"
import { clearBreadCrumbs } from "store/breadCrumbsSlice"

const EducationTeacher = ({ }) => {

    const user = useSelector(userSelector)
    const [programs, setPrograms] = useState<ProgramType[]>([])
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (user.authorized) {
            axiosApi.get(`${ENDPOINT_PROGRAMS}`)
                .then(res => {
                    setSuccess(true)
                    setPrograms(res.data)
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
                        <EducationTeacherTemplate
                            programs={programs}
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

EducationTeacher.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(clearBreadCrumbs())
})

export default EducationTeacher