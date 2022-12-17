import React, { useState, FC } from "react"
import { List, arrayMove } from "react-movable"
import { ArrowIcon, HamburgerIcon } from "components/elements/icons"
import cn from "classNames"
import styles from "./SwapLists.module.scss"
import utilStyles from "styles/utils.module.scss"

type SwapListsProps = {
    firstListItems: any[],
    secondListItems: any[],
    setFirstListItems: React.Dispatch<React.SetStateAction<any>>,
    setSecondListItems: React.Dispatch<React.SetStateAction<any>>,
    firstListClassName?: string,
    secondListClassName?: string,
    firstListTitle?: string,
    secondListTitle?: string,
    onLeftListItemSelected?: (index: number | undefined) => void
}

const SwapLists = ({
    firstListItems,
    secondListItems,
    setFirstListItems,
    setSecondListItems,
    firstListClassName,
    secondListClassName,
    firstListTitle,
    secondListTitle,
    onLeftListItemSelected = () => { }
}: SwapListsProps) => {

    const [selectedItemIndex, setSelectedItemIndex] = useState<number | undefined>(undefined)
    const [activeList, setActiveList] = useState<"first" | "second" | undefined>(undefined)

    const onListItemClick = (index: number | undefined, list: "first" | "second") => {
        if (index === selectedItemIndex && activeList === list) {
            setSelectedItemIndex(undefined)
            setActiveList(undefined)
            onLeftListItemSelected(undefined)
        }
        else {
            setSelectedItemIndex(index)
            setActiveList(list)
            if (list === "first") onLeftListItemSelected(index)
            else onLeftListItemSelected(undefined)
        }
    }


    const onArrowClick = () => {
        if (selectedItemIndex !== undefined && activeList) {
            if (activeList === "first") {
                const item = firstListItems[selectedItemIndex]
                setSecondListItems((prev: any[]) => [...prev, { ...item }])
                setFirstListItems((prev: any[]) => prev.filter((el: any, index: number) => index !== selectedItemIndex))
            }
            else {
                const item = secondListItems[selectedItemIndex]
                setFirstListItems((prev: any[]) => [...prev, { ...item }])
                setSecondListItems((prev: any[]) => prev.filter((el: any, index: number) => index !== selectedItemIndex))
            }
            setSelectedItemIndex(undefined)
            setActiveList(undefined)
        }
    }

    return (
        <div className={styles.container}>
            <div className={firstListClassName}>
                <div className={utilStyles.text_medium}>{firstListTitle}</div>
                <List
                    beforeDrag={({ index }) => onListItemClick(index, "first")}
                    lockVertically
                    values={firstListItems}
                    onChange={({ oldIndex, newIndex }) => {
                        setFirstListItems(arrayMove(firstListItems, oldIndex, newIndex))
                    }}
                    renderList={({ children, props }) =>
                        <div
                            className={styles.course_list}
                            {...props}
                        >
                            {children}
                        </div>
                    }
                    renderItem={({ value, props, index }) =>
                        <div className={cn(
                            styles.course_list_item,
                            {
                                [styles.course_list_item_selected]:
                                    index === selectedItemIndex &&
                                    activeList === "first"
                            }
                        )}
                            {...props}
                        >
                            <HamburgerIcon
                                className={styles.icon}
                            />
                            <div className={utilStyles.text_small}>{value.title}</div>
                        </div>
                    }
                />
            </div>
            <div className={styles.swap_arrows_container}>
                <ArrowIcon
                    className={cn(
                        styles.arrow,
                        { [styles.arrow_active]: activeList },
                        { [styles.arrow_right]: activeList === "first" },
                        { [styles.arrow_left]: activeList === "second" }
                    )}
                    onClick={onArrowClick}
                />
            </div>
            <div className={secondListClassName}>
                <div className={utilStyles.text_medium}>{secondListTitle}</div>
                <List
                    beforeDrag={({ index }) => onListItemClick(index, "second")}
                    lockVertically
                    values={secondListItems}
                    onChange={({ oldIndex, newIndex }) => {
                        setSecondListItems(arrayMove(secondListItems, oldIndex, newIndex))
                    }}
                    renderList={({ children, props }) =>
                        <div
                            className={styles.course_list}
                            {...props}
                        >
                            {children}
                        </div>
                    }
                    renderItem={({ value, props, index }) =>
                        <div className={cn(
                            styles.course_list_item,
                            {
                                [styles.course_list_item_selected]:
                                    index === selectedItemIndex &&
                                    activeList === "second"
                            }
                        )}
                            {...props}
                        >
                            <HamburgerIcon
                                className={styles.icon}
                            />
                            <div className={utilStyles.text_small}>{value.title}</div>
                        </div>
                    }
                />
            </div>
        </div>
    )
}

export default SwapLists