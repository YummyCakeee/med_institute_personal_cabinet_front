import React from "react"
import styles from "./Button.module.scss"

export interface ButtonProps {
    title?: string,
    onClick: () => void
}

const Button = ({
    title,
    onClick = () => { }
}: ButtonProps) => {


    return (
        <div>

        </div>
    )
}

export default Button