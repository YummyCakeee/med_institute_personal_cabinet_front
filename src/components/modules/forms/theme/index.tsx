import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import { CourseType, ThemeType } from "components/templates/courses/types"
import { ENDPOINT_COURSES, getCourseThemesEndpoint } from "constants/endpoints"
import { Formik, Form, Field, FormikValues } from "formik"
import React from "react"
import axiosApi from "utils/axios"
import { notEmptyValidator } from "utils/validators"
import utilStyles from "styles/utils.module.scss"

interface ThemeFormProps {
    mode: "add" | "edit",
    theme?: ThemeType,
    course: CourseType,
    onSuccess?: (theme: ThemeType) => void,
    onError?: (err: any) => void
}


const ThemeForm = ({
    mode,
    theme,
    course,
    onSuccess = () => { },
    onError = () => { }
}: ThemeFormProps) => {
    const onSubmit = async (values: FormikValues) => {
        if (mode === "add") {
            const data = {
                courseId: course.courseId,
                title: values.title,
                html: "<div></div>",
                sortOrder: 0
            }
            return axiosApi.post(getCourseThemesEndpoint(course.courseId!), data)
                .then(res => {
                    const theme: ThemeType = res.data
                    onSuccess(theme)
                })
                .catch(err => {
                    onError(err)
                })
        }
        if (!theme) return
        const data = {
            title: values.title,
            html: theme.html
        }
        return axiosApi.put(`${ENDPOINT_COURSES}/Themes/${theme.themeId}`, data)
            .then(res => {
                const updatedTheme: ThemeType = {
                    ...theme,
                    ...data
                }
                onSuccess(updatedTheme)
            })
            .catch(err => {
                onError(err)
            })
    }
    return (
        <Formik
            initialValues={mode === "add" ?
                {
                    title: ""
                } :
                {
                    title: theme?.title || "",
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
                        placeholder="Название темы"
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

export default ThemeForm