import { CourseType } from "components/templates/courses/types"
import { ProgramType } from "components/templates/educationalPrograms/types"
import EducationalProgramCoursesTemplate from "components/templates/educationalPrograms/courses"
import LoadingErrorTemplate from "components/templates/loadingError"
import { ENDPOINT_COURSES, ENDPOINT_EDUCATIONAL_PROGRAMS } from "constants/endpoints"
import { GetServerSideProps } from "next"
import React from "react"
import axiosApi from "utils/axios"

type EducationalProgramCoursesPageProps = {
    success: boolean,
    error: string,
    program: ProgramType | null,
    courses: CourseType[]
}

const EducationalProgramCourses = ({
    success,
    error,
    program,
    courses
}: EducationalProgramCoursesPageProps) => {

    return (
        <>
            {success && program ?
                <EducationalProgramCoursesTemplate
                    {...{
                        program,
                        courses
                    }}
                /> :
                <LoadingErrorTemplate
                    error={error}
                />
            }
        </>
    )
}

export const getServerSideProps: GetServerSideProps<EducationalProgramCoursesPageProps> = async ({ params }) => {

    const pageProps: EducationalProgramCoursesPageProps = {
        success: true,
        error: "",
        program: null,
        courses: []
    }

    await axiosApi.get(`${ENDPOINT_EDUCATIONAL_PROGRAMS}/${params?.id}`)
        .then(res => {
            pageProps.program = res.data
        })
        .catch(err => {
            pageProps.error = err.code
            pageProps.success = false
        })

    await axiosApi.get(ENDPOINT_COURSES)
        .then(res => {
            pageProps.courses = res.data
        })
        .catch(err => {
            pageProps.error = err.code
            pageProps.success = false
        })

    return {
        props: pageProps
    }
}

export default EducationalProgramCourses