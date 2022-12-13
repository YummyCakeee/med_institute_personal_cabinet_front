import React from "react"
import styles from "./Input.module.scss"
import cn from "classNames"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string,
    fieldSize?: "small" | "medium" | "large",
    inputClassName?: string,
}

const Input = ({
    label,
    fieldSize = "medium",
    className,
    inputClassName,
    ...props
}: InputProps) => {
    return (
        <div className={cn(
            styles.container,
            className
        )}>
            {label &&
                <div className={styles.input_label}>
                    {label}
                </div>
            }
            <input
                className={cn(
                    styles.input_container,
                    { [styles.disabled]: props.disabled },
                    styles[fieldSize],
                    inputClassName
                )}
                {...{
                    ...props
                }}
            />
        </div>
    )
}

export default Input