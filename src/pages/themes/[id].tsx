import React from "react"
import { GetServerSideProps } from "next"
import { ThemeType } from "components/templates/courses/useCourses"
import LoadingErrorTemplate from "components/templates/loadingError"
import axiosApi from "utils/axios"
import { ENDPOINT_COURSES, ENDPOINT_THEMES } from "constants/endpoints"
import ThemeTemplate from "components/templates/courses/theme"

type ThemePageProps = {
    success: boolean,
    error: string,
    theme: ThemeType | null
}

const Theme = ({
    success,
    error,
    theme
}: ThemePageProps) => {


    return (
        <>
            {success && theme ?
                <ThemeTemplate
                    {...{
                        theme
                    }}
                /> :
                <LoadingErrorTemplate
                    error={error}
                />
            }
        </>
    )
}

export const getServerSideProps: GetServerSideProps<ThemePageProps> = async ({ params }) => {
    const pageProps: ThemePageProps = {
        success: true,
        error: "",
        theme: null
    }

    await axiosApi.get(`${ENDPOINT_THEMES}/${params?.id}`)
        .then(res => {
            pageProps.theme = res.data
        })
        .catch(err => {
            pageProps.success = false
            pageProps.error = err.code
        })

    return {
        props: pageProps
    }
}

export default Theme