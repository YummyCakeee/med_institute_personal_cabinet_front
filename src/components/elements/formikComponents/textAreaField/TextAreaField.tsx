import React from "react"
import { FieldProps } from "formik"
import cn from "classNames"
import styles from "./TextAreaField.module.scss"

type TextAreaFieldProps = FieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>

const TextAreaField = ({
    field,
    form: { touched, errors },
    ...props
}: TextAreaFieldProps) => {

    return (
        <div className={styles.container}>
            <textarea
                className={styles.text_area_container}
                {...{
                    ...field,
                    ...props,
                }}
            />
            <div className={cn(
                styles.text_area_error,
                { [styles.text_area_error_shown]: touched[field.name] && errors[field.name] }

            )}>
                {`${errors[field.name]}`}
            </div>
        </div>
    )
}

export default TextAreaField