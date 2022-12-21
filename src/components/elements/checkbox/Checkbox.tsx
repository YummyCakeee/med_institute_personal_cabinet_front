import React from "react"
import styles from "./Checkbox.module.scss"
import cn from "classNames"

export interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

const Checkbox = ({
    label,
    ...props
}: CheckBoxProps) => {


    return (
        <div className={styles.container}>
            <input
                className={cn(
                    styles.input_container,
                    { [styles.disabled]: props.disabled }
                )}
                {...{
                    type: "checkbox",
                    ...props
                }}
            />
            {label &&
                <label className={styles.input_label}>
                    {label}
                </label>
            }
        </div >
    )
}

export default Checkbox