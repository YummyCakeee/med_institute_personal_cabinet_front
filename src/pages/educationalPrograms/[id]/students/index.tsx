import axios from "axios"
import EducationalProgramStudentsTemplate from "components/templates/educationalPrograms/students"
import { ProgramType } from "components/templates/educationalPrograms/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import { UserProfileType } from "components/templates/users/types"
import { ENDPOINT_COURSES, ENDPOINT_EDUCATIONAL_PROGRAMS, ENDPOINT_USERS } from "constants/endpoints"
import { GetServerSideProps } from "next"
import React from "react"
import axiosApi from "utils/axios"

type EducationalProgramStudentsPageProps = {
    success: boolean,
    error: string,
    program: ProgramType | null,
    users: UserProfileType[]
}

const EducationalProgramStudents = ({
    success,
    error,
    program,
    users
}: EducationalProgramStudentsPageProps) => {

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

export const getServerSideProps: GetServerSideProps<EducationalProgramStudentsPageProps> = async ({ params }) => {

    const pageProps: EducationalProgramStudentsPageProps = {
        success: true,
        error: "",
        program: null,
        users: []
    }

    await axios.all([
        axiosApi.get(ENDPOINT_USERS),
        axiosApi.get(`${ENDPOINT_EDUCATIONAL_PROGRAMS}/${params?.id}`)
    ]).then(axios.spread(({ data: users }, { data: program },) => {
        pageProps.users = users
        pageProps.program = program
    })).catch(err => {
        pageProps.success = false
        pageProps.error = err.code
    })

    return {
        props: pageProps
    }
}

export default EducationalProgramStudents