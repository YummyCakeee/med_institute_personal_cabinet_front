import LoadingErrorTemplate from "components/templates/loadingError"
import CollectionTemplate from "components/templates/testing/collections/index"
import { CollectionType } from "components/templates/testing/useTesting"
import { ENDPOINT_COLLECTIONS } from "constants/endpoints"
import { GetServerSideProps } from "next"
import axiosApi from "utils/axios"

type CollectionPageProps = {
    success: boolean,
    error: string,
    collection: CollectionType | null
}

const Collection = ({
    success,
    error,
    collection
}: CollectionPageProps) => {

    return (
        <>
            {success && collection ?
                <CollectionTemplate
                    collection={collection}
                /> :
                <LoadingErrorTemplate
                    error={error}
                />
            }
        </>
    )

}

export const getServerSideProps: GetServerSideProps<CollectionPageProps> = async ({ params }) => {
    const pageProps: CollectionPageProps = {
        success: true,
        error: "",
        collection: null,
    }

    await axiosApi.get(`${ENDPOINT_COLLECTIONS}/${params?.id}`)
        .then(res => {
            const tests = res.data.tests.map((el: any) => {
                const testBody = JSON.parse(el.testBody || "")
                return {
                    ...el,
                    questionText: testBody.QuestionText,
                    answers: testBody.Answers.map((el: any) => ({ text: el.Text, correct: el.Correct })),
                }
            })

            pageProps.collection = {
                ...res.data,
                tests
            }
        })
        .catch(err => {
            pageProps.success = false
            pageProps.error = err.code
        })

    return {
        props: pageProps
    }
}

export default Collection