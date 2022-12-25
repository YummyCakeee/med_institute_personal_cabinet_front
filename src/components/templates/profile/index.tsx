import Layout from "components/layouts/Layout"
import Head from "next/head"
import React from "react"
import styles from "./ProfileTemplate.module.scss"
import utilStyles from "styles/utils.module.scss"
import ProfileInfoForm from "components/modules/forms/profileInfo"
import ItemList from "components/modules/itemList"

const ProfileTemplate = () => {

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
                    <ProfileInfoForm />
                </div>
            </div>
        </Layout>
    )
}

export default ProfileTemplate