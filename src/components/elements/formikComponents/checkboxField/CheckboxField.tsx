import React from "react"
import styles from "./CheckboxField.module.scss"
import { FieldProps } from "formik"
import cn from "classNames"

type CheckBoxFieldProps = FieldProps & React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string
}

const CheckboxField = ({
    field,
    form: { touched, errors },
    label,
    ...props
}: CheckBoxFieldProps) => {


    return (
        <div className={styles.container}>
            <input
                className={cn(
                    styles.input_container,
                    { [styles.disabled]: props.disabled }
                )}
                type={"checkbox"}
                {...{
                    ...field,
                    ...props
                }}
            />
            {label &&
                <div className={styles.input_label}>
                    {label}
                </div>
            }
            <div className={cn(
                styles.input_error,
                { [styles.input_error_shown]: touched[field.name] && errors[field.name] }

            )}>
                {`${errors[field.name]}`}
            </div>
        </div >
    )
}

export default CheckboxField