import { ENDPOINT_COURSES, ENDPOINT_EDUCATIONAL_PROGRAMS } from "constants/endpoints"
import { GetServerSideProps } from "next"
import React from "react"
import axiosApi from "utils/axios"

type EducationalProgramStudentsPageProps = {
    success: boolean,
    error: string,
}

const EducationalProgramStudents = ({
    success,
    error
}: EducationalProgramStudentsPageProps) => {

    return (
        <div>
            {error}
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<EducationalProgramStudentsPageProps> = async ({ params }) => {

    const pageProps: EducationalProgramStudentsPageProps = {
        success: true,
        error: ""
    }

    await axiosApi.get(ENDPOINT_COURSES)
        .then(res => {

        })
        .catch(err => {

        })

    return {
        props: pageProps
    }
}

export default EducationalProgramStudents