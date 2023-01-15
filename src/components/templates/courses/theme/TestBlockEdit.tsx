import Input from "components/elements/input/Input"
import { CollectionType, TestBlockCollectionsType, TestBlockType } from "components/templates/testing/types"
import React from "react"
import styles from "./Theme.module.scss"
import 'moment/locale/ru';
import ItemList from "components/modules/itemList"
import utilStyles from "styles/utils.module.scss"
import Checkbox from "components/elements/checkbox/Checkbox"
import { maxMinConstraint } from "utils/computations"
import { Store } from "react-notifications-component"
import { useModalWindowContext } from "context/modalWindowContext"
import Datetime from "components/elements/datetime"
import { Moment } from "moment"
import cn from "classnames"
import addNotification from "utils/notifications";

type TestBlockEditProps = {
    testBlock: TestBlockType,
    setTestBlock: React.Dispatch<React.SetStateAction<TestBlockType | undefined>>,
    collections: CollectionType[]
}

const TestBlockEdit = ({
    testBlock,
    setTestBlock,
    collections
}: TestBlockEditProps) => {

    const { setTestBlockModalWindowState } = useModalWindowContext()

    const onAddCollectionClick = (index: number) => {
        if (testBlock.testBlockCollections?.find(el => el.collectionId === collections[index].collectionId)) {
            addNotification({ type: "warning", title: "Внимание", message: "Вы уже добавили эту коллекцию в блок" })
            return
        }

        const onAddCollectionConfirm = (questionsAmount: number) => {
            const newTestBlockCollection: TestBlockCollectionsType = {
                collectionId: collections[index].collectionId!,
                testBlockId: "",
                questionsAmount: questionsAmount,
                collection: collections[index]
            }
            setTestBlock(
                {
                    ...testBlock,
                    testBlockCollections: [...(testBlock?.testBlockCollections || []), newTestBlockCollection]
                }
            )
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
        setTestBlock(
            {
                ...testBlock,
                testBlockCollections: testBlock.testBlockCollections?.filter(
                    (el, elIndex) => elIndex !== index)
            }
        )
    }

    const onPercentSuccessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTestBlock({
            ...testBlock,
            percentSuccess: maxMinConstraint(parseInt(e.target.value || "0"), 0, 100)
        })
    }

    const onTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const onTestBlockTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTestBlock({
            ...testBlock,
            isFileTestBlock: !testBlock.isFileTestBlock
        })
    }

    return (
        <div className={styles.test_block_container}>
            <div className={utilStyles.text_medium}>Основная информация о блоке тестирования</div>
            <div className={styles.test_block_main_info}>
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
                <Datetime
                    value={new Date(testBlock.dateEnd)}
                    onChange={onDateChange}
                    label="Дата окончания"
                />
            </div>
            <div className={styles.collections_container}>
                <div className={styles.test_block_collections}>
                    <div
                        className={cn(
                            utilStyles.text_medium,
                            utilStyles.text_bold
                        )}
                    >
                        Коллекции блока
                    </div>
                    <ItemList
                        headers={[
                            {
                                title: "Название",
                                field: "collection.collectionName"
                            },
                            {
                                title: "Количество вопросов",
                                field: "questionsAmount",
                                textAlign: "center"
                            }
                        ]}
                        itemControlButtons={() => [
                            {
                                title: "Удалить",
                                size: "small",
                                onClick: onRemoveCollectionClick
                            }
                        ]}
                        items={testBlock.testBlockCollections!}
                        className={styles.collection}
                    />
                </div>
                <div className={styles.all_collections}>
                    <div
                        className={cn(
                            utilStyles.text_medium,
                            utilStyles.text_bold
                        )}
                    >
                        Все коллекции
                    </div>
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
                        className={styles.collection}
                    />
                </div>
                <div>
                    <Checkbox
                        label="Брать из коллекций только упражнения с ответом в виде файла"
                        checked={testBlock.isFileTestBlock}
                        onChange={onTestBlockTypeChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default TestBlockEdit