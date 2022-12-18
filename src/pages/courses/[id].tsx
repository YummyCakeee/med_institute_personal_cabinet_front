import CourseTemplate from "components/templates/courses/CourseTemplate"
import React from "react"
import { GetServerSideProps } from "next"
import { CourseType } from "components/templates/courses/useCourses"
import LoadingErrorTemplate from "components/templates/loadingError"
import axiosApi from "utils/axios"
import { ENDPOINT_COURSES } from "constants/endpoints"

type CoursePageProps = {
    success: boolean,
    error: string,
    course: CourseType | null,
}

const Course = ({
    success,
    error,
    course
}: CoursePageProps) => {


    return (
        <>
            {success && course ?
                <CourseTemplate
                    {...{
                        course
                    }}
                /> :
                <LoadingErrorTemplate
                    error={error}
                />
            }
        </>
    )
}

export const getServerSideProps: GetServerSideProps<CoursePageProps> = async ({ params }) => {
    const pageProps: CoursePageProps = {
        success: true,
        error: "",
        course: null
    }

    await axiosApi.get(`${ENDPOINT_COURSES}/${params?.id}`)
        .then(res => {
            pageProps.course = res.data
        })
        .catch(err => {
            pageProps.success = false
            pageProps.error = err.code
        })

    return {
        props: pageProps
    }
}

export default Course