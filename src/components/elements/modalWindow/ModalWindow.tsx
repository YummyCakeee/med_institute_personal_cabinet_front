import React from "react"
import { CrossIcon } from "../icons"
import styles from "./ModalWindow.module.scss"
import utilStyles from "styles/utils.module.scss"
import cn from "classnames"

export interface ModalWindowProps {
    onClose?: () => void
    closable?: boolean,
    children?: React.ReactNode,
    backgroundOverlap?: boolean,
    title?: string,
    className?: string,
    onOpenAnimation?: boolean
}

const ModalWindow = ({
    onClose = () => { },
    closable,
    children,
    backgroundOverlap,
    title,
    className,
    onOpenAnimation = true
}: ModalWindowProps) => {

    const onBackgroundlClick = () => {
        if (closable) onClose()
    }

    return (
        <>
            <div className={cn(
                styles.container,
                { [styles.container_animated]: onOpenAnimation },
                className
            )}>
                {closable &&
                    <div
                        className={styles.close_button}
                        onClick={onClose}
                    >
                        <CrossIcon
                            width={15}
                            height={15}
                        />
                    </div>
                }
                <div className={styles.content}>
                    {title &&
                        <div className={utilStyles.modal_window_title}>
                            {title}
                        </div>
                    }
                    {children}
                </div>
            </div>
            {backgroundOverlap &&
                <div
                    className={styles.background}
                    onClick={onBackgroundlClick}
                >
                </div>
            }
        </>
    )
}

export default ModalWindow