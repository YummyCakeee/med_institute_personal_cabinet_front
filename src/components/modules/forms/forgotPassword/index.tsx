import React from "react"
import { Formik, Form, FormikValues, Field } from "formik"
import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import utilStyles from "styles/utils.module.scss"
import { emailValidator } from "utils/validators"
import addNotification from "utils/notifications"
import axiosApi from "utils/axios"
import { ENDPOINT_ACCOUNT } from "constants/endpoints"
import { getServerErrorResponse } from "utils/serverData"
import { useRouter } from "next/router"
import { ROUTE_RECOVERY } from "constants/routes"

const ForgotPasswordForm = () => {

    const router = useRouter()
    const onSubmit = async (values: FormikValues) => {
        const params = {
            email: values.email
        }
        await axiosApi.get(`${ENDPOINT_ACCOUNT}/ForgotPassword`, { params })
            .then(res => {
                addNotification({ type: "info", title: "Информация", message: "На Вашу почту, привязанную к логину, было отправлено письмо, вы можете закрыть эту страницу" })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось отправить письмо:\n${getServerErrorResponse(err)}` })
            })
    }

    return (
        <Formik
            initialValues={{
                email: ""
            }}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <Field
                        name="email"
                        component={InputField}
                        placeholder="Ваша почта"
                        size="email"
                        disabled={isSubmitting}
                        validate={emailValidator}
                    />
                    <div className={utilStyles.form_button_container}>
                        <Button
                            title="Отправить письмо"
                            size="medium"
                            type="submit"
                            disabled={isSubmitting || !isValid}
                        />
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default ForgotPasswordForm