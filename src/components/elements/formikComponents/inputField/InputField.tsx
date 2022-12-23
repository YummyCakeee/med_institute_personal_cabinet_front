import React from "react"
import { FieldProps } from "formik"
import styles from "./InputField.module.scss"
import cn from "classnames"
import Input, { InputProps } from "components/elements/input/Input"

type InputFieldProps = FieldProps & InputProps

const InputField = ({
    field,
    form: { touched, errors },
    ...props
}: InputFieldProps) => {
    return (
        <div className={styles.container}>
            <Input
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