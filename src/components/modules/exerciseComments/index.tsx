import Button from "components/elements/button/Button"
import TextAreaField from "components/elements/formikComponents/textAreaField/TextAreaField"
import { ExerciseCommentType } from "components/templates/education/types"
import { Formik, Form, Field, FormikValues, FormikHelpers } from "formik"
import React, { useEffect, useMemo, useRef } from "react"
import { notEmptyValidator } from "utils/validators"
import styles from "./ExerciseComments.module.scss"
import cn from "classnames"

type ExerciseCommentsProps = {
    mode: "teacher" | "student",
    userComments?: ExerciseCommentType[],
    teacherComments?: ExerciseCommentType[],
    onCommentSend?: (comment: string) => Promise<any>,
    readOnly?: boolean,
    className?: string
}

export type CommentType = ExerciseCommentType & {
    sender: "teacher" | "student"
}

const ExerciseComments = ({
    mode,
    userComments,
    teacherComments,
    onCommentSend,
    readOnly = false,
    className
}: ExerciseCommentsProps) => {

    const commentsEndRef = useRef<HTMLDivElement>(null)
    const comments: CommentType[] = useMemo(() => {
        const allComments: CommentType[] = []
        userComments?.forEach(el => {
            allComments.push({
                ...el,
                sender: "student"
            })
        })
        teacherComments?.forEach(el => {
            allComments.push({
                ...el,
                sender: "teacher"
            })
        })

        return allComments
    }, [userComments, teacherComments])

    useEffect(() => {
        if (commentsEndRef.current)
            commentsEndRef.current.scrollIntoView({
                behavior: "smooth"
            })
    }, [comments])

    const onSubmit = async (
        values: FormikValues,
        helpers: FormikHelpers<{ comment: string }>) => {
        if (!onCommentSend) return
        await onCommentSend(values.comment)
            .then(res => {
                helpers.resetForm()
            })
            .catch(err => {

            })
    }

    return (
        <div className={cn(
            styles.container,
            className
        )}>
            <div className={styles.comments_title}>Коммментарии к упражнению</div>
            <div className={styles.comments}>
                {comments.map((el, key) => (
                    <div
                        key={key}
                        className={styles.comment}
                    >
                        <div className={styles.text}>
                            <span>
                                {mode === "student" ?
                                    (el.sender === "student" ? "Я: " : "Преп.: ") :
                                    (el.sender === "teacher" ? "Я: " : "Студ.: ")
                                }
                            </span>
                            {el.text}
                        </div>
                        <div className={styles.date}>
                            {new Date(el.dateTime!).toLocaleString()}
                        </div>
                    </div>
                ))}
                <div ref={commentsEndRef}></div>
            </div>
            {!readOnly &&
                <div>
                    <div className={styles.leave_comment_title}>Добавить комментарий</div>
                    <Formik
                        initialValues={{
                            comment: ""
                        }}
                        onSubmit={onSubmit}
                    >
                        {({ isSubmitting, isValid }) => (
                            <Form>
                                <Field
                                    name="comment"
                                    component={TextAreaField}
                                    validate={notEmptyValidator}
                                    disabled={isSubmitting}
                                    placeholder="Ваш комментарий"
                                />
                                <Button
                                    title="Отправить"
                                    size="small"
                                    type="submit"
                                    disabled={isSubmitting || !isValid}
                                />
                            </Form>
                        )}
                    </Formik>
                </div>
            }
        </div>
    )

}

export default ExerciseComments