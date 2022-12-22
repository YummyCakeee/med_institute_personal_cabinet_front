import React, { useState, FC } from "react"
import { List, arrayMove } from "react-movable"
import { ArrowIcon, HamburgerIcon } from "components/elements/icons"
import cn from "classNames"
import styles from "./SwapLists.module.scss"
import utilStyles from "styles/utils.module.scss"
import MovableList from "../movableList"

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

    const onListItemClick = (index: number, list: "first" | "second") => {
        console.log('aaa')
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
            <MovableList
                items={firstListItems}
                onItemSelected={(index) => onListItemClick(index, "first")}
                setItems={setFirstListItems}
                renderItem={(value) => (
                    value.title
                )}
                title={firstListTitle}
                className={firstListClassName}
                selectedItemClass={cn({ [styles.item_not_selected]: activeList !== "first" })}
            />
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
            <MovableList
                items={secondListItems}
                onItemSelected={(index) => onListItemClick(index, "second")}
                setItems={setSecondListItems}
                renderItem={(value) => (
                    value.title
                )}
                title={secondListTitle}
                className={secondListClassName}
                selectedItemClass={cn({ [styles.item_not_selected]: activeList !== "second" })}
            />
        </div>
    )
}

export default SwapLists