import React from "react"
import { Formik, Form, FormikValues, Field } from "formik"
import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import utilStyles from "styles/utils.module.scss"
import { composeValidators, maxLengthValueValidator, minLengthValueValidator, notEmptyValidator } from "utils/validators"
import { Store } from "react-notifications-component"

const RecoveryForm = () => {

    const onSubmit = async (values: FormikValues) => {
        Store.addNotification({
            type: "info",
            message: "На Вашу почту, привязанную к логину, было отправлено письмо",
            container: "top-right",
            dismiss: {
                onScreen: true,
                duration: 6000
            }
        })
    }

    return (
        <Formik
            initialValues={{
                login: ""
            }}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <Field
                        name="login"
                        component={InputField}
                        placeholder="Ваш логин"
                        fieldSize="large"
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

export default RecoveryForm