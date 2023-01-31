import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import { ENDPOINT_EDUCATION } from "constants/endpoints"
import { Formik, Form, Field, FormikValues } from "formik"
import React from "react"
import axiosApi from "utils/axios"
import { notEmptyValidator } from "utils/validators"
import utilStyles from "styles/utils.module.scss"
import { UserExerciseType } from "components/templates/education/types"
import styles from "./ExerciseScoreForm.module.scss"

interface ExerciseScoreFormProps {
    exercise: UserExerciseType,
    themeId: string,
    userId: string,
    attemptDate: string,
    onSuccess?: (exercise: UserExerciseType) => void,
    onError?: (err: any) => void
}


const ExerciseScoreForm = ({
    exercise,
    themeId,
    userId,
    attemptDate,
    onSuccess = () => { },
    onError = () => { }
}: ExerciseScoreFormProps) => {
    const onSubmit = async (values: FormikValues) => {
        const data: UserExerciseType = {
            ...exercise,
            rating: values.score
        }
        return axiosApi.put(`${ENDPOINT_EDUCATION}/Themes/${themeId}/Attemp/${attemptDate}/User/${userId}/Finish/false`, data)
            .then(res => {
                onSuccess(data)
            })
            .catch(err => {
                onError(err)
            })
    }
    return (
        <Formik
            initialValues={
                {
                    score: ""
                }
            }
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <Field
                        name="score"
                        component={InputField}
                        placeholder="0"
                        validate={notEmptyValidator}
                        disabled={isSubmitting}
                        inputClassName={styles.score_input}
                    />
                    <div className={utilStyles.form_button_container}>
                        <Button
                            title={"Подтвердить"}
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

export default ExerciseScoreForm