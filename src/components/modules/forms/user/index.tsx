import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import { Formik, Form, Field, FormikValues } from "formik"
import React from "react"
import { composeValidators, maxLengthValueValidator, minLengthValueValidator, notEmptyValidator } from "utils/validators"
import utilStyles from "styles/utils.module.scss"
import { UserProfileType } from "components/templates/users/types"
import CheckboxField from "components/elements/formikComponents/checkboxField/CheckboxField"

interface UserFormProps {
    mode?: "add" | "edit",
    user?: UserProfileType
}


const UserForm = ({
    mode = "add",
    user
}: UserFormProps) => {

    const onSubmit = async (values: FormikValues) => {
        console.log(values)
    }

    const userRoles = [
        "administrator",
        "student",
        "teacher"
    ]

    return (
        <Formik
            initialValues={mode === "add" ?
                {
                    surname: "",
                    name: "",
                    patronymic: "",
                    login: "",
                    email: "",
                    roles: []

                } :
                {
                    // surname: user?.surname || "",
                    // name: user?.name || "",
                    // patronymic: user?.patronymic || "",
                    // login: user?.login || "",
                    // email: user?.email || "",
                    // roles: user?.roles || ""
                }
            }
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <Field
                        name="surname"
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
                        name="name"
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
                        name="patronymic"
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