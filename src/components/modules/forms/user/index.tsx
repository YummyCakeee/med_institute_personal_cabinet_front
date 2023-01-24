import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import { Formik, Form, Field, FormikValues } from "formik"
import React from "react"
import { composeValidators, maxLengthValueValidator, minLengthValueValidator, notEmptyValidator, passwordValidator } from "utils/validators"
import utilStyles from "styles/utils.module.scss"
import { ApplicationUserRole, UserProfileType } from "components/templates/users/types"
import CheckboxField from "components/elements/formikComponents/checkboxField/CheckboxField"
import axiosApi from "utils/axios"
import { ENDPOINT_USERS } from "constants/endpoints"
import axios from "axios"
import addNotification from "utils/notifications"
import { getServerErrorResponse } from "utils/serverData"
import { Exception } from "sass"

interface UserFormProps {
    mode?: "add" | "edit",
    user?: UserProfileType,
    onSuccess?: (user: UserProfileType) => void,
    onError?: (error: any) => void
}


const UserForm = ({
    mode = "add",
    user,
    onSuccess = () => { },
    onError = () => { }
}: UserFormProps) => {

    const onSubmit = async (values: FormikValues) => {
        if (mode === "add") {
            const userSecurityData = {
                email: values.email,
                password: values.password
            }
            let userId: string | null = null
            await axiosApi.post(ENDPOINT_USERS, userSecurityData)
                .then(res => {
                    userId = res.data.userId
                })
                .catch(err => {
                    return addNotification({ type: "danger", title: "Ошибка", message: `Не удалось добавить нового пользователя:\n${getServerErrorResponse(err)}` })
                })
            const userData: UserProfileType = {
                userId: userId!,
                userName: userSecurityData.email,
                firstName: values.firstName,
                lastName: values.lastName,
                secondName: values.secondName,
            }
            const rolesData: string[] = values.roles
            return axios.all([
                axiosApi.post(`${ENDPOINT_USERS}/UpdatePersonalDataofUser`, userData),
                axiosApi.post(`${ENDPOINT_USERS}/${userId}/ChangeRoles`, rolesData)
            ])
                .then(res => {
                    const updatedUser: UserProfileType = {
                        ...userData,
                        user: {
                            email: userSecurityData.email,
                            userRoles: rolesData.map(el => {
                                const role: ApplicationUserRole = {
                                    role: {
                                        name: el
                                    }
                                }
                                return role
                            })
                        }
                    }
                    onSuccess(updatedUser)
                })
                .catch(err => {
                    onError(err)
                })
        }
        else if (user) {
            const userData: UserProfileType = {
                userId: user.userId,
                userName: user.userName,
                firstName: values.firstName,
                lastName: values.lastName,
                secondName: values.secondName,
            }
            const rolesData: string[] = values.roles
            return axios.all([
                axiosApi.post(`${ENDPOINT_USERS}/UpdatePersonalDataofUser`, userData),
                axiosApi.post(`${ENDPOINT_USERS}/${user.userId}/ChangeRoles`, rolesData)
            ])
                .then(res => {
                    const updatedUser: UserProfileType = {
                        ...user,
                        ...userData,
                        user: {
                            ...user.user,
                            userRoles: rolesData.map(el => {
                                const role: ApplicationUserRole = {
                                    role: {
                                        name: el
                                    }
                                }
                                return role
                            })
                        }
                    }
                    onSuccess(updatedUser)
                })
                .catch(err => {
                    onError(err)
                })
        }
    }

    const userRoles = [
        "Administrator",
        "Student",
        "Teacher"
    ]

    return (
        <Formik
            initialValues={mode === "add" ?
                {
                    lastName: "",
                    firstName: "",
                    secondName: "",
                    email: "",
                    password: "",
                    roles: []
                } :
                {
                    lastName: user?.lastName || "",
                    firstName: user?.firstName || "",
                    secondName: user?.secondName || "",
                    roles: user?.user?.userRoles?.map(el => el.role.name) || ""
                }
            }
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <Field
                        name="lastName"
                        component={InputField}
                        placeholder="Фамилия"
                        validate={(value: string) =>
                            composeValidators(value,
                                notEmptyValidator,
                                val => minLengthValueValidator(val, 2),
                                val => maxLengthValueValidator(val, 20)
                            )}
                        disabled={isSubmitting}
                    />
                    <Field
                        name="firstName"
                        component={InputField}
                        placeholder="Имя"
                        validate={(value: string) =>
                            composeValidators(value,
                                notEmptyValidator,
                                val => minLengthValueValidator(val, 2),
                                val => maxLengthValueValidator(val, 20)
                            )}
                        disabled={isSubmitting}
                    />
                    <Field
                        name="secondName"
                        component={InputField}
                        placeholder="Отчество"
                        validate={(value: string) =>
                            composeValidators(value,
                                notEmptyValidator,
                                val => minLengthValueValidator(val, 2),
                                val => maxLengthValueValidator(val, 20)
                            )}
                        disabled={isSubmitting}
                    />
                    {mode === "add" &&
                        <>
                            <Field
                                name="email"
                                component={InputField}
                                placeholder="Почта"
                                validate={(value: string) =>
                                    composeValidators(value,
                                        notEmptyValidator,
                                        val => minLengthValueValidator(val, 2)
                                    )}
                                disabled={isSubmitting}
                            />
                            <Field
                                name="password"
                                component={InputField}
                                placeholder="Пароль"
                                type="password"
                                validate={passwordValidator}
                                disabled={isSubmitting}
                            />
                        </>
                    }
                    <div className={utilStyles.form_text}>Роли:</div>
                    {userRoles.map((el, key) => (
                        <div key={key}>
                            <Field
                                name="roles"
                                component={CheckboxField}
                                disabled={isSubmitting}
                                validate={notEmptyValidator}
                                label={el}
                                type="checkbox"
                                value={el}
                            />
                        </div>
                    ))
                    }
                    <div className={utilStyles.form_button_container}>
                        <Button
                            title="Сохранить"
                            size="small"
                            type="submit"
                            disabled={isSubmitting || !isValid}
                        />
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default UserForm