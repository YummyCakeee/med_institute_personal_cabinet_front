import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import { Formik, Form, Field, FormikValues } from "formik"
import React from "react"
import { composeValidators, maxLengthValueValidator, minLengthValueValidator, notEmptyValidator } from "utils/validators"
import utilStyles from "styles/utils.module.scss"
import { UserProfileType } from "components/templates/users/types"
import CheckboxField from "components/elements/formikComponents/checkboxField/CheckboxField"
import axiosApi from "utils/axios"
import { ENDPOINT_USERS } from "constants/endpoints"

interface UserFormProps {
    mode?: "add" | "edit",
    user?: UserProfileType
}


const UserForm = ({
    mode = "add",
    user
}: UserFormProps) => {

    const onSubmit = async (values: FormikValues) => {
        let data: UserProfileType = {
            firstName: values.firstName,
            lastName: values.lastName,
            secondName: values.secondName,
            user: {
                userName: values.login,
                email: values.email,
                userRoles: values.roles.map((el: string) => ({
                    role: {
                        name: el
                    }
                }))
            }

        }
        if (mode === "add") {
            return axiosApi.post(ENDPOINT_USERS, data)
                .then(res => {

                })
                .catch(err => {

                })

        }
        console.log(values)
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
                    login: "",
                    email: "",
                    roles: []

                } :
                {
                    lastName: user?.lastName || "",
                    firstName: user?.firstName || "",
                    secondName: user?.secondName || "",
                    login: user?.user?.userName || "",
                    email: user?.user?.email || "",
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
                    <Field
                        name="login"
                        component={InputField}
                        placeholder="Логин"
                        validate={(value: string) =>
                            composeValidators(value,
                                notEmptyValidator,
                                val => minLengthValueValidator(val, 2),
                                val => maxLengthValueValidator(val, 20)
                            )}
                        disabled={isSubmitting}
                    />
                    <Field
                        name="email"
                        component={InputField}
                        placeholder="Email"
                        validate={(value: string) =>
                            composeValidators(value,
                                notEmptyValidator,
                                val => minLengthValueValidator(val, 2),
                                val => maxLengthValueValidator(val, 20)
                            )}
                        disabled={isSubmitting}
                    />
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