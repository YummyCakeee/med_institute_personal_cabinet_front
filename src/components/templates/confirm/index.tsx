import { useRouter } from "next/router"
import React, { useEffect, useMemo, useState } from "react"
import styles from "./ConfirmTemplate.module.scss"
import utilStyles from "styles/utils.module.scss"
import axiosApi from "utils/axios"
import { ENDPOINT_ACCOUNT } from "constants/endpoints"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import { getServerErrorResponse } from "utils/serverData"

const ConfirmTemplate = () => {

    const router = useRouter()
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false)
    const [error, setError] = useState<any>(undefined)
    const user = useSelector(userSelector)

    const token = useMemo(() => {
        return router.query.token
    }, [router.query])

    useEffect(() => {
        const data = {
            email: user.email,
            token
        }
        axiosApi.post(`${ENDPOINT_ACCOUNT}/ConfirmEmail`, data)
            .then(res => {
                setIsConfirmed(true)
                setError(undefined)
            })
            .catch(err => {
                setError(err)
            })
    }, [token, user.email])

    return (
        <div className={styles.container}>
            {typeof token === "string" ?
                <>
                    {
                        !isConfirmed ?
                            <div className={utilStyles.text_medium}>
                                Пожалуйста, подождите
                            </div> :
                            <div className={utilStyles.text_medium}>
                                Почта подтверждена, вы можете закрыть эту страницу
                            </div>
                    }

                </> :
                <div className={utilStyles.text_medium}>
                    {error ? `Произошла ошибка при подтверждении: ${getServerErrorResponse(error)}` : "Неверный токен"}
                </div>
            }
        </div>
    )

}

export default ConfirmTemplate