import LoadingErrorTemplate from "components/templates/loadingError"
import CollectionTemplate from "components/templates/testing/collection/index"
import { CollectionType } from "components/templates/testing/types"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { ENDPOINT_COLLECTIONS } from "constants/endpoints"
import { ROUTE_TESTING, ROUTE_USERS } from "constants/routes"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { wrapper } from "store"
import { setBreadCrumbs } from "store/breadCrumbsSlice"
import { userSelector } from "store/userSlice"
import axiosApi from "utils/axios"

const Collection = () => {

    const user = useSelector(userSelector)
    const router = useRouter()
    const [collection, setCollection] = useState<CollectionType>()
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        const { id } = router.query
        if (user.authorized) {
            axiosApi.get(`${ENDPOINT_COLLECTIONS}/${id}`)
                .then(res => {
                    const tests = res.data.tests.map((el: any) => {
                        const testBody = JSON.parse(el.testBody || "")
                        return {
                            ...el,
                            exerciseText: testBody.ExerciseText || testBody.QuestionText || "",
                            questionText: testBody.QuestionText || testBody.ExerciseText || "",
                            answers: testBody.Answers?.map((el: any) => ({ text: el.Text, correct: el.Correct })) || [],
                        }
                    })
                    setCollection({
                        ...res.data,
                        tests
                    })
                    setSuccess(true)
                })
                .catch(err => {
                    setSuccess(false)
                    setError(err.code)
                })
        }
    }, [user.authorized, router.query])

    return (
        <>
            {user.authorized ?
                <>
                    {success && collection ?
                        <CollectionTemplate
                            collection={collection}
                        />
                        :
                        <LoadingErrorTemplate
                            error={error}
                        />
                    }
                </>
                :
                <UnauthorizedTemplate />
            }
        </>
    )

}

Collection.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(setBreadCrumbs([
        {
            title: "Тестирование",
            route: ROUTE_TESTING
        }
    ]))
})

export default Collection