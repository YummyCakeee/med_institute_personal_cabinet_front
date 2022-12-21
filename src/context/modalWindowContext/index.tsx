import CollectionModalWindow, { CollectionModalWindowProps } from "components/modules/modalWindows/collectionModalWindow"
import ConfirmActionModalWindow from "components/modules/modalWindows/confirmActionModalWindow"
import { ConfirmActionModalWindowProps } from "components/modules/modalWindows/confirmActionModalWindow"
import CourseModalWindow, { CourseModalWindowProps } from "components/modules/modalWindows/courseModalWindow"
import EducationalProgramModalWindow, { EducationalProgramModalWindowProps } from "components/modules/modalWindows/educationalProgramModalWindow"
import TestBlockModalWindow, { TestBlockModalWindowProps } from "components/modules/modalWindows/testBlockModalWindow"
import TestModalWindow, { TestModalWindowProps } from "components/modules/modalWindows/testModalWindow"
import ThemeModalWindow, { ThemeModalWindowProps } from "components/modules/modalWindows/themeModalWindow"
import UserModalWindow, { UserModalWindowProps } from "components/modules/modalWindows/userModalWindow"
import React, { createContext, useContext, useState } from "react"

interface ModalWindowContext {
    setConfirmActionModalWindowState: React.Dispatch<React.SetStateAction<ConfirmActionModalWindowProps | undefined>>,
    setCourseModalWindowState: React.Dispatch<React.SetStateAction<CourseModalWindowProps | undefined>>,
    setEducationalProgramModalWindowState: React.Dispatch<React.SetStateAction<EducationalProgramModalWindowProps | undefined>>,
    setUserModalWindowState: React.Dispatch<React.SetStateAction<UserModalWindowProps | undefined>>,
    setCollectionModalWindowState: React.Dispatch<React.SetStateAction<CollectionModalWindowProps | undefined>>,
    setTestModalWindowState: React.Dispatch<React.SetStateAction<TestModalWindowProps | undefined>>,
    setThemeModalWindowState: React.Dispatch<React.SetStateAction<ThemeModalWindowProps | undefined>>,
    setTestBlockModalWindowState: React.Dispatch<React.SetStateAction<TestBlockModalWindowProps | undefined>>,
}

const ModalWindowContext = createContext<ModalWindowContext>({
    setConfirmActionModalWindowState: () => { },
    setCourseModalWindowState: () => { },
    setUserModalWindowState: () => { },
    setEducationalProgramModalWindowState: () => { },
    setCollectionModalWindowState: () => { },
    setTestModalWindowState: () => { },
    setThemeModalWindowState: () => { },
    setTestBlockModalWindowState: () => { }
})

const ModalWindowWrapper = ({
    children
}: { children: React.ReactNode }) => {
    const [confirmActionModalWindowState, setConfirmActionModalWindowState] = useState<ConfirmActionModalWindowProps>()
    const [courseModalWindowState, setCourseModalWindowState] = useState<CourseModalWindowProps>()
    const [educationalProgramModalWindowState, setEducationalProgramModalWindowState] = useState<EducationalProgramModalWindowProps>()
    const [userModalWindowState, setUserModalWindowState] = useState<UserModalWindowProps>()
    const [collectionModalWindowState, setCollectionModalWindowState] = useState<CollectionModalWindowProps>()
    const [testModalWindowState, setTestModalWindowState] = useState<TestModalWindowProps>()
    const [themeModalWindowState, setThemeModalWindowState] = useState<ThemeModalWindowProps>()
    const [testBlockModalWindowState, setTestBlockModalWindowState] = useState<TestBlockModalWindowProps>()

    return (
        <ModalWindowContext.Provider
            value={{
                setConfirmActionModalWindowState,
                setCourseModalWindowState,
                setEducationalProgramModalWindowState,
                setUserModalWindowState,
                setCollectionModalWindowState,
                setTestModalWindowState,
                setThemeModalWindowState,
                setTestBlockModalWindowState
            }}
        >
            {!!confirmActionModalWindowState &&
                <ConfirmActionModalWindow
                    {...{
                        onClose: () => setConfirmActionModalWindowState(undefined),
                        ...confirmActionModalWindowState
                    }}
                />
            }
            {!!courseModalWindowState &&
                <CourseModalWindow
                    {...{
                        onClose: () => setCourseModalWindowState(undefined),
                        ...courseModalWindowState
                    }}
                />
            }
            {!!educationalProgramModalWindowState &&
                <EducationalProgramModalWindow
                    {...{
                        onClose: () => setEducationalProgramModalWindowState(undefined),
                        ...educationalProgramModalWindowState
                    }}
                />
            }
            {!!userModalWindowState &&
                <UserModalWindow
                    {...{
                        onClose: () => setUserModalWindowState(undefined),
                        ...userModalWindowState
                    }}
                />
            }
            {!!collectionModalWindowState &&
                <CollectionModalWindow
                    {...{
                        onClose: () => setCollectionModalWindowState(undefined),
                        ...collectionModalWindowState,
                    }}
                />
            }
            {!!testModalWindowState &&
                <TestModalWindow
                    {...{
                        onClose: () => setTestModalWindowState(undefined),
                        ...testModalWindowState
                    }}
                />
            }
            {!!themeModalWindowState &&
                <ThemeModalWindow
                    {...{
                        onClose: () => setThemeModalWindowState(undefined),
                        ...themeModalWindowState
                    }}
                />
            }
            {!!testBlockModalWindowState &&
                <TestBlockModalWindow
                    {...{
                        onClose: () => setTestBlockModalWindowState(undefined),
                        ...testBlockModalWindowState
                    }}

                />
            }
            {children}
        </ModalWindowContext.Provider>
    )
}

export const useModalWindowContext = () => useContext(ModalWindowContext)

export default ModalWindowWrapper