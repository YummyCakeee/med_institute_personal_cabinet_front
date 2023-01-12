import React, { useEffect, useMemo, useRef, useState } from "react"
import styles from "./ItemList.module.scss"
import cn from "classnames"
import { CrossIcon, DoubleArrowIcon } from "components/elements/icons"
import Button, { ButtonProps } from "components/elements/button/Button"

type ItemListHeader = {
    title: string,
    field: string,
    colSize?: string
    clickable?: boolean
    textAlign?: "left" | "center" | "right"
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
    items: Item[],
    className?: string,
    itemListClassName?: string,
    itemControlButtons?: ({ selectedItem, items }: { selectedItem: Item, items: Item[] }) => ItemControlButton[],
    customFieldsRendering?: CustomFieldRenderingType[],
    controlButtonsBottom?: ButtonProps[],
    onHeaderClick?: (index: number) => void,
    pageNavigation?: boolean,
    pagesCount?: number,
    onPageClick?: (pageNumber: number) => void
}

const ItemList = ({
    headers,
    items,
    className,
    itemListClassName,
    itemControlButtons,
    customFieldsRendering,
    controlButtonsBottom,
    onHeaderClick = () => { },
    pageNavigation,
    pagesCount = 1,
    onPageClick = () => { },
}: ItemListProps) => {

    const [selectedItemIndex, setSetectedItemIndex] = useState<number | null>(null)
    const [pagesList, setPagesList] = useState<number[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const headersRef = useRef<HTMLDivElement>(null)

    const defaultColSize = useMemo(() => {
        if (headersRef?.current) {
            const paddingCorrection = 10
            const containerWidth = headersRef.current.clientWidth - paddingCorrection
            let customWidthHeadersCount = 0
            let customWidthSum = 0
            const childNodesCount = headersRef.current.childNodes.length
            headersRef.current.childNodes.forEach((el: any) => {
                if (el.dataset.width) {
                    customWidthSum += el.clientWidth
                    customWidthHeadersCount++
                }
            })
            return `${(containerWidth - customWidthSum) / (childNodesCount - customWidthHeadersCount)}px`
        }
        return `${100 / headers.length}%`
    }, [headers, headersRef])

    const onItemClick = (index: number) => {
        if (selectedItemIndex !== index) setSetectedItemIndex(index)
        else setSetectedItemIndex(null)
    }

    useEffect(() => {
        setSetectedItemIndex(null)
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

    useEffect(() => {
        onPageClick(currentPage)
    }, [currentPage, onPageClick])

    const getItemFieldValue = (item: Item, fieldName: string): string => {

        let field: any = null
        const fieldPath: string[] = fieldName.split('.')
        field = item[fieldPath[0]]

        for (let i = 1; i < fieldPath.length; i++) {
            field = field[fieldPath[i]]
        }

        if (customFieldsRendering) {
            const renderRule = customFieldsRendering.find(el => el.fieldName === fieldName)
            return renderRule ?
                renderRule.render(field) :
                field?.toString()
        }
        return field?.toString()
    }

    return (
        <div className={cn(styles.container, className)}>
            <div
                className={styles.header_list}
                ref={headersRef}
            >
                {headers.map((el, key) => (
                    <div
                        key={key}
                        className={cn(
                            styles.header_item,
                            { [styles.header_item_clickable]: el.clickable }
                        )}
                        style={{ width: el.colSize || defaultColSize }}
                        onClick={() => onHeaderClick(key)}
                        data-width={el.colSize}
                    >
                        {el.title}
                    </div>
                ))}
            </div>
            <div className={styles.item_control} data-visible={selectedItemIndex !== null}>
                <CrossIcon
                    className={styles.item_control_button_unselect}
                    onClick={() => setSetectedItemIndex(null)}
                />
                {itemControlButtons && selectedItemIndex !== null && items[selectedItemIndex] &&
                    itemControlButtons({ selectedItem: items[selectedItemIndex], items }).map((el, key) => (
                        <div
                            key={key}
                            className={styles.item_control_button}
                        >
                            <Button
                                {...{
                                    ...el,
                                    onClick: () => {
                                        if (selectedItemIndex !== null && el.onClick)
                                            el.onClick(selectedItemIndex)
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
                                        styles.item_list_background_column_odd
                                    }
                                    style={{ width: el.colSize || defaultColSize }}
                                >
                                </div>
                            ))}
                        </div>
                        <div className={cn(
                            styles.item_list,
                            itemListClassName
                        )}>
                            {items.map((item, itemKey) => (
                                <div
                                    key={itemKey}
                                    className={cn(
                                        styles.item,
                                        { [styles.item_selected]: selectedItemIndex === itemKey }
                                    )}
                                    onClick={() => onItemClick(itemKey)}
                                >
                                    {headers.map((header, headerKey) => (
                                        <div
                                            key={headerKey}
                                            className={cn(
                                                styles.item_field,
                                                { [styles[`text_align_${header.textAlign}`]]: header.textAlign }
                                            )}
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
                                    setSetectedItemIndex(null)
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