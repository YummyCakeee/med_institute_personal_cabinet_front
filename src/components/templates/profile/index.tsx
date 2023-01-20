import Layout from "components/layouts/Layout"
import Head from "next/head"
import React from "react"
import styles from "./ProfileTemplate.module.scss"
import utilStyles from "styles/utils.module.scss"
import ProfileInfoForm from "components/modules/forms/profileInfo"
import ItemList from "components/modules/itemList"
import { UserProfileType } from "../users/types"
import { Store } from "react-notifications-component"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { StateUserType, userInfoChanged } from "store/userSlice"
import ProfilePasswordForm from "components/modules/forms/profilePassword"
import addNotification from "utils/notifications"

const ProfileTemplate = () => {

    const dispatch = useDispatch<AppDispatch>()

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
        addNotification({ type: "danger", title: "Ошибка", message: `Не удалось обновить информацию о пользователе: ${error.code}` })
    }

    const onSuccesPasswordChange = () => {

        addNotification({ type: "success", title: "Успех", message: "Пароль изменён" })
    }

    const onErrorPasswordChange = (error: any) => {
        console.log(error)
        addNotification({ type: "danger", title: "Ошибка", message: `Не удалось изменить пароль: \n${error.code}` })
    }

    return (
        <Layout>
            <Head>
                <title>Мой профиль</title>
            </Head>
            <div>
                <p className={utilStyles.section_title}>Сертификаты</p>
                <div className={styles.certificates}>
                    {/* <ItemList
                        headers={[
                            {
                                title: "Название",
                                field: "name"
                            }
                        ]}
                    /> */}
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