import React from "react"
import { Formik, Form, FormikValues, Field } from "formik"
import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import utilStyles from "styles/utils.module.scss"
import { composeValidators, maxLengthValueValidator, minLengthValueValidator, notEmptyValidator } from "utils/validators"
import axiosApi from "utils/axios"
import { ENDPOINT_ACCOUNT } from "constants/endpoints"
import addNotification from "utils/notifications"

type RegistrationFormProps = {
    onSuccess: () => void
}

type UserRegisterType = {
    email: string,
    password: string
}

const RegistrationForm = ({
    onSuccess
}: RegistrationFormProps) => {

    const onSubmit = async (values: FormikValues) => {
        const data: UserRegisterType = {
            email: values.email,
            password: values.password
        }
        return axiosApi.post(`${ENDPOINT_ACCOUNT}/Register`, data)
            .then(res => {
                if (res.status === 200) {
                    onSuccess()
                }
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось зарегистрироваться:\n${err.code}` })
                console.log(err)
            })
    }

    return (
        <Formik
            initialValues={{
                email: "",
                password: ""
            }}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <Field
                        name="email"
                        component={InputField}
                        placeholder="Email"
                        disabled={isSubmitting}
                        size="large"
                        validate={(value: string) =>
                            composeValidators(value,
                                notEmptyValidator,
                                val => minLengthValueValidator(val, 3),
                                val => maxLengthValueValidator(val, 20)
                            )}
                    />
                    <Field
                        name="password"
                        component={InputField}
                        placeholder="Пароль"
                        type="password"
                        size="large"
                        disabled={isSubmitting}
                        validate={(value: string) =>
                            composeValidators(value,
                                notEmptyValidator,
                                val => minLengthValueValidator(val, 3),
                                val => maxLengthValueValidator(val, 20)
                            )}
                    />
                    <div className={utilStyles.form_button_container}>
                        <Button
                            title="Зарегистрироваться"
                            stretchable
                            type="submit"
                            disabled={isSubmitting || !isValid}
                        />
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default RegistrationForm