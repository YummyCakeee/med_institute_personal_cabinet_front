import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import TextAreaField from "components/elements/formikComponents/textAreaField/TextAreaField"
import { CourseType } from "components/templates/courses/useCourses"
import { ENDPOINT_COURSES } from "constants/endpoints"
import { Formik, Form, Field, FormikValues } from "formik"
import React from "react"
import axiosApi from "utils/axios"
import { notEmptyValidator } from "utils/validators"
import utilStyles from "styles/utils.module.scss"

interface CourseFormProps {
    mode?: "add" | "edit",
    course?: CourseType
}


const CourseForm = ({
    mode = "add",
    course
}: CourseFormProps) => {
    const onSubmit = async (values: FormikValues) => {
        if (mode === "add") {
            const data = {
                title: values.title,
                description: values.description
            }
            return await axiosApi.post(ENDPOINT_COURSES, data)
                .then(res => {
                    console.log(res.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    return (
        <Formik
            initialValues={mode === "add" ?
                {
                    title: "",
                    description: ""
                } :
                {
                    title: course?.title ? course.title : "",
                    description: course?.description ? course.description : ""
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
                        placeholder="Название курса"
                        validate={notEmptyValidator}
                        disabled={isSubmitting}
                    />
                    <Field
                        name="description"
                        component={TextAreaField}
                        placeholder="Описание курса"
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

export default CourseForm