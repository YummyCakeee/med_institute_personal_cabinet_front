import Layout from "components/layouts/Layout"
import ItemList from "components/modules/itemList"
import Head from "next/head"
import React from "react"
import useUsers from "./useUsers"
import styles from "./UsersTemplate.module.scss"
import ComboBox from "react-responsive-combo-box"
import 'react-responsive-combo-box/dist/index.css'
import InputField from "components/elements/input/Input"
import utilStyles from "styles/utils.module.scss"

const UsersTemplate = () => {
    const {
        headers,
        sortingFieldName,
        users,
        onUserDetailsClick,
        onUserEditClick,
        onUserDeleteClick,
        onUserBlockClick,
        onUserAddClick,
        onHeaderClick,
        onFieldFilterSelect,
        onFieldFilterValueChanged
    } = useUsers()

    const sortingFieldHeaderTitle = headers.find(el => el.field === sortingFieldName)?.title
    return (
        <Layout>
            <Head>
                <title>Пользователи</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.user_list_control}>
                    <div className={styles.user_list_control_section}>
                        <p className={utilStyles.text}>Сортировка:</p>
                        <p className={utilStyles.text_small}>{sortingFieldHeaderTitle ?
                            `По полю "${sortingFieldHeaderTitle}"` :
                            "Не выбрано"
                        }</p>
                    </div>
                    <div>
                        <p className={utilStyles.text}>Фильтрация</p>
                        <p className={utilStyles.text_small}>Поле:</p>
                        <ComboBox
                            options={[
                                'Не фильтровать',
                                ...headers.map(el => (
                                    el.title
                                ))
                            ]}
                            defaultValue="Не фильтровать"
                            editable={false}
                            onSelect={onFieldFilterSelect}
                            inputClassName={styles.combobox}
                        />
                        <p className={utilStyles.text_small}>Значение:</p>
                        <InputField
                            className={styles.filter_field_value}
                            inputClassName={styles.filter_field_value_input}
                            onChange={onFieldFilterValueChanged}
                        />
                    </div>
                </div>
                <ItemList
                    className={styles.user_list_container}
                    headers={headers}
                    items={users}
                    onHeaderClick={onHeaderClick}
                    pageNavigation
                    pagesCount={10}
                    itemControlButtons={({ items, selectedItem }) => [
                        {
                            title: "Детали",
                            onClick: onUserDetailsClick,
                            size: "small"
                        },
                        {
                            title: "Редактировать",
                            onClick: onUserEditClick,
                            size: "small",
                            stretchable: true
                        },
                        {
                            title: "Удалить",
                            onClick: onUserDeleteClick,
                            size: "small"
                        },
                        {
                            title: items && selectedItem !== null &&
                                items[selectedItem]?.blocked ?
                                "Разблокировать" : "Заблокировать",
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
            </div>
        </Layout>
    )
}

export default UsersTemplate