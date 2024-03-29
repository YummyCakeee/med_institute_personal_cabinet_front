import React from "react"
import { Formik, Form, FormikValues, Field } from "formik"
import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import utilStyles from "styles/utils.module.scss"
import { composeValidators, emailValidator, maxLengthValueValidator, minLengthValueValidator, notEmptyValidator } from "utils/validators"
import axiosApi from "utils/axios"
import { ENDPOINT_ACCOUNT } from "constants/endpoints"
import addNotification from "utils/notifications"
import { getServerErrorResponse } from "utils/serverData"

type AutorizationFormProps = {
    onSuccess: () => void,
    onError: (error: any) => void
}

type UserLoginType = {
    userName: string,
    password: string
}

const AuthorizationForm = ({
    onSuccess,
    onError
}: AutorizationFormProps) => {

    const onSubmit = async (values: FormikValues) => {
        const data: UserLoginType = {
            userName: values.userName,
            password: values.password
        }
        await axiosApi.post(`${ENDPOINT_ACCOUNT}/Login`, data)
            .then(res => {
                if (res.status === 200) {
                    onSuccess()
                }
            })
            .catch(err => {
                onError(err)
            })
    }

    return (
        <Formik
            initialValues={{
                userName: "",
                password: ""
            }}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <Field
                        name="userName"
                        component={InputField}
                        placeholder="Ваш логин"
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
                        validate={(value: string) =>
                            composeValidators(value,
                                notEmptyValidator,
                                val => minLengthValueValidator(val, 6),
                                val => maxLengthValueValidator(val, 20)
                            )}
                    />
                    <div className={utilStyles.form_button_container}>
                        <Button
                            title="Войти"
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

export default AuthorizationForm