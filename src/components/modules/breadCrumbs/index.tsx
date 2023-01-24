import { ArrowIcon } from "components/elements/icons"
import { ROUTE_USERS } from "constants/routes"
import Link from "next/link"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { breadCrumbsSelector, clearBreadCrumbs } from "store/breadCrumbsSlice"
import styles from "./BreadCrumbs.module.scss"
import cn from "classnames"

const BreadCrumbs = () => {

    const breadCrumbs = useSelector(breadCrumbsSelector).breadCrumbs
    const [activeBreadCrumbIndex, setActiveBreadCrumbIndex] = useState<number>()
    const ref = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()

    useEffect(() => {

        const handleLeave = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setActiveBreadCrumbIndex(undefined)
            }
        }
        document.addEventListener("mouseover", handleLeave)

        return () => {
            document.removeEventListener("mouseover", handleLeave)
        }
    }, [ref])

    const lastBreadCrumb = useMemo(() => {
        return breadCrumbs.length ? breadCrumbs[breadCrumbs.length - 1] : undefined
    }, [breadCrumbs])

    return (
        <div
            className={styles.bread_crumbs_container}
            ref={ref}
        >
            {breadCrumbs.slice(0, breadCrumbs.length - 1).map((el, key) => (
                <Link
                    href={el.route}
                    key={key}
                    onClick={() => dispatch(clearBreadCrumbs())}
                >
                    <div
                        className={cn(
                            styles.bread_crumb,
                            { [styles.bread_crumb_active]: activeBreadCrumbIndex === key }
                        )}
                        onMouseEnter={() => setActiveBreadCrumbIndex(key)}
                    >
                        <ArrowIcon
                            className={styles.bread_crumb_arrow}
                        />
                        <p
                            className={styles.bread_crumb_text}
                            title={el.title}
                        >
                            {el.title}
                        </p>
                    </div>
                </Link>
            ))}
            {lastBreadCrumb &&
                <Link
                    href={lastBreadCrumb.route}
                    onClick={() => dispatch(clearBreadCrumbs())}
                >
                    <div
                        className={cn(
                            styles.bread_crumb,
                            { [styles.bread_crumb_active]: activeBreadCrumbIndex === breadCrumbs.length - 1 },
                            { [styles.bread_crumb_last_active]: activeBreadCrumbIndex === undefined }
                        )}
                        onMouseEnter={() => setActiveBreadCrumbIndex(breadCrumbs.length - 1)}
                    >
                        <ArrowIcon
                            className={styles.bread_crumb_arrow}
                        />
                        <p
                            className={styles.bread_crumb_text}
                            title={lastBreadCrumb.title}
                        >
                            {lastBreadCrumb.title}
                        </p>
                    </div>
                </Link>
            }
        </div>
    )
}

export default BreadCrumbs