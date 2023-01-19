import React, { useState } from "react"
import Layout from "components/layouts/Layout"
import { UserProfileType } from "components/templates/users/types"
import Head from "next/head"
import { CourseType } from "../types"
import utilStyles from "styles/utils.module.scss"
import ItemList from "components/modules/itemList"
import styles from "./CourseReportTemplate.module.scss"
import { ReportModelType } from "components/templates/educationalPrograms/types"
import LoadingStatusWrapper, { LoadingStatusType } from "components/elements/LoadingStatusWrapper/LoadingStatusWrapper"
import axiosApi from "utils/axios"
import { useRouter } from "next/router"
import { ENDPOINT_COURSES } from "constants/endpoints"
import addNotification from "utils/notifications"

type CourseReportTemplateProps = {
    course: CourseType,
    courseUsers: UserProfileType[]
}

const CourseReportTemplate = ({
    course,
    courseUsers
}: CourseReportTemplateProps) => {

    const [userThemesReport, setUserThemesReport] = useState<ReportModelType[]>([])
    const [userThemesStatus, setUserThemesStatus] = useState<LoadingStatusType>(LoadingStatusType.LOADED)
    const router = useRouter()

    const onLoadUserThemesReport = async (index: number) => {
        setUserThemesStatus(LoadingStatusType.LOADING)
        const { id: courseId } = router.query
        const userId = courseUsers[index].userId
        axiosApi.get(`${ENDPOINT_COURSES}/${courseId}/Users/${userId}/Report`)
            .then(res => {
                setUserThemesStatus(LoadingStatusType.LOADED)
                setUserThemesReport(res.data)
            })
            .catch(err => {
                setUserThemesStatus(LoadingStatusType.LOAD_ERROR)
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось загрузить темы студента:\n${err.code}` })
            })
    }

    return (
        <Layout>
            <Head>
                <title>{`Отчёт по курсу "${course.title}"`}</title>
            </Head>
            <div className={utilStyles.title}>
                {`Отчёт по курсу "${course.title}"`}
            </div>
            <div className={utilStyles.section}>
                <div className={styles.lists_container}>
                    <div>
                        <div className={styles.list_title}>Список студентов курса</div>
                        <ItemList
                            headers={[
                                {
                                    field: "lastName",
                                    title: "Фамилия"
                                },
                                {
                                    field: "firstName",
                                    title: "Имя"
                                },
                                {
                                    field: "secondName",
                                    title: "Отчество"
                                },
                                {
                                    field: "userName",
                                    title: "Логин"
                                }
                            ]}
                            items={courseUsers}
                            itemControlButtons={() => [
                                {
                                    title: "Прогресс по темам",
                                    stretchable: true,
                                    onClick: onLoadUserThemesReport
                                }
                            ]}
                            className={styles.user_list}
                        />
                        <div className={utilStyles.text}>Выберите студента, чтобы просмотреть его прогресс в освоении тем курса</div>
                    </div>
                    <div className={styles.theme_list_section}>
                        <div className={styles.list_title}>Прогресс студента по темам</div>
                        <LoadingStatusWrapper
                            status={userThemesStatus}
                        >
                            <ItemList
                                headers={[
                                    {
                                        field: "name",
                                        title: "Название",
                                        colSize: "400px"
                                    },
                                    {
                                        field: "status",
                                        title: "Статус",
                                        colSize: "200px"
                                    }
                                ]}
                                items={userThemesReport}
                                customFieldsRendering={[
                                    {
                                        fieldName: "status",
                                        render: (value) => {
                                            return value === 0 ? "Не приступал" :
                                                value === 1 ? "Завершил" : "В процессе"
                                        }
                                    }
                                ]}
                            />
                        </LoadingStatusWrapper>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CourseReportTemplate