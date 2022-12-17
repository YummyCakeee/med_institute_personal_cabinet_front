import CollectionModalWindow, { CollectionModalWindowProps } from "components/modules/modalWindows/collectionModalWindow"
import ConfirmActionModalWindow from "components/modules/modalWindows/confirmActionModalWindow"
import { ConfirmActionModalWindowProps } from "components/modules/modalWindows/confirmActionModalWindow"
import CourseModalWindow, { CourseModalWindowProps } from "components/modules/modalWindows/courseModalWindow"
import EducationalProgramModalWindow, { EducationalProgramModalWindowProps } from "components/modules/modalWindows/educationalProgramModalWindow"
import TestModalWindow, { TestModalWindowProps } from "components/modules/modalWindows/testModalWindow"
import UserModalWindow, { UserModalWindowProps } from "components/modules/modalWindows/userModalWindow"
import React, { createContext, useContext, useState } from "react"

interface ModalWindowContext {
    setConfirmActionModalWindowState: React.Dispatch<React.SetStateAction<ConfirmActionModalWindowProps | undefined>>,
    setCourseModalWindowState: React.Dispatch<React.SetStateAction<CourseModalWindowProps | undefined>>,
    setEducationalProgramModalWindowState: React.Dispatch<React.SetStateAction<EducationalProgramModalWindowProps | undefined>>,
    setUserModalWindowState: React.Dispatch<React.SetStateAction<UserModalWindowProps | undefined>>,
    setCollectionModalWindowState: React.Dispatch<React.SetStateAction<CollectionModalWindowProps | undefined>>,
    setTestModalWindowState: React.Dispatch<React.SetStateAction<TestModalWindowProps | undefined>>
}

const ModalWindowContext = createContext<ModalWindowContext>({
    setConfirmActionModalWindowState: () => { },
    setCourseModalWindowState: () => { },
    setUserModalWindowState: () => { },
    setEducationalProgramModalWindowState: () => { },
    setCollectionModalWindowState: () => { },
    setTestModalWindowState: () => { }
})

const ModalWindowWrapper = ({
    children
}: { children: React.ReactNode }) => {
    const [confirmActionModalWindowState, setConfirmActionModalWindowState] = useState<ConfirmActionModalWindowProps | undefined>(undefined)
    const [courseModalWindowState, setCourseModalWindowState] = useState<CourseModalWindowProps | undefined>(undefined)
    const [educationalProgramModalWindowState, setEducationalProgramModalWindowState] = useState<EducationalProgramModalWindowProps | undefined>(undefined)
    const [userModalWindowState, setUserModalWindowState] = useState<UserModalWindowProps | undefined>(undefined)
    const [collectionModalWindowState, setCollectionModalWindowState] = useState<CollectionModalWindowProps | undefined>()
    const [testModalWindowState, setTestModalWindowState] = useState<TestModalWindowProps | undefined>()

    return (
        <ModalWindowContext.Provider
            value={{
                setConfirmActionModalWindowState,
                setCourseModalWindowState,
                setEducationalProgramModalWindowState,
                setUserModalWindowState,
                setCollectionModalWindowState,
                setTestModalWindowState
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
            <EducationalProgramModalWindow
                {...{
                    onClose: () => setEducationalProgramModalWindowState(undefined),
                    ...educationalProgramModalWindowState,
                    isShowing: !!educationalProgramModalWindowState
                }}
            />
            <UserModalWindow
                {...{
                    onClose: () => setUserModalWindowState(undefined),
                    ...userModalWindowState,
                    isShowing: !!userModalWindowState
                }}
            />
            <CollectionModalWindow
                {...{
                    onClose: () => setCollectionModalWindowState(undefined),
                    ...collectionModalWindowState,
                    isShowing: !!collectionModalWindowState
                }}
            />
            <TestModalWindow
                {...{
                    onClose: () => setTestModalWindowState(undefined),
                    ...testModalWindowState,
                    isShowing: !!testModalWindowState
                }}
            />
            {children}
        </ModalWindowContext.Provider>
    )
}

export const useModalWindowContext = () => useContext(ModalWindowContext)

export default ModalWindowWrapper