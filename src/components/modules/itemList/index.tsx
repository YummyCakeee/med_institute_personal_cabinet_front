import React, { useEffect, useMemo, useState } from "react"
import styles from "./ItemList.module.scss"
import cn from "classNames"
import { CrossIcon } from "components/elements/icons"
import Button from "components/elements/button/Button"

type ItemListHeader = {
    title: string,
    field: string,
    colSize?: string
}

type Item = {
    [field: string]: string
}

type ItemControlButton = {
    title: string,
    onClick: (itemIndex: number) => void
}

type ItemControlButtonBottom = {
    title: string,
    onClick: () => void
}

type ItemListProps = {
    headers: ItemListHeader[],
    items?: Item[],
    className?: string,
    itemControlButtons?: ItemControlButton[],
    controlButtonsBottom?: ItemControlButtonBottom[]
}

const ItemList = ({
    headers,
    items,
    className,
    itemControlButtons,
    controlButtonsBottom
}: ItemListProps) => {

    const [selectedItem, setSetectedItem] = useState<number | null>(null)

    const defaultColSize = useMemo(() => {
        return `${100 / headers.length}%`
    }, [headers.length])

    const onItemClick = (index: number) => {
        if (selectedItem !== index) setSetectedItem(index)
        else setSetectedItem(null)
    }

    useEffect(() => {
        setSetectedItem(null)
    }, [items])

    return (
        <div className={cn(styles.container, className)}>
            <div className={styles.header_list}>
                {headers.map((el, key) => (
                    <div
                        key={key}
                        className={styles.header_item}
                        style={{ width: el.colSize || defaultColSize }}
                    >
                        {el.title}
                    </div>
                ))}
            </div>
            <div className={styles.item_control} data-visible={selectedItem !== null}>
                <div
                    className={styles.item_control_button_unselect}
                    onClick={() => setSetectedItem(null)}
                >
                    <CrossIcon />
                </div>
                {itemControlButtons?.map((el, key) => (
                    <div
                        key={key}
                        className={styles.item_control_button}
                    >
                        <Button
                            title={el.title}
                            size="small"
                            onClick={() => {
                                if (selectedItem !== null)
                                    el.onClick(selectedItem)
                            }}
                        />
                    </div>
                ))}
            </div>
            <div className={styles.item_list_container}>
                {items?.length ?
                    <>
                        <div className={styles.item_list_background_columns}>
                            {headers.map((el, key) => (
                                <div
                                    key={key}
                                    className={key % 2 ?
                                        styles.item_list_background_column_even :
                                        styles.item_list_background_column_odd}
                                    style={{ width: el.colSize || defaultColSize }}
                                >
                                </div>
                            ))}
                        </div>
                        <div className={styles.item_list}>
                            {items.map((item, itemKey) => (
                                <div
                                    key={itemKey}
                                    className={cn(
                                        styles.item,
                                        { [styles.item_selected]: selectedItem === itemKey }
                                    )}
                                    onClick={() => onItemClick(itemKey)}
                                >
                                    {headers.map((header, headerKey) => (
                                        <div
                                            key={headerKey}
                                            className={styles.item_field}
                                            style={{ width: header?.colSize || defaultColSize }}
                                        >
                                            {item[header.field]}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </> :
                    <div className={styles.item_list_empty}>
                        <p>
                            Список пуст
                        </p>
                    </div>
                }
            </div>
            <div className={styles.item_control_bottom_section}>
                {controlButtonsBottom?.map((el, key) => (
                    <div
                        key={key}
                        className={styles.item_control_button}
                    >
                        <Button
                            title={el.title}
                            size="small"
                            onClick={el.onClick}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ItemList