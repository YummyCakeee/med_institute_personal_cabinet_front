import React, { memo, useEffect, useRef, useState } from "react"
import styles from "./LoadingStatusWrapper.module.scss"
import cn from "classnames"

export enum LoadingStatusType {
    LOADING, LOADED, LOAD_ERROR
}

type LoadingStatusWrapperProps = {
    status: LoadingStatusType,
    children: React.ReactElement
}

const LoadingStatusWrapper = ({
    status,
    children
}: LoadingStatusWrapperProps) => {

    const ref = useRef<HTMLDivElement>(null)
    const [childrenStyles, setChildrenStyles] = useState<React.CSSProperties>()
    useEffect(() => {
        if (ref.current && window) {
            const { borderRadius, width, height } = window.getComputedStyle(ref.current.children[0])
            setChildrenStyles({
                borderRadius,
                width,
                height
            })
            console.log(width)
        }
    }, [children, window])

    return (
        <div className={styles.container} ref={ref}>
            {children}
            <div
                className={cn(
                    styles.status,
                    { [styles.status_loading]: status === LoadingStatusType.LOADING },
                    { [styles.status_error]: status === LoadingStatusType.LOAD_ERROR }
                )}
                style={childrenStyles}
            >
                {
                    status === LoadingStatusType.LOADING ? "Загрузка" :
                        status === LoadingStatusType.LOAD_ERROR ? "Ошибка при загрузке" : ""
                }
            </div>
        </div >
    )
}

export default memo(LoadingStatusWrapper)