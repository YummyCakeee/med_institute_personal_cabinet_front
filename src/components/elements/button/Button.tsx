import React from "react"
import styles from "./Button.module.scss"
import cn from "classNames"

export interface IButtonProps {
    title?: string,
    onClick?: () => void,
    size?: "small" | "medium" | "large",
    primary?: boolean
}

const Button = ({
    title,
    onClick = () => { },
    size = "medium",
    primary
}: IButtonProps) => {

    const cx = cn.bind(styles)

    return (
        <div className={cx({
            [styles.container]: true,
            [styles[size]]: true,
            [styles.primary]: primary
        })}
            onClick={onClick}
        >
            {title}
        </div >
    )
}

export default Button