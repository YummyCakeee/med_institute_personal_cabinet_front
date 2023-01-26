import React, { useEffect, useState } from "react"
import { ThemeType } from "components/templates/courses/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import axiosApi from "utils/axios"
import { ENDPOINT_COLLECTIONS, ENDPOINT_TEST_BLOCK_COLLECTIONS, ENDPOINT_THEMES } from "constants/endpoints"
import ThemeTemplate from "components/templates/courses/theme"
import { CollectionType, TestBlockCollectionsType } from "components/templates/testing/types"
import axios from "axios"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { ROUTE_COURSES } from "constants/routes"
import { wrapper } from "store"
import { setBreadCrumbs } from "store/breadCrumbsSlice"
import { getServerErrorResponse } from "utils/serverData"

const Theme = () => {

    const router = useRouter()
    const user = useSelector(userSelector)
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [theme, setThemes] = useState<ThemeType>()
    const [collections, setCollections] = useState<CollectionType[]>()

    useEffect(() => {
        const fetchData = async () => {
            const { themeId } = router.query
            if (user.authorized && themeId) {
                let theme: ThemeType | undefined
                await axios.all([
                    axiosApi.get(`${ENDPOINT_THEMES}/${themeId}`),
                    axiosApi.get(ENDPOINT_COLLECTIONS)
                ])
                    .then(axios.spread(({ data: themeData }, { data: collectionsData }) => {
                        theme = themeData
                        setThemes(theme)
                        setCollections(collectionsData)
                    }))
                    .catch(err => {
                        setSuccess(false)
                        setError(getServerErrorResponse(err))
                    })
                if (theme?.testBlockId) {
                    await axiosApi.get(`${ENDPOINT_TEST_BLOCK_COLLECTIONS}`)
                        .then(res => {
                            (res.data as TestBlockCollectionsType[]).forEach(el => {
                                if (el.testBlockId === theme!.testBlockId)
                                    theme?.testBlock?.testBlockCollections?.push(el)
                            })
                        })
                        .catch(err => {
                            setSuccess(false)
                            setError(getServerErrorResponse(err))
                        })
                }
            }
        }

        fetchData()

    }, [user, router.query])

    return (
        <>
            {user.authorized ?
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
                :
                <UnauthorizedTemplate />
            }
        </>
    )
}

Theme.getInitialProps = wrapper.getInitialPageProps(store => ({ query }) => {
    const { id } = query
    store.dispatch(setBreadCrumbs([
        {
            title: "Курсы",
            route: ROUTE_COURSES
        },
        {
            title: "Темы курса",
            route: `${ROUTE_COURSES}/${id}/themes`
        }
    ]))
})

export default Theme