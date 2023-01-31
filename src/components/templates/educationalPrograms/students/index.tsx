import React, { useCallback, useEffect, useState } from "react"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import InputField from "components/elements/input/Input"
import { ProgramType } from "../types"
import utilStyles from "styles/utils.module.scss"
import styles from "./EducationalProgramCoursesTemplate.module.scss"
import Button from "components/elements/button/Button"
import axiosApi from "utils/axios"
import axios from "axios"
import { ENDPOINT_PROGRAMS, ENDPOINT_USERS } from "constants/endpoints"
import { UserProfileType } from "components/templates/users/types"
import addNotification from "utils/notifications"
import { getServerErrorResponse } from "utils/serverData"
import ItemList from "components/modules/itemList"
import LoadingStatusWrapper, { LoadingStatusType } from "components/modules/LoadingStatusWrapper/LoadingStatusWrapper"
import { FilterSortField, UserField } from "components/templates/users/useUsers"
import ComboBox from "components/elements/comboBox/ComboBox"
import cn from "classnames"

type EducationalProgramCoursesTemplateProps = {
    program: ProgramType,
    programUsers: UserProfileType[]
}

const EducationalProgramStudentsTemplate = ({
    program,
    programUsers
}: EducationalProgramCoursesTemplateProps) => {

    const [currentProgramUsers, setCurrentProgramUsers] = useState<UserProfileType[]>([])
    const [initialProgramUsers, setInitialProgramUsers] = useState<UserProfileType[]>([])
    const [users, setUsers] = useState<UserProfileType[]>([])
    const [filteringFieldName, setFilteringFieldName] = useState<FilterSortField | undefined>(FilterSortField.LAST_NAME)
    const [filteringFieldValue, setFilteringFieldValue] = useState<string>("")
    const [totalUsersCount, setTotalUsersCount] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [usersLoadingStatus, setUsersLoadingStatus] = useState<LoadingStatusType>(LoadingStatusType.LOADING)
    const usersPerPage = 10

    const [headers] = useState([
        {
            title: "Фамилия",
            field: UserField.LAST_NAME,
            filterSortFieldName: FilterSortField.LAST_NAME
        },
        {
            title: "Имя",
            field: UserField.FIRST_NAME,
            filterSortFieldName: FilterSortField.FIRST_NAME
        },
        {
            title: "Отчество",
            field: UserField.SECOND_NAME,
            filterSortFieldName: FilterSortField.SECOND_NAME
        },
        {
            title: "Логин",
            field: UserField.LOGIN,
            filterSortFieldName: FilterSortField.LOGIN
        }
    ])

    useEffect(() => {
        setUsersLoadingStatus(LoadingStatusType.LOADING)
        const params = {
            filterField: filteringFieldName,
            filterString: filteringFieldValue
        }
        axiosApi.get(`${ENDPOINT_USERS}/Count`, { params })
            .then(res => {
                setTotalUsersCount(res.data)
                setUsersLoadingStatus(LoadingStatusType.LOADED)
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось получить число всех пользователей:\n${getServerErrorResponse(err)}` })
                setUsersLoadingStatus(LoadingStatusType.LOAD_ERROR)
            })

    }, [filteringFieldName, filteringFieldValue])

    useEffect(() => {
        const getUsers = () => {
            setUsersLoadingStatus(LoadingStatusType.LOADING)
            const params = {
                limit: usersPerPage,
                offset: (currentPage - 1) * usersPerPage,
                ...(filteringFieldName && { filterField: filteringFieldName }),
                ...(filteringFieldName && { filterString: filteringFieldValue }),
            }
            axiosApi.get(ENDPOINT_USERS, { params })
                .then(res => {
                    setUsers(res.data)
                    setUsersLoadingStatus(LoadingStatusType.LOADED)
                })
                .catch(err => {
                    addNotification({ type: "danger", title: "Ошибка", message: `Не удалось загрузить список пользователей:\n${getServerErrorResponse(err)}` })
                    setUsersLoadingStatus(LoadingStatusType.LOAD_ERROR)
                })
        }
        getUsers()
    }, [filteringFieldName, filteringFieldValue, currentPage, usersPerPage])

    const onFieldFilterSelect = (option: string) => {
        const field = headers.find(el => el.title === option)?.field
        let filterField: FilterSortField | undefined = undefined
        switch (field) {
            case UserField.FIRST_NAME:
                filterField = FilterSortField.FIRST_NAME
                break
            case UserField.SECOND_NAME:
                filterField = FilterSortField.SECOND_NAME
                break
            case UserField.LAST_NAME:
                filterField = FilterSortField.LAST_NAME
                break
            case UserField.LOGIN:
                filterField = FilterSortField.LOGIN
                break
        }
        setFilteringFieldName(filterField)
    }

    const onFieldFilterValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilteringFieldValue(e.target.value)
    }

    useEffect(() => {
        setCurrentProgramUsers(programUsers)
        setInitialProgramUsers(programUsers)
    }, [programUsers])

    const onSubmit = useCallback(() => {
        const newUsers = currentProgramUsers.filter(programUser =>
            !initialProgramUsers.find(initialProgramUser =>
                programUser.userId === initialProgramUser.userId
            ))

        const deletedUsersIds = initialProgramUsers.filter(initialProgramUser =>
            !currentProgramUsers.find(programUser => initialProgramUser.userId === programUser.userId
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
                setInitialProgramUsers(currentProgramUsers)
                addNotification({ type: "success", title: "Успех", message: "Обучающиеся программы обновлены" })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось обновить обучающихся программы:\n${getServerErrorResponse(err)}` })
            })

    }, [initialProgramUsers, currentProgramUsers, program])

    const onDeleteUserFromProgram = (index: number) => {
        setCurrentProgramUsers(currentProgramUsers.filter((el, key) => key !== index))
    }

    const onAddUserToProgram = (index: number) => {
        const user: UserProfileType = {
            ...users[index]
        }
        if (currentProgramUsers.find(el => el.userId === user.userId)) {
            addNotification({ type: "warning", title: "Внимание", message: "Этот пользователь уже есть в программе" })
            return
        }
        setCurrentProgramUsers([...currentProgramUsers, user])
    }

    return (
        <Layout>
            <Head>
                <title>{`Обучающиеся программы обучения — ${program.title}`}</title>
            </Head>
            <div>
                <div className={utilStyles.title}>
                    Обучающиеся программы<br />{program.title}
                </div>
                <div className={styles.lists_container}>
                    <div className={utilStyles.section}>
                        <div className={utilStyles.section_title}>Список обучающихся программы</div>
                        <ItemList
                            headers={headers}
                            items={currentProgramUsers}
                            className={styles.user_list}
                            itemControlButtons={() => [
                                {
                                    title: "Удалить из программы",
                                    stretchable: true,
                                    onClick: onDeleteUserFromProgram
                                }
                            ]}
                        />
                    </div>
                    <div className={utilStyles.section}>
                        <div className={utilStyles.section_title}>Все обучающиеся</div>
                        <div className={styles.all_users_section}>
                            <LoadingStatusWrapper
                                status={usersLoadingStatus}
                            >
                                <ItemList
                                    headers={headers}
                                    items={users}
                                    className={styles.user_list}
                                    pageNavigation
                                    totalItemsCount={totalUsersCount}
                                    onPageClick={setCurrentPage}
                                    itemsPerPage={usersPerPage}
                                    itemControlButtons={() => [
                                        {
                                            title: "Добавить в программу",
                                            stretchable: true,
                                            onClick: onAddUserToProgram
                                        }
                                    ]}
                                />
                            </LoadingStatusWrapper>
                            <div className={styles.user_list_control_section}>
                                <p className={cn(utilStyles.text_medium, utilStyles.text_bold)}>Фильтрация</p>
                                <p className={utilStyles.text_small}>Поле:</p>
                                <ComboBox
                                    options={
                                        headers.map(el => (
                                            el.title
                                        ))
                                    }
                                    defaultValue={headers[0].title}
                                    onSelect={onFieldFilterSelect}
                                />
                                <p className={utilStyles.text_small}>Значение:</p>
                                <InputField
                                    className={styles.filter_field_value}
                                    inputClassName={styles.filter_field_value_input}
                                    onChange={onFieldFilterValueChanged}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    title="Сохранить"
                    size="small"
                    className={styles.save_button}
                    onClick={onSubmit}
                />
            </div>
        </Layout>
    )
}

export default EducationalProgramStudentsTemplate