import Layout from "components/layouts/Layout"
import Head from "next/head"
import React, { useCallback, useEffect, useState } from "react"
import utilStyles from "styles/utils.module.scss"
import dynamic from "next/dynamic"
import { ThemeType } from "../types"
import styles from "./Theme.module.scss"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, ContentState, convertToRaw } from "draft-js"
import Button from "components/elements/button/Button"
import TestBlockEdit from "./TestBlockEdit"
import { CollectionType, TestBlockCollectionType, TestBlockType } from "components/templates/testing/types"
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html';
import axiosApi from "utils/axios"
import { ENDPOINT_COURSES, ENDPOINT_TEST_BLOCK_COLLECTIONS } from "constants/endpoints"
import axios from "axios"
import addNotification from "utils/notifications"
import FileBrowser from "components/modules/fileBrowser"
import ItemList from "components/modules/itemList"
import { EduFileType } from "components/templates/education/types"
import cn from "classnames"
import { useModalWindowContext } from "context/modalWindowContext"
import { getServerErrorResponse } from "utils/serverData"

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
    const [themeFiles, setThemeFiles] = useState<EduFileType[]>([])
    const [initialTestBlock, setInitialTestBlock] = useState<TestBlockType>()
    const [testBlock, setTestBlock] = useState<TestBlockType>()
    const [selectedFile, setSelectedFile] = useState<string>()
    const {
        setThemeFileModalWindowState,
        setConfirmActionModalWindowState
    } = useModalWindowContext()

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
                testBlockCollections: [...theme.testBlock.testBlockCollections || []]
            })
            setTestBlock({
                ...theme.testBlock,
                testBlockCollections: [...theme.testBlock.testBlockCollections || []]
            })
        }
        setThemeFiles(theme.themeFiles || [])
    }, [theme])

    const onFileSelected = useCallback((path: string | undefined) => {
        setSelectedFile(path)
    }, [setSelectedFile])

    const onAddFileToTheme = () => {
        if (!selectedFile) return
        const file: EduFileType = {
            fileName: "",
            fileDescription: "",
            fileLink: "/uploads/" + selectedFile.slice(2)
        }
        setThemeFileModalWindowState({
            mode: "add",
            file,
            closable: true,
            backgroundOverlap: true,
            onConfirm: (newFile) => {
                setThemeFiles([...themeFiles, newFile])
                setThemeFileModalWindowState(undefined)
            }
        })
    }

    const onEditThemeFile = (index: number) => {
        setThemeFileModalWindowState({
            mode: "edit",
            file: themeFiles[index],
            closable: true,
            backgroundOverlap: true,
            onConfirm: (newFile) => {
                setThemeFiles(themeFiles.map((el, key) => {
                    if (key !== index) return el
                    return newFile
                }))
                setThemeFileModalWindowState(undefined)
            }
        })
    }

    const onDeleteThemeFile = (index: number) => {
        setConfirmActionModalWindowState({
            text: `Удалить файл ${themeFiles[index].fileName} из темы?`,
            onConfirm: () => {
                setThemeFiles(themeFiles.filter((el, key) => key !== index))
                setConfirmActionModalWindowState(undefined)
            },
            onDismiss: () => setConfirmActionModalWindowState(undefined),
            closable: true,
            backgroundOverlap: true
        })
    }

    const saveMainData = async () => {
        const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        const data = {
            title: theme.title,
            html,
            themeFiles,
        }
        await axiosApi.put(`${ENDPOINT_COURSES}/Themes/${theme.themeId}`, data)
            .then(res => {
                addNotification({ type: "success", title: "Успех", message: "Информационные разделы сохранены" })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось сохранить информационные разделы сохранены:\n${getServerErrorResponse(err)}` })
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
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Не удалось добавить блок тестирования", message: getServerErrorResponse(err) })
                return
            })

        if (!testBlock.testBlockCollections) {
            addNotification({ type: "success", title: "Блок тестирования добавлен" })
            setInitialTestBlock({
                ...testBlock,
                testBlockId: newTestBlock!.testBlockId
            })
            setTestBlock({
                ...testBlock,
                testBlockId: newTestBlock!.testBlockId
            })
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
                const updatedTestBlockCollections: TestBlockCollectionType[] =
                    testBlock.testBlockCollections!.map((el, index) => {
                        return {
                            ...el,
                            testBlockCollectionId: res[index].data
                        }
                    })
                setInitialTestBlock({
                    ...testBlock,
                    testBlockCollections: [...updatedTestBlockCollections],
                    testBlockId: newTestBlock!.testBlockId
                })
                setTestBlock({
                    ...testBlock,
                    testBlockCollections: [...updatedTestBlockCollections],
                    testBlockId: newTestBlock!.testBlockId
                })
                addNotification({ type: "success", title: "Блок тестирования добавлен" })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Не удалось добавить блок тестирования", message: getServerErrorResponse(err) })
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
        await axiosApi.put(`${ENDPOINT_COURSES}/Themes/${theme.themeId}/TestBlock`, data)
            .then(res => {
                addNotification({ type: "success", title: "Успех", message: "Основная информация блока тестирования обновлена" })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось обновить основную информацию блока тестирования:\n${getServerErrorResponse(err)}` })
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
                addNotification({ type: "success", title: "Успех", message: "Коллекции блока тестирования обновлены" })

                let newCollectionIdIndex = 0
                const updatedTestBlockCollections: TestBlockCollectionType[] =
                    testBlockCollections.map(testBlockCollection => {
                        if (newTestBlockCollections.find(newTestBlockCollection =>
                            newTestBlockCollection.collectionId === testBlockCollection.collectionId)) {
                            return {
                                ...testBlockCollection,
                                testBlockCollectionId: res[newCollectionIdIndex++].data
                            }
                        }
                        return testBlockCollection
                    })
                setInitialTestBlock({
                    ...testBlock,
                    testBlockCollections: [...updatedTestBlockCollections]
                })
                setTestBlock({
                    ...testBlock,
                    testBlockCollections: [...updatedTestBlockCollections]
                })
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось обновить коллекции блока тестирования:\n${getServerErrorResponse(err)}` })
            })
    }

    const removeTestBlock = async () => {
        await axiosApi.delete(`${ENDPOINT_COURSES}/Themes/${theme.themeId}/TestBlock`)
            .then(res => {
                addNotification({ type: "success", title: "Блок тестирования удалён" })
                setInitialTestBlock(undefined)
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось удалить блок тестирования:\n${getServerErrorResponse(err)}` })
            })
    }

    const onSaveClick = async () => {
        await saveMainData()
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
                <title>{`Настройка темы "${theme.title}"`}</title>
            </Head>
            <div className={utilStyles.title}>{`Настройка темы "${theme.title}"`}</div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>{`Информационные материалы (обязательно)`}</div>
                <Editor
                    wrapperClassName={styles.editor_wrapper}
                    editorClassName={styles.editor}
                    toolbarClassName={styles.editor_toolbar}
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                    toolbar={{
                        options: ['inline', 'list', 'textAlign', 'history']
                    }}
                />
            </div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>{`Информационные материалы – файлы с описанием (необязательно)`}</div>
                <div className={styles.theme_files_container}>
                    <div className={styles.file_browser_container}>
                        <FileBrowser
                            onFileSelected={onFileSelected}
                        />
                        <div className={cn(
                            styles.add_file_button_container,
                            { [styles.hidden]: !selectedFile }
                        )}>
                            <Button
                                title="Добавить файл в тему"
                                onClick={onAddFileToTheme}
                            />
                        </div>
                    </div>
                    <ItemList
                        headers={[
                            {
                                title: "Название",
                                field: "fileName",
                                colSize: "200px"
                            },
                            {
                                title: "Описание",
                                field: "fileDescription",
                                colSize: "300px"
                            },
                            {
                                title: "Путь",
                                field: "fileLink",
                                colSize: "300px"
                            }
                        ]}
                        items={themeFiles}
                        itemControlButtons={() => [
                            {
                                title: "Изменить",
                                size: "small",
                                onClick: onEditThemeFile
                            },
                            {
                                title: "Удалить",
                                size: "small",
                                onClick: onDeleteThemeFile
                            }
                        ]}
                    />
                </div>
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
                            title="Привязать блок тестирования"
                            stretchable
                            onClick={onBindBlockClick}
                        />
                    </div>
                }
            </div>
            <Button
                title="Сохранить всё"
                size="small"
                stretchable={true}
                onClick={onSaveClick}
                className={styles.save_button}
            />
        </Layout>
    )
}

export default ThemeTemplate