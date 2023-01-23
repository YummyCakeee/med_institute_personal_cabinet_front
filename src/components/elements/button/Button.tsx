import React from "react"
import styles from "./Button.module.scss"
import cn from "classnames"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    title?: string,
    onClick?: () => void,
    size?: "small" | "medium" | "large",
    primary?: boolean,
    stretchable?: boolean,
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"],
    className?: string
}

const Button = ({
    title,
    onClick = () => { },
    size = "medium",
    primary,
    stretchable,
    type = "button",
    className,
    ...props
}: ButtonProps) => {

    return (
        <button className={cn(
            { [styles.container]: true },
            styles[size],
            { [styles.primary]: primary },
            { [styles.disabled]: props.disabled },
            { [styles.stretchable]: stretchable },
            className
        )}
            {... {
                onClick,
                type,
                ...props
            }}
        >
            {title}
        </button>
    )
}

export default Button