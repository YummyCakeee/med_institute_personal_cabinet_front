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
import { CollectionType, TestBlockType } from "components/templates/testing/types"
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html';

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
    const [testBlock, setTestBlock] = useState<TestBlockType | undefined>(theme.testBlock)

    const onEditorStateChange = (editorState: any) => {
        setEditorState(editorState)
    };

    useEffect(() => {
        const html = theme.html
        const contentBlock = htmlToDraft(html)
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    }, [theme])

    const onSaveClick = () => {
        const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
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
                        options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'image', 'remove', 'history'],
                        blockType: {
                            inDropdown: true,
                            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']
                        },
                        fontSize: {
                            options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96]
                        },
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
                <TestBlockEdit
                    {...{
                        testBlock,
                        setTestBlock,
                        collections
                    }}
                />
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