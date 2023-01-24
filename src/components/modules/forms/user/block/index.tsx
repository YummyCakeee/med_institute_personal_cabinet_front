import Button from "components/elements/button/Button"
import { Formik, Form, Field, FormikValues } from "formik"
import React, { useMemo } from "react"
import utilStyles from "styles/utils.module.scss"
import { UserProfileType } from "components/templates/users/types"
import moment, { Moment } from 'moment';
import Datetime from "components/elements/datetime"
import axiosApi from "utils/axios"
import { ENDPOINT_ACCOUNT } from "constants/endpoints"
import { toISOStringWithTimeZone } from "utils/formatters"

interface UserBlockFormProps {
    user: UserProfileType,
    onSuccess?: (result: "blocked" | "unblocked", lockoutEnd: string) => void,
    onError?: (error: any) => void
    onDismiss?: () => void
}


const UserBlockForm = ({
    user,
    onSuccess = () => { },
    onError = () => { },
    onDismiss = () => { }
}: UserBlockFormProps) => {

    const onSubmit = async (values: FormikValues) => {
        const params = {
            lockoutEnd: mode === "block" ? values.lockoutEnd : new Date().toISOString(),
            userId: user.userId
        }
        return axiosApi.post(`${ENDPOINT_ACCOUNT}/Lockout/${user.userId}`, null, { params })
            .then(res => {
                onSuccess(mode === "block" ? "blocked" : "unblocked", params.lockoutEnd)
            })
            .catch(err => {
                onError(err)
            })
    }

    const mode: "block" | "unblock" = useMemo(() => {
        if (user.user?.lockoutEnd &&
            new Date(user.user.lockoutEnd) > new Date())
            return "unblock"
        return "block"
    }, [user])

    return (
        <Formik
            initialValues={
                {
                    lockoutEnd: mode === "unblock" ? user.user!.lockoutEnd! : new Date().toISOString()
                }
            }
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ isSubmitting, values, setValues }) => (
                <Form>
                    {mode === "block" &&
                        <>
                            <div className={utilStyles.modal_window_text}>Заблокировать до:</div>
                            <Field
                                name="lockoutEnd"
                                component={Datetime}
                                disabled={isSubmitting}
                                value={new Date(values.lockoutEnd)}
                                onChange={(e: string) => setValues({ lockoutEnd: e.length === 0 ? "" : toISOStringWithTimeZone(e) })}
                            />
                        </>
                    }
                    <div className={utilStyles.modal_window_buttons_list}>
                        <div className={utilStyles.modal_window_button}>
                            <Button
                                title={mode === "block" ? "Подтвердить" : "Разблокировать"}
                                size="small"
                                stretchable={true}
                                type="submit"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className={utilStyles.modal_window_button}>
                            <Button
                                title="Нет"
                                size="small"
                                onClick={onDismiss}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default UserBlockForm