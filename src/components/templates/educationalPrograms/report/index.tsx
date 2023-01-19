import React from "react"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import { CountStudentsModelType, ProgramType } from "../types"
import utilStyles from "styles/utils.module.scss"
import styles from "./EducationalProgramReportTemplate.module.scss"
import ItemList from "components/modules/itemList"
import { UserProfileType } from "components/templates/users/types"
import { useRouter } from "next/router"
import { ROUTE_EDUCATIONAL_PROGRAMS } from "constants/routes"

type EducationalProgramReportTemplateProps = {
    programReport: CountStudentsModelType,
    program: ProgramType,
    programUsers: UserProfileType[]
}

const EducationalProgramReportTemplate = ({
    programReport,
    program,
    programUsers
}: EducationalProgramReportTemplateProps) => {

    const router = useRouter()
    const onUserReportClick = (index: number) => {
        const { id: programId } = router.query
        const userId = programUsers[index].userId
        router.push(`${ROUTE_EDUCATIONAL_PROGRAMS}/${programId}/users/${userId}/report`)
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
                <div className={utilStyles.section_title}>Основная информация</div>
                <div className={styles.main_info}>
                    <div className={styles.main_info_item}>
                        <div>Всего было записано:</div>
                        <div><span>{programReport.totalCount}</span> чел.</div>
                    </div>
                    <div className={styles.main_info_item}>
                        <div>Приступило к программе:</div>
                        <div><span>{programReport.countCurrent}</span> чел.</div>
                    </div>
                    <div className={styles.main_info_item}>
                        <div>Не приступило к программе:</div>
                        <div><span>{programReport.countNotStarted}</span> чел.</div>
                    </div>
                    <div className={styles.main_info_item}>
                        <div>Всего завершило:</div>
                        <div><span>{programReport.countPassed}</span> чел.</div>
                    </div>
                </div>
            </div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>Ученики программы</div>
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
                        }
                    ]}
                    items={programUsers}
                    itemControlButtons={() => [
                        {
                            title: "Отчёт",
                            size: "small",
                            onClick: onUserReportClick
                        }
                    ]}
                    className={styles.user_list}

                />
            </div>
        </Layout>
    )
}

export default EducationalProgramReportTemplate