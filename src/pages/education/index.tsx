import EducationTemplate from "components/templates/education"
import { UserThemeType } from "components/templates/education/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import { ENDPOINT_USER_THEMES } from "constants/endpoints"
import { GetServerSideProps } from "next"
import React from "react"
import axiosApi from "utils/axios"

type EducationPageProps = {
    success: boolean,
    error: string,
    userThemes: UserThemeType[]
}

const Education = ({
    success,
    error,
    userThemes
}: EducationPageProps) => {


    return (
        <>
            {success ?
                <EducationTemplate
                    userThemes={userThemes}
                />
                :
                <LoadingErrorTemplate
                    error={error}
                />
            }
        </>
    )
}


export const getServerSideProps: GetServerSideProps<EducationPageProps> = async () => {
    const pageProps: EducationPageProps = {
        success: true,
        error: "",
        userThemes: []
    }

    await axiosApi.get(ENDPOINT_USER_THEMES)
        .then(res => {
            pageProps.userThemes = res.data
        })
        .catch(err => {
            pageProps.success = false
            pageProps.error = err.code
        })

    return {
        props: pageProps
    }
}

export default Education