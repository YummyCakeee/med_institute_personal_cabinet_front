import Layout from "components/layouts/Layout"
import ItemList from "components/modules/itemList"
import Head from "next/head"
import React, { useMemo } from "react"
import useUsers, { UserField } from "./useUsers"
import styles from "./UsersTemplate.module.scss"
import ComboBox from "components/elements/comboBox/ComboBox"
import InputField from "components/elements/input/Input"
import utilStyles from "styles/utils.module.scss"
import { ApplicationUserRole } from "./types"
import cn from "classnames"
import LoadingStatusWrapper from "components/modules/LoadingStatusWrapper/LoadingStatusWrapper"

const UsersTemplate = () => {
    const {
        headers,
        sortOrder,
        users,
        usersLoadingStatus,
        totalUsersCount,
        usersPerPage,
        sortingFieldHeaderTitle,
        onUserDetailsClick,
        onUserEditClick,
        onUserBlockClick,
        onUserAddClick,
        onHeaderClick,
        onFieldFilterSelect,
        onFieldFilterValueChanged,
        setCurrentPage
    } = useUsers()

    return (
        <Layout>
            <Head>
                <title>Пользователи</title>
            </Head>
            <div className={utilStyles.title}>Пользователи</div>
            <div className={utilStyles.section}>
                <div className={styles.container}>
                    <div className={styles.user_list_control}>
                        <div className={styles.user_list_control_section}>
                            <div className={cn(utilStyles.text_medium, utilStyles.text_bold)}>Сортировка</div>
                            <div className={utilStyles.text_small}>
                                {sortingFieldHeaderTitle ?
                                    <>
                                        По полю &quot;<span>{sortingFieldHeaderTitle}</span>&quot;
                                        (по {sortOrder === "Asc" ? "возр." : "убыв."})
                                    </> :
                                    <>
                                        Не выбрано
                                    </>
                                }
                            </div>
                        </div>
                        <div className={styles.user_list_control_section}>
                            <p className={cn(utilStyles.text_medium, utilStyles.text_bold)}>Фильтрация</p>
                            <p className={utilStyles.text_small}>Поле:</p>
                            <ComboBox
                                options={
                                    headers.slice(0, headers.length - 1).map(el => (
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
                    <LoadingStatusWrapper
                        status={usersLoadingStatus}
                    >
                        <ItemList
                            className={styles.user_list_container}
                            headers={headers}
                            items={users}
                            onHeaderClick={onHeaderClick}
                            pageNavigation
                            totalItemsCount={totalUsersCount}
                            itemsPerPage={usersPerPage}
                            onPageClick={setCurrentPage}
                            customFieldsRendering={[
                                {
                                    render: (value: ApplicationUserRole[]) =>
                                        value.map(el => el.role.name).join(', ')
                                    ,
                                    fieldName: UserField.ROLES
                                }
                            ]}
                            itemControlButtons={({ selectedItem }) => [
                                {
                                    title: "Подробнее",
                                    onClick: onUserDetailsClick,
                                    size: "small",
                                    stretchable: true
                                },
                                {
                                    title: "Редактировать",
                                    onClick: onUserEditClick,
                                    size: "small",
                                    stretchable: true
                                },
                                {
                                    title: (() => {
                                        const lockoutEnd = new Date(selectedItem.user.lockoutEnd)
                                        return lockoutEnd > new Date() ?
                                            "Разблокировать" : "Заблокировать"
                                    })(),
                                    onClick: onUserBlockClick,
                                    size: "small",
                                    stretchable: true,
                                }
                            ]}
                            controlButtonsBottom={[
                                {
                                    title: "Добавить",
                                    size: "small",
                                    onClick: onUserAddClick
                                }
                            ]}
                        />
                    </LoadingStatusWrapper>
                </div>
            </div>
        </Layout >
    )
}

export default UsersTemplate