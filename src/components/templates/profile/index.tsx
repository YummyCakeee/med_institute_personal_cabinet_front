import Layout from "components/layouts/Layout"
import Head from "next/head"
import React, { useRef } from "react"
import styles from "./ProfileTemplate.module.scss"
import utilStyles from "styles/utils.module.scss"
import ProfileInfoForm from "components/modules/forms/profileInfo"
import { CertificateType, UserProfileType } from "../users/types"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { StateUserType, userInfoChanged } from "store/userSlice"
import ProfilePasswordForm from "components/modules/forms/profilePassword"
import addNotification from "utils/notifications"
import { getServerErrorResponse } from "utils/serverData"
import ItemList from "components/modules/itemList"
import { ENDPOINT_USERS } from "constants/endpoints"
import axiosApi from "utils/axios"

type ProfileTemplateProps = {
    certificates: CertificateType[]
}

const ProfileTemplate = ({
    certificates
}: ProfileTemplateProps) => {

    const dispatch = useDispatch<AppDispatch>()
    const downloadFileRef = useRef<HTMLAnchorElement>(null)

    const onSuccesUserInfoChange = (user: UserProfileType) => {

        const stateUser: StateUserType = {
            id: user.userId!,
            firstName: user.firstName!,
            lastName: user.lastName!,
            secondName: user.secondName!,
            login: user.userName!
        }

        dispatch(userInfoChanged(stateUser))

        addNotification({ type: "success", title: "Успех", message: "Информация о пользователе обновлена" })
    }

    const onErrorUserInfoChange = (error: any) => {
        addNotification({ type: "danger", title: "Ошибка", message: `Не удалось обновить информацию о пользователе: ${getServerErrorResponse(error)}` })
    }

    const onSuccesPasswordChange = () => {

        addNotification({ type: "success", title: "Успех", message: "Пароль изменён" })
    }

    const onErrorPasswordChange = (error: any) => {
        addNotification({ type: "danger", title: "Ошибка", message: `Не удалось изменить пароль: \n${getServerErrorResponse(error)}` })
    }

    const onDownloadCertificateClick = async (index: number) => {
        const filename = certificates[index].name
        const params = {
            filename
        }
        axiosApi.get(`${ENDPOINT_USERS}/DownloadCertificate`, { params, responseType: "blob" })
            .then(res => {
                console.log(res.data)
                let url = window.URL.createObjectURL(res.data);
                if (downloadFileRef.current) {
                    const extension = filename.match(/.*(\..*)$/)
                    downloadFileRef.current.href = url
                    downloadFileRef.current.download = `${filename}${extension?.length ? extension[1] : "txt"}`
                    downloadFileRef.current.click()
                }
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось скачать сертификат:\n${getServerErrorResponse(err)}` })
            })
    }

    return (
        <Layout>
            <Head>
                <title>Мой профиль</title>
            </Head>
            <div>
                <p className={utilStyles.section_title}>Сертификаты</p>
                <div className={styles.certificates}>
                    <ItemList
                        headers={[
                            {
                                field: "programName",
                                title: "По программе",
                                colSize: "600px"
                            },
                            {
                                field: "date",
                                title: "Дата выдачи",
                                colSize: "200px"
                            }
                        ]}
                        items={certificates}
                        itemControlButtons={() => [
                            {
                                title: "Скачать",
                                size: "small",
                                onClick: onDownloadCertificateClick
                            }
                        ]}
                        customFieldsRendering={[
                            {
                                fieldName: "date",
                                render: value => new Date(value).toLocaleDateString()
                            }
                        ]}
                    />
                    <a ref={downloadFileRef} target="_blank" rel="noreferrer" download></a>
                </div>
            </div>
            <div>
                <p className={utilStyles.section_title}>Изменение личных данных</p>
                <div className={styles.personal_data_form}>
                    <ProfileInfoForm
                        onSuccess={onSuccesUserInfoChange}
                        onError={onErrorUserInfoChange}
                    />
                </div>
                <p className={utilStyles.section_title}>Изменение пароля</p>
                <div className={styles.personal_data_form}>
                    <ProfilePasswordForm
                        onSuccess={onSuccesPasswordChange}
                        onError={onErrorPasswordChange}
                    />
                </div>
            </div>
        </Layout>
    )
}

export default ProfileTemplate