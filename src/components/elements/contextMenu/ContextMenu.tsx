import React, { memo, useEffect, useRef } from "react"
import styles from "./ContextMenu.module.scss"

export type ContextMenuProps = {
    items: ContextMenuItemType[],
    onClose: () => void,
    x?: number,
    y?: number
}

type ContextMenuItemType = {
    title: string,
    onClick: () => void
}

const ContextMenu = ({
    items,
    onClose,
    x = 0,
    y = 0
}: ContextMenuProps) => {

    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [menuRef]);

    const onItemClick = (index: number) => {
        items[index].onClick()
        onClose()
    }

    return (
        <div
            className={styles.container}
            style={{ top: y, left: x }}
            ref={menuRef}
        >
            {items.map((el, key) => (
                <div
                    className={styles.item}
                    onClick={() => onItemClick(key)}
                    key={key}
                >
                    {el.title}
                </div>
            ))}
        </div>
    )
}

export default memo(ContextMenu)