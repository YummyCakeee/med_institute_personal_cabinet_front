import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import TextAreaField from "components/elements/formikComponents/textAreaField/TextAreaField"
import { ENDPOINT_PROGRAMS } from "constants/endpoints"
import { Formik, Form, Field, FormikValues } from "formik"
import React from "react"
import axiosApi from "utils/axios"
import { notEmptyValidator } from "utils/validators"
import utilStyles from "styles/utils.module.scss"
import { ProgramType } from "components/templates/educationalPrograms/types"

interface EducationalProgramFormProps {
    mode: "add" | "edit",
    program?: ProgramType,
    onSuccess?: (program: ProgramType) => void,
    onError?: (error: any) => void
}


const EducationalProgramForm = ({
    mode,
    program,
    onSuccess = () => { },
    onError = () => { }
}: EducationalProgramFormProps) => {
    const onSubmit = async (values: FormikValues) => {
        let data: ProgramType = {
            title: values.title,
            description: values.description
        }
        if (mode === "add") {
            return axiosApi.post(ENDPOINT_PROGRAMS, data)
                .then(res => {
                    onSuccess(res.data)
                })
                .catch(err => {
                    onError(err)
                })
        }
        if (!program) return
        data.programId = program.programId
        return axiosApi.put(`${ENDPOINT_PROGRAMS}/${program.programId}`, data)
        .then(res => {
            const updatedProgram = {
                ...program,
                ...data
            }
            onSuccess(updatedProgram)
        })
        .catch(err => {
            onError(err)
        })
    }
    return (
        <Formik
            initialValues={mode === "add" ?
                {
                    title: "",
                    description: ""
                } :
                {
                    title: program?.title || "",
                    description: program?.description || ""
                }
            }
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <Field
                        name="title"
                        component={InputField}
                        placeholder="Название программы"
                        validate={notEmptyValidator}
                        disabled={isSubmitting}
                    />
                    <Field
                        name="description"
                        component={TextAreaField}
                        placeholder="Описание программы"
                        validate={notEmptyValidator}
                        disabled={isSubmitting}
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

export default EducationalProgramForm