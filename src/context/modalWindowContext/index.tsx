import ConfirmActionModalWindow from "components/modules/modalWindows/confirmActionModalWindow"
import { ConfirmActionModalWindowProps } from "components/modules/modalWindows/confirmActionModalWindow"
import CourseModalWindow, { CourseModalWindowProps } from "components/modules/modalWindows/courseModalWindow"
import UserModalWindow, { UserModalWindowProps } from "components/modules/modalWindows/userModalWindow"
import React, { createContext, useContext, useState } from "react"

interface ModalWindowContext {
    setConfirmActionModalWindowState: React.Dispatch<React.SetStateAction<ConfirmActionModalWindowProps | undefined>>,
    setCourseModalWindowState: React.Dispatch<React.SetStateAction<CourseModalWindowProps | undefined>>,
    setUserModalWindowState: React.Dispatch<React.SetStateAction<UserModalWindowProps | undefined>>,
}

const ModalWindowContext = createContext<ModalWindowContext>({
    setConfirmActionModalWindowState: () => { },
    setCourseModalWindowState: () => { },
    setUserModalWindowState: () => { },
})

const ModalWindowWrapper = ({
    children
}: { children: React.ReactNode }) => {
    const [confirmActionModalWindowState, setConfirmActionModalWindowState] = useState<ConfirmActionModalWindowProps | undefined>(undefined)
    const [courseModalWindowState, setCourseModalWindowState] = useState<CourseModalWindowProps | undefined>(undefined)
    const [userModalWindowState, setUserModalWindowState] = useState<UserModalWindowProps | undefined>(undefined)

    return (
        <ModalWindowContext.Provider
            value={{
                setConfirmActionModalWindowState,
                setCourseModalWindowState,
                setUserModalWindowState,
            }}
        >
            <ConfirmActionModalWindow
                {...{
                    onClose: () => setConfirmActionModalWindowState(undefined),
                    ...confirmActionModalWindowState,
                    isShowing: !!confirmActionModalWindowState
                }}
            />
            <CourseModalWindow
                {...{
                    onClose: () => setCourseModalWindowState(undefined),
                    ...courseModalWindowState,
                    isShowing: !!courseModalWindowState
                }}
            />
            <UserModalWindow
                {...{
                    onClose: () => setUserModalWindowState(undefined),
                    ...userModalWindowState,
                    isShowing: !!userModalWindowState
                }}
            />
            {children}
        </ModalWindowContext.Provider>
    )
}

export const useModalWindowContext = () => useContext(ModalWindowContext)

export default ModalWindowWrapper