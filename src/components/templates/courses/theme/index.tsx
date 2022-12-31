import Layout from "components/layouts/Layout"
import Head from "next/head"
import React, { useEffect, useState } from "react"
import utilStyles from "styles/utils.module.scss"
import dynamic from "next/dynamic"
import { ThemeType } from "../types"
import styles from "./Theme.module.scss"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, ContentState, convertToRaw } from "draft-js"
import Button from "components/elements/button/Button"
import FileLoader from "components/modules/fileLoader"
import TestBlockEdit from "./TestBlockEdit"
import { CollectionType, TestBlockCollectionsType, TestBlockType } from "components/templates/testing/types"
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html';
import axiosApi from "utils/axios"
import { ENDPOINT_COURSES, ENDPOINT_TEST_BLOCK_COLLECTIONS } from "constants/endpoints"
import axios from "axios"
import addNotification from "utils/notifications"

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then(mod => mod.Editor),
    { ssr: false }
)

type ThemeTemplateProps = {
    theme: ThemeType,
    collections: CollectionType[]
}

const ThemeTemplate = ({
    theme,
    collections
}: ThemeTemplateProps) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [files, setFiles] = useState<File[]>([])
    const [initialTestBlock, setInitialTestBlock] = useState<TestBlockType>()
    const [testBlock, setTestBlock] = useState<TestBlockType>()

    const onEditorStateChange = (editorState: any) => {
        setEditorState(editorState)
    }

    const onBindBlockClick = () => {
        setTestBlock({
            testBlockId: "",
            dateEnd: new Date().toISOString(),
            isFileTestBlock: false,
            percentSuccess: 100,
            timeLimit: 60,
            testBlockCollections: []
        })
    }

    const onUnbindTestBlockClick = () => {
        setTestBlock(undefined)
    }

    useEffect(() => {
        const html = theme.html
        const contentBlock = htmlToDraft(html)
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
        if (theme.testBlock) {
            setInitialTestBlock({
                ...theme.testBlock,
                testBlockCollections: theme.testBlock.testBlockCollections || []
            })
            setTestBlock({
                ...theme.testBlock,
                testBlockCollections: theme.testBlock.testBlockCollections || []
            })
        }
    }, [theme])

    const saveMainData = async () => {
        const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        const data = {
            title: theme.title,
            html
        }
        await axiosApi.put(`${ENDPOINT_COURSES}/Themes/${theme.themeId}`, data)
            .then(res => {
                addNotification({ type: "success", title: "Тема сохранена" })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Не удалось сохранить тему", message: err.code })
            })
    }

    const addNewTestBlock = async () => {
        if (!testBlock) return
        const data = {
            timeLimit: testBlock.timeLimit,
            isFileTestBlock: testBlock.isFileTestBlock,
            percentSuccess: testBlock.percentSuccess,
            dateEnd: testBlock.dateEnd
        }
        let newTestBlock: TestBlockType | undefined
        await axiosApi.post(`${ENDPOINT_COURSES}/Themes/${theme.themeId}/TestBlock`, data)
            .then(res => {
                newTestBlock = res.data
                setInitialTestBlock(newTestBlock)
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Не удалось добавить блок тестирования", message: err.code })
                return
            })
        if (!testBlock.testBlockCollections) {
            addNotification({ type: "success", title: "Блок тестирования добавлен" })
            return
        }
        await axios.all(testBlock.testBlockCollections.map(el => {
            const data = {
                testBlockId: newTestBlock!.testBlockId,
                collectionId: el.collectionId,
                questionsAmount: el.questionsAmount
            }
            return axiosApi.post(ENDPOINT_TEST_BLOCK_COLLECTIONS, data)
        }))
            .then(res => {
                setInitialTestBlock({
                    ...initialTestBlock!,
                    testBlockCollections: [...testBlock.testBlockCollections || []]
                })
                addNotification({ type: "success", title: "Блок тестирования добавлен" })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Не удалось добавить блок тестирования", message: err.code })
            })
    }

    const updateTestBlock = async () => {
        if (!testBlock || !initialTestBlock) return
        const data = {
            testBlockId: testBlock.testBlockId,
            timeLimit: testBlock.timeLimit,
            isFileTestBlock: testBlock.isFileTestBlock,
            percentSuccess: testBlock.percentSuccess,
            dateEnd: testBlock.dateEnd
        }
        await axiosApi.put(`${ENDPOINT_COURSES}/Themes/${theme.themeId}/TestBlock/${testBlock.testBlockId}`, data)
            .catch(err => {
                return
            })

        const testBlockCollections = testBlock.testBlockCollections || []

        const newTestBlockCollections = testBlockCollections.filter(testBlockCollection =>
            !initialTestBlock.testBlockCollections!.find(initialTestBlockCollection =>
                testBlockCollection.testBlockCollectionId === initialTestBlockCollection.testBlockCollectionId))
        const updatedTestBlockCollections = testBlockCollections.filter(testBlockCollection =>
            initialTestBlock.testBlockCollections!.find(initialTestBlockCollection =>
                testBlockCollection.testBlockCollectionId === initialTestBlockCollection.testBlockCollectionId))
        const deletedTestBlockCollections = initialTestBlock.testBlockCollections!.filter(initialTestBlockCollection =>
            !testBlockCollections.find(testBlockCollection =>
                initialTestBlockCollection.testBlockCollectionId === testBlockCollection.testBlockCollectionId))

        await axios.all([
            ...newTestBlockCollections.map(el => {
                const data = {
                    testBlockId: testBlock.testBlockId,
                    collectionId: el.collectionId,
                    questionsAmount: el.questionsAmount
                }
                return axiosApi.post(ENDPOINT_TEST_BLOCK_COLLECTIONS, data)
            }),
            ...updatedTestBlockCollections.map(el => {
                const data = {
                    testBlockCollectionId: el.testBlockCollectionId,
                    testBlockId: testBlock.testBlockId,
                    collectionId: el.collectionId,
                    questionsAmount: el.questionsAmount
                }
                return axiosApi.put(`${ENDPOINT_TEST_BLOCK_COLLECTIONS}/${el.testBlockCollectionId}`, data)
            }),
            ...deletedTestBlockCollections.map(el => {
                return axiosApi.delete(`${ENDPOINT_TEST_BLOCK_COLLECTIONS}/${el.testBlockCollectionId}`)
            })
        ])
            .then(res => {
                addNotification({ type: "success", title: "Коллекции блока тестирования обновлены" })
                setInitialTestBlock({
                    ...initialTestBlock,
                    testBlockCollections: [...testBlockCollections]
                })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Не удалось обновить коллекции блока тестирования", message: err.code })
            })
    }

    const removeTestBlock = async () => {
        await axiosApi.delete(`${ENDPOINT_COURSES}/Themes/${theme.themeId}/TestBlock`)
            .then(res => {
                addNotification({ type: "success", title: "Блок тестирования удалён" })
                setInitialTestBlock(undefined)
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Не удалось удалить блок тестирования", message: err.code })
            })
    }

    const onSaveClick = async () => {
        saveMainData()
        if (initialTestBlock) {
            if (!testBlock)
                return removeTestBlock()
            return updateTestBlock()
        }
        if (!initialTestBlock && testBlock) {
            addNewTestBlock()
        }
    }

    return (
        <Layout>
            <Head>
                <title>Настройка темы</title>
            </Head>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>{`Информационные материалы (обязательно)`}</div>
                <Editor
                    wrapperClassName={styles.editor_wrapper}
                    editorClassName={styles.editor}
                    toolbarClassName={styles.editor_toolbar}
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                    toolbar={{
                        options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'image', 'remove', 'history']
                    }}
                />
            </div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>{`Информационные материалы – файлы с описанием (необязательно)`}</div>
                <FileLoader
                    {...{
                        files,
                        setFiles
                    }}
                />
            </div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>{`Тестирование (необязательно)`}</div>
                {testBlock ?
                    <>
                        <TestBlockEdit
                            {...{
                                testBlock,
                                setTestBlock,
                                collections
                            }}
                        />
                        <div className={styles.test_block_button_container}>
                            <Button
                                title="Отвязать блок тестирования"
                                stretchable
                                onClick={onUnbindTestBlockClick}
                            />
                        </div>
                    </> :
                    <div className={styles.test_block_button_container}>
                        <Button
                            title="Привязать блок"
                            stretchable
                            onClick={onBindBlockClick}
                        />
                    </div>
                }
            </div>
            <Button
                title="Сохранить"
                size="small"
                onClick={onSaveClick}
            />
        </Layout>
    )
}

export default ThemeTemplate