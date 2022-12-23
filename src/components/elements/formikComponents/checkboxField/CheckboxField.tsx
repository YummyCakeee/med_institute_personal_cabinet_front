import React from "react"
import styles from "./CheckboxField.module.scss"
import { FieldProps } from "formik"
import cn from "classnames"
import Checkbox, { CheckBoxProps } from "components/elements/checkbox/Checkbox"

type CheckBoxFieldProps = FieldProps & CheckBoxProps & {
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
            <Checkbox
                {...{
                    ...field,
                    label,
                    ...props
                }}
            />
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