import React from "react"
import { FieldProps } from "formik"
import cn from "classnames"
import styles from "./TextAreaField.module.scss"

type TextAreaFieldProps = FieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    size?: "small" | "medium" | "large",
    className?: string
}

const TextAreaField = ({
    field,
    form: { touched, errors },
    size = "medium",
    className,
    ...props
}: TextAreaFieldProps) => {

    return (
        <div className={styles.container}>
            <textarea
                className={cn(
                    styles.text_area_container,
                    { [styles.disabled]: props.disabled },
                    styles[size],
                    className
                )}
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