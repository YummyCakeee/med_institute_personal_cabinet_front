import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import TextAreaField from "components/elements/formikComponents/textAreaField/TextAreaField"
import { CourseType } from "components/templates/courses/types"
import { ENDPOINT_COURSES } from "constants/endpoints"
import { Formik, Form, Field, FormikValues } from "formik"
import React from "react"
import axiosApi from "utils/axios"
import { notEmptyValidator } from "utils/validators"
import utilStyles from "styles/utils.module.scss"

interface CourseFormProps {
    mode: "add" | "edit",
    course?: CourseType,
    onSuccess?: (course: CourseType) => void,
    onError?: (error: any) => void
}


const CourseForm = ({
    mode,
    course,
    onSuccess = () => { },
    onError = () => { }
}: CourseFormProps) => {
    const onSubmit = async (values: FormikValues) => {
        let data: CourseType = {
            title: values.title,
            description: values.description
        }
        if (mode === "add") {
            return axiosApi.post(ENDPOINT_COURSES, data)
                .then(res => {
                    onSuccess(res.data)
                })
                .catch(err => {
                    onError(err)
                })
        }
        if (!course) return
        data.courseId = course.courseId
        return axiosApi.put(`${ENDPOINT_COURSES}/${course.courseId}`, data)
            .then(res => {
                const updatedCourse = {
                    ...course,
                    ...data
                }
                onSuccess(updatedCourse)
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
                    title: course?.title || "",
                    description: course?.description || ""
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