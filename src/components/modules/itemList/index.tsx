import React, { useEffect, useMemo, useState } from "react"
import styles from "./ItemList.module.scss"
import cn from "classNames"
import { CrossIcon, DoubleArrowIcon } from "components/elements/icons"
import Button, { ButtonProps } from "components/elements/button/Button"

type ItemListHeader = {
    title: string,
    field: string,
    colSize?: string
    clickable?: boolean
}

type Item = {
    [field: string]: any,
}

interface ItemControlButton extends Omit<ButtonProps, 'onClick'> {
    onClick?: (itemIndex: number) => void
}

type CustomFieldRenderingType = {
    render: (value: any) => string,
    fieldName: string
}

type ItemListProps = {
    headers: ItemListHeader[],
    items?: Item[],
    className?: string,
    itemControlButtons?: ({ selectedItem, items }: { selectedItem: number | null, items: Item[] | undefined }) => ItemControlButton[],
    customFieldsRendering?: CustomFieldRenderingType[],
    controlButtonsBottom?: ButtonProps[],
    onHeaderClick?: (index: number) => void,
    pageNavigation?: boolean,
    pagesCount?: number
}

const ItemList = ({
    headers,
    items,
    className,
    itemControlButtons,
    customFieldsRendering,
    controlButtonsBottom,
    onHeaderClick = () => { },
    pageNavigation,
    pagesCount = 1
}: ItemListProps) => {

    const [selectedItem, setSetectedItem] = useState<number | null>(null)
    const [pagesList, setPagesList] = useState<number[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)

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

    useEffect(() => {
        const offset =
            currentPage === 1 ?
                1 :
                currentPage === pagesCount ?
                    -1 :
                    0
        let newPagesList = [
            currentPage - 1 + offset,
            currentPage + offset,
            currentPage + 1 + offset
        ].slice(0, pagesCount)

        setPagesList(newPagesList)

    }, [pagesCount, currentPage])

    const getItemFieldValue = (item: Item, fieldName: string): string => {
        if (customFieldsRendering) {
            const renderRule = customFieldsRendering.find(el => el.fieldName === fieldName)
            return renderRule ?
                renderRule.render(item[fieldName]) :
                item[fieldName]?.toString()
        }
        return item[fieldName]?.toString()
    }

    return (
        <div className={cn(styles.container, className)}>
            <div className={styles.header_list}>
                {headers.map((el, key) => (
                    <div
                        key={key}
                        className={cn(
                            styles.header_item,
                            { [styles.header_item_clickable]: el.clickable }
                        )}
                        style={{ width: el.colSize || defaultColSize }}
                        onClick={() => onHeaderClick(key)}
                    >
                        {el.title}
                    </div>
                ))}
            </div>
            <div className={styles.item_control} data-visible={selectedItem !== null}>
                <CrossIcon
                    className={styles.item_control_button_unselect}
                    onClick={() => setSetectedItem(null)}
                />
                {itemControlButtons && itemControlButtons({ selectedItem, items }).map((el, key) => (
                    <div
                        key={key}
                        className={styles.item_control_button}
                    >
                        <Button
                            {...{
                                ...el,
                                onClick: () => {
                                    if (selectedItem !== null && el.onClick)
                                        el.onClick(selectedItem)
                                }
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
                                            {getItemFieldValue(item, header.field)}
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
                            {...{
                                ...el,
                                onClick: () => {
                                    setSetectedItem(null)
                                    el.onClick && el.onClick()
                                }
                            }}
                        />
                    </div>
                ))}
            </div>
            {pageNavigation &&
                <div className={styles.item_control_navigation_section}>
                    <DoubleArrowIcon
                        className={styles.arrow_left}
                        onClick={() => setCurrentPage(1)}
                    />
                    {pagesList.map(el => (
                        <div
                            key={el}
                            className={cn(
                                styles.page,
                                { [styles.page_selected]: el === currentPage }
                            )}
                            onClick={() => setCurrentPage(el)}
                        >
                            {el}
                        </div>
                    ))}
                    <DoubleArrowIcon
                        className={styles.arrow_right}
                        onClick={() => setCurrentPage(pagesCount)}
                    />
                </div>
            }
        </div>
    )
}

export default ItemList