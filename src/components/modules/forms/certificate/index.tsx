import Button from "components/elements/button/Button"
import FileUploaderField from "components/elements/formikComponents/fileUploaderField"
import { ENDPOINT_USERS } from "constants/endpoints"
import { Field, Form, Formik, FormikHelpers, FormikValues } from "formik"
import React from "react"
import axiosApi from "utils/axios"
import { notEmptyValidator } from "utils/validators"
import utilStyles from "styles/utils.module.scss"

type CertificateFormProps = {
    onSuccess?: () => void,
    onError?: (error: any) => void
}

const CertificateForm = ({
    onSuccess = () => { },
    onError = () => { }
}: CertificateFormProps) => {

    const onSubmit = async (
        values: FormikValues,
        helpers: FormikHelpers<{
            file: File | undefined
        }>) => {

        const fd = new FormData()
        fd.append("file", values.file)
        await axiosApi.post(`${ENDPOINT_USERS}/UploadCertificate`, fd)
            .then(res => {
                onSuccess()
                helpers.resetForm()
            })
            .catch(err => {
                onError(err)
            })
    }

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{
                file: undefined as File | undefined
            }}
            enableReinitialize
            validateOnMount
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <Field
                        name="file"
                        component={FileUploaderField}
                        type="file"
                        disabled={isSubmitting}
                        validate={notEmptyValidator}
                        accept=".jpeg, .pdf, .png"
                    />
                    <div className={utilStyles.form_button_container}>
                        <Button
                            title="Загрузить"
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

export default CertificateForm