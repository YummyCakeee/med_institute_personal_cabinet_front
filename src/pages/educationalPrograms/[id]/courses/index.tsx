import { CourseType } from "components/templates/courses/useCourses"
import { EducationalProgramType } from "components/templates/educationalPrograms"
import EducationalProgramCoursesTemplate from "components/templates/educationalPrograms/courses"
import LoadingErrorTemplate from "components/templates/loadingError"
import { ENDPOINT_COURSES, ENDPOINT_EDUCATIONAL_PROGRAMS } from "constants/endpoints"
import { GetServerSideProps } from "next"
import React from "react"
import axiosApi from "utils/axios"

type EducationalProgramCoursesPageProps = {
    success: boolean,
    error: string,
    program: EducationalProgramType | null,
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
            //pageProps.success = false
        })


    pageProps.program = {
        programId: "4",
        title: "Повышение квалификации «Сестринское дело в терапии\"",
        description: "Совершенствование компетенций специалиста, необходимых для профессиональной деятельности и повышение профессионального уровня в рамках имеющейся квалификации",
        programCriteria: null,
        createDate: "2022-11-20T15:07:41.407757",
        creatorId: "a86d652c-8b74-4e27-8a32-770d66a4f6f9",
        commonFiles: [],
        programCourses: [],
        userPrograms: []
    }

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