import { EduFileType, ExerciseCommentType, SolvedTestType, UserExerciseType } from "components/templates/education/types"
import { useModalWindowContext } from "context/modalWindowContext"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import styles from "./Exercise.module.scss"
import cn from "classnames"
import FileLoader from "components/modules/fileLoader"
import { convertSecondsToFullTime } from "utils/formatters"
import { Field, Form, Formik, FormikHelpers, FormikValues } from "formik"
import InputField from "components/elements/formikComponents/inputField/InputField"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import Button from "components/elements/button/Button"
import TextAreaField from "components/elements/formikComponents/textAreaField/TextAreaField"
import { notEmptyValidator } from "utils/validators"
import addNotification from "utils/notifications"
import axiosApi from "utils/axios"
import { ENDPOINT_EDUCATION } from "constants/endpoints"
import ExerciseComments from "components/modules/exerciseComments"
import FileUploaderField from "components/elements/formikComponents/fileUploaderField"

type ExerciseTemplateProps = {
    test: SolvedTestType
}

const ExerciseTemplate = ({
    test
}: ExerciseTemplateProps) => {

    const [initialTest, setInitialTest] = useState<SolvedTestType>()
    const router = useRouter()
    const [currentExerciceIndex, setCurrentExerciceIndex] = useState(-1)
    const downloadFileRef = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
        setInitialTest(test)
    }, [test])

    const onFileUpload = async (
        values: FormikValues,
        helpers: FormikHelpers<{
            file: File | undefined,
            fileName: string;
            fileDescription: string;
        }>) => {
        if (!initialTest) return
        let serverFileName = ""
        const fd = new FormData()
        fd.append("file", values.file)
        await axiosApi.post(`${ENDPOINT_EDUCATION}/UploadFile`, fd)
            .then(res => {
                serverFileName = res.data.filename
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось загрузить файл:\n${err.code}` })
                return
            })
        const { programId, courseId, themeId } = router.query
        const data: UserExerciseType = {
            ...initialTest.userExercises[currentExerciceIndex],
            file: {
                fileName: values.fileName,
                fileDescription: values.fileDescription,
                fileLink: serverFileName
            }
        }
        await axiosApi.put(`${ENDPOINT_EDUCATION}/Programs/${programId}/Courses/${courseId}/Themes/${themeId}/TestBlock/Exercise`, data)
            .then(res => {
                setInitialTest({
                    ...initialTest,
                    userExercises: initialTest.userExercises.map((el, key) => {
                        if (key !== currentExerciceIndex)
                            return el
                        return data
                    })
                })
                addNotification({ type: "success", title: "Успех", message: "Файл загружен" })
                setCurrentExerciceIndex(-1)
                helpers.resetForm()
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось загрузить файл:\n${err.code}` })
            })
    }

    const onCommentSend = async (comment: string, exerciseIndex: number) => {
        if (!initialTest) return
        const { programId, courseId, themeId } = router.query
        const currentExercice = initialTest.userExercises[exerciseIndex]
        const newComment: ExerciseCommentType = {
            text: comment
        }
        const data: UserExerciseType = {
            exerciseText: currentExercice.exerciseText,
            rating: currentExercice.rating,
            teacherComments: [],
            userComments: [newComment],
        }
        return axiosApi.put(`${ENDPOINT_EDUCATION}/Programs/${programId}/Courses/${courseId}/Themes/${themeId}/TestBlock/Exercise`, data)
            .then(res => {
                setInitialTest({
                    ...initialTest,
                    userExercises: initialTest.userExercises.map((el, key) => {
                        if (key !== exerciseIndex) return el
                        return {
                            ...el,
                            userComments: [...(el.userComments || []), { text: newComment.text, dateTime: new Date().toISOString() }]
                        }
                    })
                })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось отправить комментарий:\n${err.code}` })
                return Promise.reject()
            })
    }

    const onGiveExerciseAnswerClick = (index: number) => {
        setCurrentExerciceIndex(index)
    }

    const onAttachedFileDownload = async (file: EduFileType) => {
        const params = {
            filename: file.fileLink
        }
        axiosApi.get(`${ENDPOINT_EDUCATION}/DownloadFile`, { params, responseType: "blob" })
            .then(res => {
                let url = window.URL.createObjectURL(res.data);
                if (downloadFileRef.current) {
                    const extension = file.fileLink.match(/.*(\..*)$/)
                    downloadFileRef.current.href = url
                    downloadFileRef.current.download = `${file.fileName}${extension?.length ? extension[1] : "txt"}`
                    downloadFileRef.current.click()
                }
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось скачать файл:\n${err.code}` })
            })
    }

    return (
        <Layout>
            <Head>
                <title>Упражнения</title>
            </Head>
            <div className={styles.container}>
                {initialTest?.userExercises.map((userExercise, userExerciseKey) => (
                    <div
                        className={styles.exercise_container}
                        key={userExerciseKey}
                    >
                        <div className={styles.exercise_section}>
                            <div className={styles.exercise_title}>
                                {`Упражнение ${userExerciseKey + 1}`}
                            </div>
                            <div className={styles.exercise_text}>
                                {userExercise.exerciseText}
                            </div>
                            {userExercise.file ?
                                <div className={styles.exercise_file_info}>
                                    <div>Вы прикрепили файл</div>
                                    <div className={styles.exercise_file_name}>Название:{' '}
                                        <span onClick={() => onAttachedFileDownload(userExercise.file!)}>
                                            {userExercise.file.fileName}
                                        </span>
                                        <a ref={downloadFileRef} target="_blank" rel="noreferrer" download></a>
                                    </div>
                                    <div className={styles.exercise_file_description}>Описание: <span>{userExercise.file.fileDescription}</span></div>
                                </div> :
                                <div className={styles.exercise_file_absent}>
                                    Вы ещё не прикрепляли файл
                                </div>
                            }
                            {currentExerciceIndex === userExerciseKey ?
                                <div className={styles.exercise_file_new}>
                                    <div className={styles.exercise_file_new_title}>Прекрепить новый файл</div>
                                    <Formik
                                        initialValues={{
                                            file: undefined as File | undefined,
                                            fileName: "",
                                            fileDescription: ""
                                        }}
                                        onSubmit={onFileUpload}
                                    >
                                        {({ isSubmitting, isValid }) => (
                                            <>
                                                <Form>
                                                    <Field
                                                        name="file"
                                                        type="file"
                                                        component={FileUploaderField}
                                                        validate={notEmptyValidator}
                                                        accept=".doc, .docx, .pdf"
                                                    />
                                                    <Field
                                                        name="fileName"
                                                        component={InputField}
                                                        placeholder="Название файла"
                                                        validate={notEmptyValidator}
                                                        disabled={isSubmitting}
                                                    />
                                                    <Field
                                                        name="fileDescription"
                                                        component={TextAreaField}
                                                        placeholder="Описание файла"
                                                        validate={notEmptyValidator}
                                                        disabled={isSubmitting}
                                                    />
                                                    <Button
                                                        title="Отправить"
                                                        size="small"
                                                        disabled={isSubmitting || !isValid}
                                                        type="submit"
                                                    />
                                                </Form>
                                            </>
                                        )}
                                    </Formik>
                                </div> :
                                <div>
                                    <Button
                                        title={userExercise.file ? "Редактировать ответ" : "Добавить ответ"}
                                        stretchable={true}
                                        onClick={() => onGiveExerciseAnswerClick(userExerciseKey)}
                                    />
                                </div>
                            }
                        </div>
                        <ExerciseComments
                            {...{
                                mode: "student",
                                ...userExercise,
                                onCommentSend: (comment) => onCommentSend(comment, userExerciseKey)
                            }}
                        />
                    </div>
                ))}
            </div>
        </Layout>
    )
}

export default ExerciseTemplate