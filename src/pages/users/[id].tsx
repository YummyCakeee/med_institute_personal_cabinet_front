import React from "react"
import UserTemplate from "components/templates/users/UserTemplate"
import axiosApi from "utils/axios"
import { ENDPOINT_USERS } from "constants/endpoints"
import { GetServerSideProps } from "next"
import { UserProfileType } from "components/templates/users/types"
import LoadingErrorTemplate from "components/templates/loadingError"

type UserPageProps = {
    success: boolean,
    error: string,
    user: UserProfileType | null
}

const Users = ({
    success,
    error,
    user
}: UserPageProps) => {
    return (
        <>
            {success && user ?
                <UserTemplate
                    {...{ user }}
                /> :
                <LoadingErrorTemplate
                    error={error}
                />
            }
        </>
    )
}

export const getServerSideProps: GetServerSideProps<UserPageProps> = async ({ params }) => {

    const pageProps: UserPageProps = {
        success: true,
        error: "",
        user: null
    }

    await axiosApi.get(`${ENDPOINT_USERS}/${params?.id}`)
        .then(res => {
            pageProps.user = res.data
        })
        .catch(err => {
            pageProps.success = false
            pageProps.error = err.code
        })
    return {
        props: pageProps
    }
}

export default Users