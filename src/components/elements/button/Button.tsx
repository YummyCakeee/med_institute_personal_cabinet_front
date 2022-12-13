import React from "react"
import styles from "./Button.module.scss"
import cn from "classNames"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    title?: string,
    onClick?: () => void,
    size?: "small" | "medium" | "large",
    primary?: boolean,
    stretchable?: boolean
}

const Button = ({
    title,
    onClick = () => { },
    size = "medium",
    primary,
    stretchable,
    ...props
}: ButtonProps) => {

    return (
        <button className={cn(
            { [styles.container]: true },
            styles[size],
            { [styles.primary]: primary },
            { [styles.disabled]: props.disabled },
            { [styles.stretchable]: stretchable }
        )}
            {... {
                onClick,
                ...props
            }}
        >
            {title}
        </button>
    )
}

export default Button