import React, { useEffect, useRef, useState } from "react"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import { ProgramType, ReportModelType } from "../types"
import utilStyles from "styles/utils.module.scss"
import styles from "./EducationalProgramUserReportTemplate.module.scss"
import ItemList from "components/modules/itemList"
import { CertificateType, UserProfileType, UserWithCertificatesType } from "components/templates/users/types"
import CertificateForm from "components/modules/forms/certificate"
import addNotification from "utils/notifications"
import { AxiosError } from "axios"
import { getServerErrorResponse } from "utils/serverData"
import Button from "components/elements/button/Button"
import { useModalWindowContext } from "context/modalWindowContext"
import axiosApi from "utils/axios"
import { ENDPOINT_USERS } from "constants/endpoints"

type EducationalProgramUserReportTemplateProps = {
    program: ProgramType,
    programUser: UserWithCertificatesType,
    programUserReport: ReportModelType[]
}

const EducationalProgramUserReportTemplate = ({
    program,
    programUser,
    programUserReport
}: EducationalProgramUserReportTemplateProps) => {

    const [certificates, setCertificates] = useState<CertificateType[]>([])
    const [isShowingUploadSection, setIsShowingUploadSection] = useState<boolean>(false)
    const downloadFileRef = useRef<HTMLAnchorElement>(null)
    const { setConfirmActionModalWindowState } = useModalWindowContext()

    useEffect(() => {
        setCertificates(programUser.certificates)
    }, [programUser.certificates])

    const onCertificateUploadSuccess = (certificate: CertificateType) => {
        setCertificates([...certificates, certificate])
        addNotification({ type: "success", title: "Успех", message: "Сертификат загружен" })
        setIsShowingUploadSection(false)
    }

    const onCertificateUploadError = (err: AxiosError) => {
        addNotification({ type: "danger", title: "Ошибка", message: `Не удалось загрузить сертификат:\n${getServerErrorResponse(err)}` })
    }

    const onDeleteCertificateClick = (index: number) => {
        setConfirmActionModalWindowState({
            text: "Вы уверены, что хотите удалить сертификат?",
            onConfirm: () => deleteCertificate(index),
            onDismiss: () => setConfirmActionModalWindowState(undefined),
            backgroundOverlap: true,
            closable: true
        })
    }

    const deleteCertificate = (index: number) => {
        const params = {
            filename: certificates[index].name
        }
        axiosApi.post(`${ENDPOINT_USERS}/${programUser.user.userId}/DeleteCertificate`, null, { params })
            .then(res => {
                setCertificates(certificates.filter((el, key) => key !== index))
                addNotification({ type: "success", title: "Успех", message: "Сертификат удалён" })
                setConfirmActionModalWindowState(undefined)
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось удалить сертификат:\n${getServerErrorResponse(err)}` })
            })
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
                        <div>{programUser.user.lastName}</div>
                    </div>
                    <div className={styles.student_main_info_item}>
                        <div>Имя:</div>
                        <div>{programUser.user.firstName}</div>
                    </div>
                    <div className={styles.student_main_info_item}>
                        <div>Отчество:</div>
                        <div>{programUser.user.secondName}</div>
                    </div>
                    <div className={styles.student_main_info_item}>
                        <div>Логин:</div>
                        <div>{programUser.user.userName}</div>
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
                        items={certificates}
                        itemControlButtons={() => [
                            {
                                title: "Скачать",
                                size: "small",
                                onClick: onDownloadCertificateClick
                            },
                            {
                                title: "Удалить",
                                size: "small",
                                onClick: onDeleteCertificateClick
                            }
                        ]}
                        controlButtonsBottom={[
                            {
                                title: "Загрузить",
                                size: "small",
                                onClick: () => setIsShowingUploadSection(true)
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
                    <div
                        className={styles.upload_certificate_container}
                        data-visible={isShowingUploadSection}
                    >
                        <CertificateForm
                            user={programUser.user}
                            program={program}
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