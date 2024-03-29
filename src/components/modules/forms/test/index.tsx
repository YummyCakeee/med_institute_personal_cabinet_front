import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import TextAreaField from "components/elements/formikComponents/textAreaField/TextAreaField"
import { Formik, Form, Field, FormikValues, FieldArray } from "formik"
import React from "react"
import { notEmptyValidator } from "utils/validators"
import { TestAnswerType, TestType } from "components/templates/testing/types"
import CheckboxField from "components/elements/formikComponents/checkboxField/CheckboxField"
import utilStyles from "styles/utils.module.scss"
import styles from "./Test.module.scss"
import { CrossIcon, PlusIcon } from "components/elements/icons"
import { TestTypeId } from "components/templates/testing/types"
import axiosApi from "utils/axios"
import { ENDPOINT_TESTS } from "constants/endpoints"
import { convertServerTestToClient } from "utils/serverData"

interface TestFormProps {
    mode: "add" | "edit",
    test?: TestType,
    collectionId: string,
    onSuccess?: (test: TestType) => void,
    onError?: (error: any) => void
}


const TestForm = ({
    mode,
    test,
    collectionId,
    onSuccess = () => { },
    onError = () => { }
}: TestFormProps) => {

    const onSubmit = async (values: FormikValues) => {
        if (values.answers.filter((el: TestAnswerType) => el.correct).length > 1) {
            values.manyAnswers = TestTypeId.MULTIPLE_ANSWERS
        }
        let testBody = {
            ...(values.fileAnswer ?
                {
                    ExerciseText: values.questionText
                } :
                {
                    QuestionText: values.questionText,
                    Answers: values.answers.map((el: TestAnswerType) => ({
                        Text: el.text,
                        Correct: el.correct
                    }))
                }
            ),
        }

        let data: TestType = {
            collectionId: collectionId,
            testBody: JSON.stringify(testBody),
            testTypeId: values.fileAnswer ?
                TestTypeId.FILE_ANSWER :
                values.manyAnswers ?
                    TestTypeId.MULTIPLE_ANSWERS :
                    TestTypeId.ONE_ANSWER
        }

        if (mode === "add" && collectionId !== undefined) {
            return axiosApi.post(ENDPOINT_TESTS, data)
                .then(res => {
                    const test = convertServerTestToClient(res.data)
                    onSuccess(test)
                })
                .catch(err => {
                    onError(err)
                })
        }
        data.testId = test?.testId
        return await axiosApi.put(`${ENDPOINT_TESTS}/${test?.testId}`, data)
            .then(res => {
                const updatedTest = {
                    ...test,
                    ...data
                }
                onSuccess(updatedTest)
            })
            .catch(err => {
                onError(err)
            })
    }

    return (
        <Formik
            initialValues={mode === "add" ?
                {
                    questionText: "",
                    answers: [],
                    fileAnswer: false,
                    manyAnswers: false
                } :
                {
                    questionText: test?.questionText || "",
                    answers: test?.answers || [],
                    fileAnswer: test?.testTypeId === TestTypeId.FILE_ANSWER,
                    manyAnswers: test?.testTypeId === TestTypeId.MULTIPLE_ANSWERS
                }
            }
            onSubmit={onSubmit}
            enableReinitialize
            validateOnBlur
            validateOnChange
        >
            {({ isSubmitting, isValid, values }) => (
                <Form>
                    <Field
                        name="questionText"
                        component={TextAreaField}
                        placeholder="Текст вопроса"
                        validate={notEmptyValidator}
                        disabled={isSubmitting}
                    />
                    <Field
                        name="fileAnswer"
                        label="С ответом в виде файла"
                        component={CheckboxField}
                        type="checkbox"
                    />
                    {!values.fileAnswer &&
                        <>
                            {values.answers.filter(el => el.correct).length == 1 &&
                                <div className={styles.many_answers_checkbox_container}>
                                    <Field
                                        name="manyAnswers"
                                        label="Пометить как вопрос с несколькими верными ответами"
                                        component={CheckboxField}
                                        type="checkbox"
                                    />
                                </div>
                            }
                            <FieldArray
                                name="answers"
                                render={arrayHelpers => (
                                    <div
                                        className={styles.answers_container}

                                    >
                                        <div className={styles.answer_list}>
                                            {values.answers.map((el: TestAnswerType, index: number) => (
                                                <div
                                                    className={styles.answer}
                                                    key={index}
                                                >
                                                    <Field
                                                        name={`answers[${index}].text`}
                                                        component={InputField}
                                                        size="medium"
                                                        validate={notEmptyValidator}
                                                        placeholder="Ответ"
                                                    />
                                                    <div className={styles.answer_checkbox_correct}>
                                                        <Field
                                                            name={`answers[${index}].correct`}
                                                            component={CheckboxField}
                                                            checked={el.correct}
                                                            label="Верно"
                                                        />
                                                    </div>
                                                    <CrossIcon
                                                        className={styles.answer_remove}
                                                        onClick={() => arrayHelpers.remove(index)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <PlusIcon
                                                className={styles.answer_add}
                                                onClick={() => arrayHelpers.push({ text: "", correct: false })}
                                            />
                                        </div>
                                    </div>
                                )}
                            />
                        </>
                    }
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

export default TestForm