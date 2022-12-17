import LoadingErrorTemplate from "components/templates/loadingError"
import TestingTemplate from "components/templates/testing"
import { CollectionType, TestBlockType } from "components/templates/testing/useTesting"
import { ENDPOINT_COLLECTIONS } from "constants/endpoints"
import React from "react"
import axiosApi from "utils/axios"

type TestingPageProps = {
    success: boolean,
    error: string,
    testBlocks: TestBlockType[],
    collections: CollectionType[],
}

const Testing = ({
    success,
    error,
    testBlocks,
    collections,
}: TestingPageProps) => {

    return (
        <>
            {success ?
                <TestingTemplate
                    {...{
                        testBlocks,
                        collections,
                    }}
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
        testBlocks: [],
        collections: [],
    }

    await axiosApi.get(ENDPOINT_COLLECTIONS)
        .then(res => {
            const data: any[] = res.data
            const collections: CollectionType[] = data
            pageProps.collections = collections
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