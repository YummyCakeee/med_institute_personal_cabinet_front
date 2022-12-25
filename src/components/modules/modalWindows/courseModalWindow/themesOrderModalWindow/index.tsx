import axios from "axios"
import Button from "components/elements/button/Button"
import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import MovableList from "components/modules/movableList"
import { CourseType, ThemeType } from "components/templates/courses/types"
import { ENDPOINT_COURSES } from "constants/endpoints"
import React, { useState, useEffect } from "react"
import utilStyles from "styles/utils.module.scss"
import axiosApi from "utils/axios"

export interface ThemesOrderModalWindowProps extends ModalWindowProps {
    themes: ThemeType[],
    courseId: string,
    onSuccess?: (themes: ThemeType[]) => void,
    onError?: (error: any) => void,
    onDismiss?: () => void
}

const ThemesOrderModalWindow = ({
    themes: initialThemes,
    courseId,
    onSuccess = () => { },
    onError = () => { },
    onDismiss = () => { },
    ...props
}: ThemesOrderModalWindowProps) => {

    const [themes, setThemes] = useState<ThemeType[]>([])

    useEffect(() => {
        setThemes(initialThemes)
    }, [initialThemes])

    const onThemesOrderSaveClick = () => {
        axios.all(themes.map((el, index) => {
            const data: ThemeType = {
                courseId: courseId,
                themeId: el.themeId,
                title: el.title,
                html: el.html,
                sortOrder: index
            }
            return axiosApi.put(`${ENDPOINT_COURSES}/Themes/${el.themeId}`, data)
        }))
            .then(res => {
                onSuccess(themes)
            })
            .catch(err => {
                onError(err)
            })
    }


    return (
        <ModalWindow
            {...{
                title: "Изменение порядка изучения тем курса",
                ...props
            }}
        >
            <MovableList
                items={themes}
                setItems={setThemes}
                renderItem={({ title }) => (
                    `${title}`
                )}
            />
            <div className={utilStyles.modal_window_buttons_list}>
                <div className={utilStyles.modal_window_button}>
                    <Button
                        title="Подтвердить"
                        size="small"
                        onClick={onThemesOrderSaveClick}
                    />
                </div>
                <div className={utilStyles.modal_window_button}>
                    <Button
                        title="Отмена"
                        size="small"
                        onClick={onDismiss}
                    />
                </div>
            </div>
        </ModalWindow>
    )
}

export default ThemesOrderModalWindow