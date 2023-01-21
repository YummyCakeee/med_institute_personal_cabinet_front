import RecoveryModalWindow from "components/modules/modalWindows/recoveryModalWindow"
import { ROUTE_REGISTRATION } from "constants/routes"
import { useRouter } from "next/router"
import React, { useMemo } from "react"
import LoadingErrorTemplate from "../loadingError"
import styles from "./RecoveryTemplate.module.scss"

const RecoveryTemplate = () => {

    const router = useRouter()
    const onRecoverySuccess = () => {
        router.replace(ROUTE_REGISTRATION)
    }

    const token = useMemo(() => {
        return router.query.token
    }, [router.query])

    return (
        <div className={styles.container}>
            {typeof token === "string" ?
                <RecoveryModalWindow
                    {...{
                        token,
                        onSuccess: onRecoverySuccess
                    }}
                /> :
                <LoadingErrorTemplate
                    showHeader={false}
                    error="Неверный токен"
                />
            }
        </div>
    )

}

export default RecoveryTemplate