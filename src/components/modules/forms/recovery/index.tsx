import React from "react"
import { Formik, Form, FormikValues, Field } from "formik"
import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import utilStyles from "styles/utils.module.scss"
import { composeValidators, maxLengthValueValidator, minLengthValueValidator, notEmptyValidator, passwordValidator } from "utils/validators"
import { RestorePasswordModel } from "components/templates/recovery/types"
import axiosApi from "utils/axios"
import { ENDPOINT_ACCOUNT } from "constants/endpoints"
import addNotification from "utils/notifications"
import { getServerErrorResponse } from "utils/serverData"

type RecoveryFormProps = {
    token: string,
    onSuccess: () => void
}

const RecoveryForm = ({
    token,
    onSuccess
}: RecoveryFormProps) => {

    const onSubmit = async (values: FormikValues) => {
        const data: RestorePasswordModel = {
            email: values.email,
            password: values.password,
            token
        }

        await axiosApi.post(`${ENDPOINT_ACCOUNT}/RestorePassword`, data)
            .then(res => {
                addNotification({ type: "success", title: "Успех", message: "Пароль был обновлён" })
                onSuccess()
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось обновить пароль:\n${getServerErrorResponse(err)}` })
            })
    }

    return (
        <Formik
            initialValues={{
                email: "",
                password: "",
                token
            }}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <Field
                        name="email"
                        component={InputField}
                        placeholder="Ваша почта"
                        size="large"
                        disabled={isSubmitting}
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
                        placeholder="Новый пароль"
                        size="large"
                        type="password"
                        disabled={isSubmitting}
                        validate={passwordValidator}
                    />
                    <div className={utilStyles.form_button_container}>
                        <Button
                            title="Обновить пароль"
                            size="small"
                            stretchable={true}
                            type="submit"
                            disabled={isSubmitting || !isValid}
                        />
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default RecoveryForm