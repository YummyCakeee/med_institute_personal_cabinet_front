import React from "react"
import { Formik, Form, FormikValues, Field } from "formik"
import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import utilStyles from "styles/utils.module.scss"
import { composeValidators, maxLengthValueValidator, minLengthValueValidator, notEmptyValidator } from "utils/validators"
import Image from "next/image"
import axiosApi from "utils/axios"
import { ENDPOINT_ACCOUNT } from "constants/endpoints"
import { UserProfileType } from "components/templates/users/types"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import Datetime from "components/elements/datetime"
import { Moment } from "moment"

type ProfileInfoFormProps = {
    onSuccess?: (user: UserProfileType) => void,
    onError?: (error: any) => void
}

const ProfileInfoForm = ({
    onSuccess = () => { },
    onError = () => { }
}: ProfileInfoFormProps) => {

    const user = useSelector(userSelector)
    const onSubmit = async (values: FormikValues) => {
        const data: UserProfileType = {
            userId: user.id,
            firstName: values.firstName,
            lastName: values.lastName,
            secondName: values.secondName,
            //dateOfBirth: values.dateOfBirth,
            userName: values.login
        }
        return axiosApi.post(`${ENDPOINT_ACCOUNT}/UpdatePersonalData`, data)
            .then(res => {
                const updatedUser = data
                onSuccess(updatedUser)
            })
            .catch(err => {
                onError(err)
            })
    }

    return (
        <Formik
            initialValues={{
                lastName: user.lastName,
                firstName: user.firstName,
                secondName: user.secondName,
                login: user.login,
                dateOfBirth: user.dateOfBirth
            }}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ isSubmitting, isValid, values, setValues }) => (
                <Form>
                    <Field
                        name="lastName"
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
                        name="firstName"
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
                        name="secondName"
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
                        name="dateOfBirth"
                        component={Datetime}
                        label="Дата рождения:"
                        time={false}
                        disabled={isSubmitting}
                        value={values.dateOfBirth ? new Date(values.dateOfBirth) : ""}
                        onChange={(e: Moment | string) => setValues({ ...values, dateOfBirth: (e as Moment)?.format() || new Date().toISOString() })}
                    />
                    <Field
                        name="login"
                        component={InputField}
                        placeholder="Логин"
                        label="Логин:"
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