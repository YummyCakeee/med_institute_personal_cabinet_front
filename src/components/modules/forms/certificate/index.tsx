import Button from "components/elements/button/Button"
import FileUploaderField from "components/elements/formikComponents/fileUploaderField"
import { ENDPOINT_USERS } from "constants/endpoints"
import { Field, Form, Formik, FormikHelpers, FormikValues } from "formik"
import React from "react"
import axiosApi from "utils/axios"
import { notEmptyValidator } from "utils/validators"
import utilStyles from "styles/utils.module.scss"
import { CertificateType, UserProfileType } from "components/templates/users/types"
import { ProgramType } from "components/templates/educationalPrograms/types"

type CertificateFormProps = {
    user: UserProfileType,
    program: ProgramType,
    onSuccess?: (certificate: CertificateType) => void,
    onError?: (error: any) => void
}

const CertificateForm = ({
    user,
    program,
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
        await axiosApi.post(`${ENDPOINT_USERS}/${user.userId}/Program/${program.programId}/UploadCertificate`, fd)
            .then(res => {
                const certificate: CertificateType = {
                    name: res.data.filename,
                    date: new Date().toISOString()
                }
                onSuccess(certificate)
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