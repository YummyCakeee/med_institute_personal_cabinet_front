import React from "react"
import { GetServerSideProps } from "next"
import { ThemeType } from "components/templates/courses/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import axiosApi from "utils/axios"
import { ENDPOINT_COLLECTIONS, ENDPOINT_TEST_BLOCKS, ENDPOINT_THEMES } from "constants/endpoints"
import ThemeTemplate from "components/templates/courses/theme"
import { CollectionType, TestBlockType } from "components/templates/testing/types"
import axios from "axios"

type ThemePageProps = {
    success: boolean,
    error: string,
    theme?: ThemeType,
    collections?: CollectionType[]
}

const Theme = ({
    success,
    error,
    theme,
    collections
}: ThemePageProps) => {


    return (
        <>
            {success && theme && collections ?
                <ThemeTemplate
                    {...{
                        theme,
                        collections
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
        error: ""
    }

    await axios.all([
        axiosApi.get(`${ENDPOINT_THEMES}/${params?.themeId}`),
        axiosApi.get(ENDPOINT_COLLECTIONS)
    ])
        .then(axios.spread(({ data: theme }, { data: collections }) => {
            pageProps.theme = theme
            pageProps.collections = collections
        }))
        .catch(err => {
            pageProps.success = false
            pageProps.error = err.code
        })

    if (pageProps.theme?.testBlockId !== null) {
        await axiosApi.get(`${ENDPOINT_TEST_BLOCKS}/${pageProps.theme?.testBlockId}`)
            .then(res => {
                if (pageProps.theme)
                    pageProps.theme.testBlock = res.data
            })
            .catch(err => {
                pageProps.success = false
                pageProps.error = err.code
                console.log(err)
            })
    }

    return {
        props: pageProps
    }
}

export default Theme