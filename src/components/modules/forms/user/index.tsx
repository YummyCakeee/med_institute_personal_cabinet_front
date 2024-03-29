import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import { Formik, Form, Field, FormikValues } from "formik"
import React from "react"
import { composeValidators, emailValidator, maxLengthValueValidator, minLengthValueValidator, notEmptyValidator, passwordValidator } from "utils/validators"
import utilStyles from "styles/utils.module.scss"
import { ApplicationUserRole, UserProfileType } from "components/templates/users/types"
import CheckboxField from "components/elements/formikComponents/checkboxField/CheckboxField"
import axiosApi from "utils/axios"
import { ENDPOINT_USERS } from "constants/endpoints"
import axios from "axios"
import addNotification from "utils/notifications"
import { getServerErrorResponse } from "utils/serverData"

interface UserFormProps {
    mode?: "add" | "edit",
    user?: UserProfileType,
    onSuccess?: (user: UserProfileType, emailSuccess: boolean) => void,
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
            const userData = {
                firstName: values.firstName,
                lastName: values.lastName,
                secondName: values.secondName,
                email: values.email,
                userName: values.email
            }
            let userId: string | null = null
            let emailSuccess = false
            await axiosApi.post(ENDPOINT_USERS, userData)
                .then(res => {
                    userId = res.data.userId
                    if (!(res.data.message as string).includes("Email failed")) {
                        emailSuccess = true
                    }
                })
                .catch(err => {
                    return addNotification({ type: "danger", title: "Ошибка", message: `Не удалось добавить нового пользователя:\n${getServerErrorResponse(err)}` })
                })
            if (userId === null) return
            const rolesData: string[] = values.roles
            return axiosApi.post(`${ENDPOINT_USERS}/${userId}/ChangeRoles`, rolesData)
                .then(res => {
                    const updatedUser: UserProfileType = {
                        ...userData,
                        userId: userId!,
                        user: {
                            email: userData.email,
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
                    onSuccess(updatedUser, emailSuccess)
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
                axiosApi.post(`${ENDPOINT_USERS}/UpdatePersonalDataOfUser`, userData),
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
                    onSuccess(updatedUser, true)
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
                        <Field
                            name="email"
                            component={InputField}
                            placeholder="Почта"
                            validate={emailValidator}
                            disabled={isSubmitting}
                        />
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