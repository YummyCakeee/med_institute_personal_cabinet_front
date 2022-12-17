import CoursesTemplate from "components/templates/courses"
import React from "react"
import axiosApi from "utils/axios"
import { ENDPOINT_COURSES } from "constants/endpoints"
import { CourseType } from "components/templates/courses/useCourses"
import LoadingErrorTemplate from "components/templates/loadingError"

type CoursesPageProps = {
    success: boolean,
    courses: CourseType[],
}

const Courses = ({
    success,
    courses
}: CoursesPageProps) => {
    console.log(success)
    return (
        <>
            {success ?
                <CoursesTemplate
                    courses={courses}
                /> :
                <LoadingErrorTemplate />
            }
        </>
    )
}

export async function getServerSideProps() {
    const pageProps: CoursesPageProps = {
        success: true,
        courses: []
    }

    await axiosApi.get(ENDPOINT_COURSES)
        .then(res => {
            const data: CourseType[] = res.data;
            pageProps.courses = data
        })
        .catch(err => {
            pageProps.success = false
        })

    return {
        props: pageProps
    }
}

export default Courses