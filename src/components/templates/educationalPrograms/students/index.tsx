import React, { useCallback, useEffect, useState } from "react"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import { PercentageType, ProgramType } from "../types"
import utilStyles from "styles/utils.module.scss"
import styles from "./EducationalProgramCoursesTemplate.module.scss"
import SwapLists from "components/modules/swapLists"
import Button from "components/elements/button/Button"
import axiosApi from "utils/axios"
import axios from "axios"
import { ENDPOINT_PROGRAMS } from "constants/endpoints"
import { Store } from "react-notifications-component"
import { UserProfileType } from "components/templates/users/types"

type EducationalProgramCoursesTemplateProps = {
    program: ProgramType,
    users: UserProfileType[]
}

const EducationalProgramStudentsTemplate = ({
    program,
    users
}: EducationalProgramCoursesTemplateProps) => {

    const [initialProgramUsers, setInitialProgramUsers] = useState<UserProfileType[]>([])
    const [programUsers, setProgramUsers] = useState<UserProfileType[]>([])
    const [restUsers, setRestUsers] = useState<UserProfileType[]>([])
    const [selectedUserIndex, setSelectedUserIndex] = useState<number | undefined>(undefined)

    useEffect(() => {
        const selectedUsers = users.filter(user => program.userPrograms?.find(
            userProgram => userProgram.userId === user.userId))

        setInitialProgramUsers(selectedUsers)
        setProgramUsers(selectedUsers)

        setRestUsers(users.filter(user =>
            !selectedUsers.find(selectedUser => user.userId === selectedUser.userId)))

    }, [program, users])

    const onUserSelected = (index: number | undefined) => {
        setSelectedUserIndex(index)
    }


    const onSubmit = useCallback(() => {
        const newUsers = programUsers.filter(programUser =>
            !initialProgramUsers.find(initialProgramUser =>
                programUser.userId === initialProgramUser.userId
            ))

        const deletedUsersIds = initialProgramUsers.filter(initialProgramUser =>
            !programUsers.find(programUser => initialProgramUser.userId === programUser.userId
            )).map(el => el.userId)

        const deletedProgramUsersIds = program.userPrograms?.filter(userProgram =>
            deletedUsersIds.find(deletedUserId => deletedUserId === userProgram.userId
            )).map(el => el.userProgramId) || []

        axios.all([
            ...newUsers.map(user => {
                return axiosApi.post(`${ENDPOINT_PROGRAMS}/${program.programId}/User/${user.userId}`)
            }),
            ...deletedProgramUsersIds.map(el => {
                return axiosApi.delete(`${ENDPOINT_PROGRAMS}/User/${el}`)
            })
        ])
            .then(res => {
                Store.addNotification({
                    container: "top-right",
                    type: "success",
                    title: "Обучающиеся программы обновлены",
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            })
            .catch(err => {
                Store.addNotification({
                    container: "top-right",
                    type: "danger",
                    title: "Не удалось обновить обучающихся программы",
                    message: `${err.code}`,
                    dismiss: {
                        onScreen: true,
                        duration: 5000
                    }
                })
            })

    }, [initialProgramUsers, programUsers, program])

    return (
        <Layout>
            <Head>
                <title>{`Обучающиеся программы обучения — ${program.title}`}</title>
            </Head>
            <div>
                <div className={utilStyles.title}>
                    Обучающиеся программы<br />{program.title}
                </div>
                <div className={utilStyles.section_title}>Список обучающихся программы</div>
                <div className={styles.lists_container}>
                    <SwapLists
                        firstListItems={programUsers}
                        setFirstListItems={setProgramUsers}
                        secondListItems={restUsers}
                        setSecondListItems={setRestUsers}
                        firstListTitle="Обучающиеся программы"
                        secondListTitle="Остальные обучающиеся"
                        onLeftListItemSelected={onUserSelected}
                        renderItem={({ firstName, secondName, lastName, user: { userName } }) =>
                            `${lastName} ${firstName} ${secondName}  (${userName})`
                        }
                    />
                </div>
                <div className={styles.save_button_container}>
                    <Button
                        title="Сохранить"
                        size="small"
                        className={styles.save_button}
                        onClick={onSubmit}
                    />
                </div>
            </div>
        </Layout>
    )
}

export default EducationalProgramStudentsTemplate