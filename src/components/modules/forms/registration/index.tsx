import React from "react"
import { Formik, Form, FormikValues, Field } from "formik"
import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import utilStyles from "styles/utils.module.scss"
import { composeValidators, emailValidator, maxLengthValueValidator, minLengthValueValidator, notEmptyValidator, passwordValidator } from "utils/validators"
import axiosApi from "utils/axios"
import { ENDPOINT_ACCOUNT } from "constants/endpoints"

type RegistrationFormProps = {
    onSuccess: () => void,
    onError: (error: any) => void
}

type UserRegisterType = {
    email: string,
    lastName: string,
    firstName: string,
    secondName: string
}

const RegistrationForm = ({
    onSuccess,
    onError
}: RegistrationFormProps) => {

    const onSubmit = async (values: FormikValues) => {
        const data: UserRegisterType = values as UserRegisterType
        return axiosApi.post(`${ENDPOINT_ACCOUNT}/Register`, data)
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
                email: "",
                lastName: "",
                firstName: "",
                secondName: ""
            }}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <Field
                        name="lastName"
                        component={InputField}
                        placeholder="Фамилия"
                        disabled={isSubmitting}
                        size="large"
                        validate={(value: string) =>
                            composeValidators(
                                value,
                                notEmptyValidator,
                                val => minLengthValueValidator(val, 2),
                                val => maxLengthValueValidator(val, 20)
                            )}
                    />
                    <Field
                        name="firstName"
                        component={InputField}
                        placeholder="Имя"
                        disabled={isSubmitting}
                        size="large"
                        validate={(value: string) =>
                            composeValidators(
                                value,
                                notEmptyValidator,
                                val => minLengthValueValidator(val, 2),
                                val => maxLengthValueValidator(val, 20)
                            )}
                    />
                    <Field
                        name="secondName"
                        component={InputField}
                        placeholder="Отчество"
                        disabled={isSubmitting}
                        size="large"
                        validate={(value: string) =>
                            composeValidators(
                                value,
                                notEmptyValidator,
                                val => minLengthValueValidator(val, 2),
                                val => maxLengthValueValidator(val, 20)
                            )}
                    />
                    <Field
                        name="email"
                        component={InputField}
                        placeholder="Email"
                        disabled={isSubmitting}
                        size="large"
                        validate={emailValidator}
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