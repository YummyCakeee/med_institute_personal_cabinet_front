import React from "react"
import styles from "./Input.module.scss"
import cn from "classNames"

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string,
    size?: "small" | "medium" | "large",
    inputClassName?: string,
}

const Input = ({
    label,
    size = "medium",
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
                    styles[size],
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