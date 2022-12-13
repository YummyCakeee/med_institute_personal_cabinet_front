import React from "react"
import { Formik, Form, FormikValues, Field } from "formik"
import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import utilStyles from "styles/utils.module.scss"
import { composeValidators, maxLengthValueValidator, minLengthValueValidator, notEmptyValidator } from "utils/validators"
import Image from "next/image"

const ProfileInfoForm = () => {

    const onSubmit = async (values: FormikValues) => {
    }

    return (
        <Formik
            initialValues={{
                surname: "",
                name: "",
                patronymic: "",
                password: ""
            }}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <Field
                        name="surname"
                        component={InputField}
                        placeholder="Фамилия"
                        label="Фамилия:"
                        disabled={isSubmitting}
                        validate={(value: string) =>
                            composeValidators(value,
                                notEmptyValidator,
                                val => minLengthValueValidator(val, 3),
                                val => maxLengthValueValidator(val, 20)
                            )}
                    />
                    <Field
                        name="name"
                        component={InputField}
                        placeholder="Имя"
                        label="Имя:"
                        disabled={isSubmitting}
                        validate={(value: string) =>
                            composeValidators(value,
                                notEmptyValidator,
                                val => minLengthValueValidator(val, 3),
                                val => maxLengthValueValidator(val, 20)
                            )}
                    />
                    <Field
                        name="patronymic"
                        component={InputField}
                        placeholder="Отчество"
                        label="Отчество:"
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
                        placeholder="Пароль"
                        label="Пароль:"
                        type="password"
                        disabled={isSubmitting}
                        validate={(value: string) =>
                            composeValidators(value,
                                notEmptyValidator,
                                val => minLengthValueValidator(val, 3),
                                val => maxLengthValueValidator(val, 20)
                            )}
                    />
                    <Image
                        style={{ borderRadius: "50px", objectFit: "cover" }}
                        src={"https://get.pxhere.com/photo/person-people-portrait-facial-expression-hairstyle-smile-emotion-portrait-photography-134689.jpg"}
                        alt="Фото профиля"
                        width={100}
                        height={100}
                        quality={80}
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

export default ProfileInfoForm