import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import { Formik, Form, Field, FormikValues } from "formik"
import React from "react"
import { notEmptyValidator } from "utils/validators"
import utilStyles from "styles/utils.module.scss"
import { EduFileType } from "components/templates/education/types"
import TextAreaField from "components/elements/formikComponents/textAreaField/TextAreaField"

interface ThemeFileFormProps {
    mode: "add" | "edit",
    file: EduFileType,
    onConfirm?: (file: EduFileType) => void
}


const ThemeFileForm = ({
    mode,
    file,
    onConfirm = () => { }
}: ThemeFileFormProps) => {
    const onSubmit = async (values: FormikValues) => {
        const updatedFile: EduFileType = {
            fileName: values.fileName,
            fileDescription: values.fileDescription,
            fileLink: file.fileLink
        }
        return onConfirm(updatedFile)
    }
    return (
        <Formik
            initialValues={
                {
                    fileName: file.fileName || "",
                    fileDescription: file.fileDescription || ""
                }
            }
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <Field
                        name="fileName"
                        component={InputField}
                        placeholder="Название"
                        validate={notEmptyValidator}
                        disabled={isSubmitting}
                    />
                    <Field
                        name="fileDescription"
                        component={TextAreaField}
                        placeholder="Описание"
                        validate={notEmptyValidator}
                        disabled={isSubmitting}
                    />
                    <div className={utilStyles.form_button_container}>
                        <Button
                            title={mode === "add" ? "Добавить" : "Сохранить"}
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

export default ThemeFileForm