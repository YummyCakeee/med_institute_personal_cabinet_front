import LoadingErrorTemplate from "components/templates/loadingError"
import TestingTemplate from "components/templates/testing"
import { CollectionType, TestBlockType } from "components/templates/testing/types"
import { ENDPOINT_COLLECTIONS, ENDPOINT_TEST_BLOCKS } from "constants/endpoints"
import React from "react"
import axiosApi from "utils/axios"

type TestingPageProps = {
    success: boolean,
    error: string,
    collections: CollectionType[],
}

const Testing = ({
    success,
    error,
    collections,
}: TestingPageProps) => {

    return (
        <>
            {success ?
                <TestingTemplate
                    collections={collections}
                />
                : <LoadingErrorTemplate
                    error={error}
                />
            }
        </>
    )
}

export const getServerSideProps = async () => {
    const pageProps: TestingPageProps = {
        success: true,
        error: "",
        collections: [],
    }

    await axiosApi.get(ENDPOINT_COLLECTIONS)
        .then(res => {
            const data: any[] = res.data
            pageProps.collections = data
        })
        .catch(err => {
            pageProps.success = false
            pageProps.error = err.code
        })

    return {
        props: pageProps
    }
}

export default Testing