import React from "react"
import utilStyles from "styles/utils.module.scss"
import ItemList from "components/modules/itemList"
import { TestBlockType } from "./types"
import { useRouter } from "next/router"
import { useModalWindowContext } from "context/modalWindowContext"

type TestBlocksProps = {
    testBlocks: TestBlockType[],
    setTestBlocks: React.Dispatch<React.SetStateAction<TestBlockType[]>>
}

const TestBlocks = ({
    testBlocks,
    setTestBlocks
}: TestBlocksProps) => {

    const router = useRouter()
    const {
        setConfirmActionModalWindowState,
        //setTestBlockModalWindowState
    } = useModalWindowContext()

    const onTestBlockEditClick = (index: number) => {
        // setTestBlockModalWindowState({
        //     mode: "edit",
        //     TestBlock: testBlocks[index],
        //     backgroundOverlap: true,
        //     closable: true
        // })
    }

    const deleteTestBlock = (index: number) => {

        const id = testBlocks[index].testBlockId
        setTestBlocks(prev => prev.filter(el => el.testBlockId !== id))

        setConfirmActionModalWindowState(undefined)
    }

    const onTestBlockDeleteClick = (index: number) => {
        setConfirmActionModalWindowState({
            text: `Удалить блок?`,
            onConfirm: () => deleteTestBlock(index),
            onDismiss: () => setConfirmActionModalWindowState(undefined),
            backgroundOverlap: true,
            closable: true,
        })
    }

    const onTestBlockAddClick = () => {
        // setTestBlockModalWindowState({
        //     mode: "add",
        //     backgroundOverlap: true,
        //     closable: true
        // })
    }

    // const onTestBlockTestsEditClick = (index: number) => {
    //     const id = TestBlocks[index].TestBlockId
    //     router.push(`${ROUTE_TestBlockS}/${id}`)
    // }

    return (
        <>
            <div className={utilStyles.section_title}>Тестовые блоки</div>
            <ItemList
                headers={[
                    {
                        title: "Тип теста",
                        field: "testTypeId",
                    },
                    {
                        title: "Тело теста",
                        field: "testBody",
                    },
                    {
                        title: "Коллекция",
                        field: "TestBlock",
                    }
                ]}
                controlButtonsBottom={[
                    {
                        title: "Добавить",
                        size: "small"
                    }
                ]}
            />
        </>
    )
}

export default TestBlocks