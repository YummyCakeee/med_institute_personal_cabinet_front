import React from "react"
import { FieldProps } from "formik"
import styles from "./InputField.module.scss"
import cn from "classNames"

type InputFieldProps = FieldProps & React.InputHTMLAttributes<HTMLInputElement>

const InputField = ({
    field,
    form: { touched, errors },
    ...props
}: InputFieldProps) => {
    return (
        <div className={styles.container}>
            <input
                className={cn(
                    styles.input_container,
                    { [styles.disabled]: props.disabled }
                )}
                {...{
                    ...field,
                    ...props
                }}
            />
            <div className={cn(
                styles.input_error,
                { [styles.input_error_shown]: touched[field.name] && errors[field.name] }

            )}>
                {`${errors[field.name]}`}
            </div>
        </div>
    )
}

export default InputField