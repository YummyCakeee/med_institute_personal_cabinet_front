import React from "react"
import { Formik, Form, FormikValues, Field } from "formik"
import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import utilStyles from "styles/utils.module.scss"
import { composeValidators, maxLengthValueValidator, minLengthValueValidator, notEmptyValidator } from "utils/validators"
import axiosApi from "utils/axios"
import { ENDPOINT_ACCOUNT } from "constants/endpoints"

type ProfilePasswordFormProps = {
    onSuccess?: () => void,
    onError?: (error: any) => void
}

const ProfilePasswordForm = ({
    onSuccess = () => { },
    onError = () => { }
}: ProfilePasswordFormProps) => {


    const onSubmit = async (values: FormikValues) => {
        const data = {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword
        }
        return axiosApi.post(`${ENDPOINT_ACCOUNT}/ChangePassword`, data)
            .then(res => {
                onSuccess()
            })
            .catch(err => {
                onError(err)
            })
    }

    return (
        <Formik
            initialValues={{
                oldPassword: "",
                newPassword: ""
            }}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <Field
                        name="oldPassword"
                        component={InputField}
                        placeholder="Текущий пароль"
                        label="Текущий пароль:"
                        type="password"
                        disabled={isSubmitting}
                        validate={(value: string) =>
                            composeValidators(value,
                                notEmptyValidator,
                                val => minLengthValueValidator(val, 3),
                                val => maxLengthValueValidator(val, 20)
                            )}
                    />
                    <Field
                        name="newPassword"
                        component={InputField}
                        placeholder="Новый пароль"
                        label="Новый пароль:"
                        type="password"
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

export default ProfilePasswordForm