import React from "react"
import { Formik, Form, FormikValues, Field } from "formik"
import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import utilStyles from "styles/utils.module.scss"
import { emailValidator, passwordValidator } from "utils/validators"
import axiosApi from "utils/axios"
import { ENDPOINT_ACCOUNT } from "constants/endpoints"
import addNotification from "utils/notifications"
import { getServerErrorResponse } from "utils/serverData"

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
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось зарегистрироваться:\n${getServerErrorResponse(err)}` })
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
                        validate={emailValidator}
                    />
                    <Field
                        name="password"
                        component={InputField}
                        placeholder="Пароль"
                        type="password"
                        size="large"
                        disabled={isSubmitting}
                        validate={passwordValidator}
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