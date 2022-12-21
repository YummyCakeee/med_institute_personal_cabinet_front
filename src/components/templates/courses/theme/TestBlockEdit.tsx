import Button from "components/elements/button/Button"
import Input from "components/elements/input/Input"
import { CollectionType, TestBlockCollectionsType, TestBlockType } from "components/templates/testing/types"
import dynamic from "next/dynamic"
const Datetime = dynamic(() => import('react-datetime'), { ssr: false })
import { Moment } from 'moment';
import "react-datetime/css/react-datetime.css"
import React, { useState } from "react"
import styles from "./Theme.module.scss"
import 'moment/locale/ru';
import ItemList from "components/modules/itemList"
import utilStyles from "styles/utils.module.scss"
import Checkbox from "components/elements/checkbox/Checkbox"
import { maxMinConstraint } from "utils/computations"
import { Store } from "react-notifications-component"
import { useModalWindowContext } from "context/modalWindowContext"

type TestBlockEditProps = {
    testBlock?: TestBlockType,
    setTestBlock: React.Dispatch<React.SetStateAction<TestBlockType | undefined>>,
    collections: CollectionType[]
}

const TestBlockEdit = ({
    testBlock,
    setTestBlock,
    collections
}: TestBlockEditProps) => {

    const { setTestBlockModalWindowState } = useModalWindowContext()

    const [testBlockCollections, setTestBlockCollections] = useState<(TestBlockCollectionsType & { collectionName: string })[]>([])

    const onUnbindBlockClick = () => {
        setTestBlock(undefined)
    }

    const onBindBlockClick = () => {
        setTestBlock({
            testBlockId: "",
            dateEnd: new Date().toISOString(),
            isFileTestBlock: false,
            percentSuccess: 100,
            timeLimit: 1000
        })
    }

    const onAddCollectionClick = (index: number) => {
        if (testBlockCollections.find(el => el.collectionId === collections[index].collectionId)) {
            Store.addNotification({
                container: "top-right",
                type: "warning",
                title: "Внимание",
                message: "Вы уже добавили эту коллекцию в блок",
                dismiss: {
                    onScreen: true,
                    duration: 5000
                }
            })
            return
        }

        const onAddCollectionConfirm = (questionsAmount: number) => {
            const newTestBlockCollection: TestBlockCollectionsType & { collectionName: string } = {
                collectionId: collections[index].collectionId,
                testBlockId: "",
                questionsAmount: questionsAmount,
                collectionName: collections[index].collectionName
            }
            setTestBlockCollections(prev => [...prev, newTestBlockCollection])
            setTestBlockModalWindowState(undefined)
        }


        setTestBlockModalWindowState({
            collection: collections[index],
            onConfirm: onAddCollectionConfirm,
            onDismiss: () => setTestBlockModalWindowState(undefined),
            backgroundOverlap: true,
            closable: true
        })

    }

    const onRemoveCollectionClick = (index: number) => {
        setTestBlockCollections(prev => prev.filter(
            (el, elIndex) => elIndex !== index))
    }

    const onPercentSuccessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (testBlock)
            setTestBlock({
                ...testBlock,
                percentSuccess: maxMinConstraint(parseInt(e.target.value || "0"), 0, 100)
            })
    }

    const onTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (testBlock)
            setTestBlock({
                ...testBlock,
                timeLimit: Math.max(parseInt(e.target.value || "0"), 0),
            })
    }


    const onDateChange = (e: Moment | string) => {
        if (testBlock && (e as Moment)?.format)
            setTestBlock({
                ...testBlock,
                dateEnd: (e as Moment)?.format() || new Date().toISOString()
            })
    }

    const onTextBlockTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (testBlock)
            setTestBlock({
                ...testBlock,
                isFileTestBlock: !testBlock.isFileTestBlock
            })
    }

    return (
        <div className={styles.test_block_container}>
            {!testBlock ?
                <div className={styles.test_block_button_container}>
                    <Button
                        title="Привязать блок"
                        stretchable
                        onClick={onBindBlockClick}
                    />
                </div> :
                <>
                    <div className={styles.test_block}>
                        <div className={utilStyles.text_medium}>Блок тестирования</div>
                        <Input
                            label="Процент для зачёта"
                            placeholder="0"
                            type="number"
                            max={100}
                            min={0}
                            value={testBlock.percentSuccess}
                            onChange={onPercentSuccessChange}
                            inputClassName={styles.test_block_input}
                        />
                        <Input
                            label="Ограничение времени"
                            placeholder="0"
                            type="number"
                            min={0}
                            value={testBlock.timeLimit}
                            onChange={onTimeLimitChange}
                            inputClassName={styles.test_block_input}
                        />
                        <div className={styles.test_block_date}>
                            <label className={styles.test_block_label}>Дата окончания</label>
                            <Datetime
                                value={new Date(testBlock.dateEnd)}
                                onChange={onDateChange}
                            />
                        </div>
                        <div>
                            <div className={utilStyles.text_medium}>Коллекции блока</div>
                            <ItemList
                                headers={[
                                    {
                                        title: "Название",
                                        field: "collectionName"
                                    },
                                    {
                                        title: "Количество вопросов",
                                        field: "questionsAmount"
                                    }
                                ]}
                                itemControlButtons={() => [
                                    {
                                        title: "Удалить",
                                        size: "small",
                                        onClick: onRemoveCollectionClick
                                    }
                                ]}
                                items={testBlockCollections}
                            />
                        </div>
                        <div>
                            <Checkbox
                                label="Блок с ответом в виде файла"
                                checked={testBlock.isFileTestBlock}
                                onChange={onTextBlockTypeChange}
                            />
                        </div>
                    </div>
                    <div className={styles.all_collections}>
                        <div className={utilStyles.text_medium}>Все коллекции</div>
                        <ItemList
                            headers={[
                                {
                                    title: "Название",
                                    field: "collectionName"
                                }
                            ]}
                            items={collections}
                            itemControlButtons={() => [
                                {
                                    title: "Добавить",
                                    size: "small",
                                    onClick: onAddCollectionClick
                                }
                            ]}
                        />
                    </div>
                    <div className={styles.test_block_button_container}>
                        <Button
                            title="Отвязать блок тестирования"
                            stretchable
                            onClick={onUnbindBlockClick}
                        />
                    </div>
                </>
            }

        </div>
    )
}

export default TestBlockEdit