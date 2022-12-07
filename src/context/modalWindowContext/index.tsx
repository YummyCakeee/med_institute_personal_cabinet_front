import ConfirmActionModalWindow from "components/modules/modalWindows/confirmActionModalWindow"
import { ConfirmActionModalWindowProps } from "components/modules/modalWindows/confirmActionModalWindow"
import CourseModalWindow, { CourseModalWindowProps } from "components/modules/modalWindows/courseModalWindow"
import React, { createContext, useContext, useState } from "react"

interface ModalWindowContext {
    setConfirmActionModalWindowState: React.Dispatch<React.SetStateAction<ConfirmActionModalWindowProps>>,
    closeConfirmActionModalWindow: () => void,
    setCourseModalWindowState: React.Dispatch<React.SetStateAction<CourseModalWindowProps>>,
    closeCourseModalWindow: () => void
}

const ModalWindowContext = createContext<ModalWindowContext>({
    setConfirmActionModalWindowState: () => { },
    closeConfirmActionModalWindow: () => { },
    setCourseModalWindowState: () => { },
    closeCourseModalWindow: () => { }
})


const defaultConfirmActionModalWindowState: ConfirmActionModalWindowProps = {
    onConfirm: () => { },
    onDismiss: () => { }
}

const defaultCourseModalWindowState: CourseModalWindowProps = {
    mode: "add"
}

const ModalWindowWrapper = ({
    children
}: { children: React.ReactNode }) => {
    const [confirmActionModalWindowState, setConfirmActionModalWindowState] = useState<ConfirmActionModalWindowProps>(defaultConfirmActionModalWindowState)
    const [courseModalWindowState, setCourseModalWindowState] = useState<CourseModalWindowProps>(defaultCourseModalWindowState)

    const closeConfirmActionModalWindow = () => {
        setConfirmActionModalWindowState(defaultConfirmActionModalWindowState)
    }

    const closeCourseModalWindow = () => {
        setCourseModalWindowState(defaultCourseModalWindowState)
    }

    return (
        <ModalWindowContext.Provider
            value={{
                setConfirmActionModalWindowState,
                closeConfirmActionModalWindow,
                setCourseModalWindowState,
                closeCourseModalWindow
            }}
        >
            <ConfirmActionModalWindow
                {...{
                    onClose: closeConfirmActionModalWindow,
                    ...confirmActionModalWindowState
                }}
            />
            <CourseModalWindow
                {...{
                    onClose: closeCourseModalWindow,
                    ...courseModalWindowState
                }}
            />
            {children}
        </ModalWindowContext.Provider>
    )
}

export const useModalWindowContext = () => useContext(ModalWindowContext)

export default ModalWindowWrapper