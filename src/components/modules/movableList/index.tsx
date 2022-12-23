import React, { useState } from "react"
import { List, arrayMove } from "react-movable"
import { HamburgerIcon } from "components/elements/icons"
import cn from "classnames"
import styles from "./MovableList.module.scss"
import utilStyles from "styles/utils.module.scss"

type MovableListProps = {
    items: any[],
    setItems: React.Dispatch<React.SetStateAction<any>>,
    className?: string,
    title?: string,
    renderItem?: (value: any) => string,
    onItemSelected?: (index: number) => void,
    selectedItemClass?: string
}

const MovableList = ({
    items,
    setItems,
    className,
    title,
    renderItem,
    onItemSelected = () => { },
    selectedItemClass
}: MovableListProps) => {

    const [selectedItemIndex, setSelectedItemIndex] = useState<number | undefined>(undefined)

    const onListItemClick = (index: number) => {
        if (index === selectedItemIndex) {
            setSelectedItemIndex(undefined)
        }
        else {
            setSelectedItemIndex(index)
        }
        onItemSelected(index)
    }

    return (
        <div className={className}>
            <div className={utilStyles.text_medium}>{title}</div>
            <List
                beforeDrag={({ index }) => onListItemClick(index)}
                lockVertically
                values={items}
                onChange={({ oldIndex, newIndex }) => {
                    setItems(arrayMove(items, oldIndex, newIndex))
                }}
                renderList={({ children, props }) =>
                    <div
                        className={styles.list}
                        {...props}
                    >
                        {children}
                    </div>
                }
                renderItem={({ value, props, index }) =>
                    <div className={cn(
                        styles.list_item,
                        { [styles.selected]: index === selectedItemIndex },
                        { [`${selectedItemClass}`]: index === selectedItemIndex }
                    )}
                        {...props}
                    >
                        <HamburgerIcon
                            className={styles.icon}
                        />
                        <div className={utilStyles.text_small}>{renderItem ? renderItem(value) : ""}</div>
                    </div>
                }
            />
        </div>
    )
}

export default MovableList