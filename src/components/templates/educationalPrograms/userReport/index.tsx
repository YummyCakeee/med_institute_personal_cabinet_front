import React, { useState } from "react"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import { ProgramType, ReportModelType } from "../types"
import utilStyles from "styles/utils.module.scss"
import styles from "./EducationalProgramUserReportTemplate.module.scss"
import ItemList from "components/modules/itemList"
import { UserProfileType } from "components/templates/users/types"
import CertificateForm from "components/modules/forms/certificate"
import addNotification from "utils/notifications"
import { AxiosError } from "axios"
import { getServerErrorResponse } from "utils/serverData"
import Button from "components/elements/button/Button"

type EducationalProgramUserReportTemplateProps = {
    program: ProgramType,
    programUser: UserProfileType,
    programUserReport: ReportModelType[]
}

const EducationalProgramUserReportTemplate = ({
    program,
    programUser,
    programUserReport
}: EducationalProgramUserReportTemplateProps) => {

    const [isShowingUploadSection, setIsShowingUploadSection] = useState<boolean>(false)

    const onCertificateUploadSuccess = () => {
        addNotification({ type: "success", title: "Успех", message: "Сертификат загружен" })
        setIsShowingUploadSection(false)
    }

    const onCertificateUploadError = (err: AxiosError) => {
        console.log(err)
        addNotification({ type: "danger", title: "Ошибка", message: `Не удалось загрузить сертификат:\n${getServerErrorResponse(err)}` })
    }

    return (
        <Layout>
            <Head>
                <title>{`Отчёт по программе обучения — ${program.title}`}</title>
            </Head>
            <div className={utilStyles.title}>
                Отчёт по программе<br />{program.title}
            </div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>Основная информация о студенте</div>
                <div className={styles.student_main_info}>
                    <div className={styles.student_main_info_item}>
                        <div>Фамилия:</div>
                        <div>{programUser.lastName}</div>
                    </div>
                    <div className={styles.student_main_info_item}>
                        <div>Имя:</div>
                        <div>{programUser.firstName}</div>
                    </div>
                    <div className={styles.student_main_info_item}>
                        <div>Отчество:</div>
                        <div>{programUser.secondName}</div>
                    </div>
                    <div className={styles.student_main_info_item}>
                        <div>Логин:</div>
                        <div>{programUser.userName}</div>
                    </div>
                </div>
            </div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>Курсы студента</div>
                <ItemList
                    headers={[
                        {
                            field: "name",
                            title: "Курс",
                            colSize: "600px"
                        },
                        {
                            field: "status",
                            title: "Статус",
                            colSize: "200px"
                        }
                    ]}
                    items={programUserReport}
                    customFieldsRendering={[
                        {
                            fieldName: "status",
                            render: (value) => {
                                return value === 0 ? "Не приступал" :
                                    value === 1 ? "Пройден" :
                                        "В процессе"
                            }
                        }
                    ]}
                />
            </div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>Сертификаты студента</div>
                <div className={styles.certificates_section}>
                    <ItemList
                        headers={[
                            {
                                field: "name",
                                title: "Название",
                                colSize: "600px"
                            },
                            {
                                field: "date",
                                title: "Дата выдачи",
                                colSize: "200px"
                            }
                        ]}
                        items={[]}
                        controlButtonsBottom={[
                            {
                                title: "Загрузить",
                                size: "small",
                                onClick: () => setIsShowingUploadSection(true)
                            }
                        ]}
                    />
                    <div
                        className={styles.upload_certificate_container}
                        data-visible={isShowingUploadSection}
                    >
                        <CertificateForm
                            onSuccess={onCertificateUploadSuccess}
                            onError={onCertificateUploadError}
                        />
                        <Button
                            title="Отмена"
                            size="small"
                            onClick={() => setIsShowingUploadSection(false)}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default EducationalProgramUserReportTemplate