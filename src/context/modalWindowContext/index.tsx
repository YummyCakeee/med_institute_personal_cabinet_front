import ConfirmActionModalWindow from "components/modules/modalWindows/confirmActionModalWindow"
import { IConfirmActionModalWindowProps } from "components/modules/modalWindows/confirmActionModalWindow"
import React, { createContext, useContext, useState } from "react"

interface IModalWindowContext {
    setConfirmActionModalWindowState: React.Dispatch<React.SetStateAction<IConfirmActionModalWindowProps>>,
    closeConfirmActionModalWindow: () => void
}

const ModalWindowContext = createContext<IModalWindowContext>({
    setConfirmActionModalWindowState: () => { },
    closeConfirmActionModalWindow: () => { }
})


const defaultConfirmActionModalWindowState: IConfirmActionModalWindowProps = {
    onConfirm: () => { },
    onDismiss: () => { }
}

const ModalWindowWrapper = ({
    children
}: { children: React.ReactNode }) => {
    const [confirmActionModalWindowState, setConfirmActionModalWindowState] = useState<IConfirmActionModalWindowProps>(defaultConfirmActionModalWindowState)
    const closeConfirmActionModalWindow = () => {
        setConfirmActionModalWindowState(defaultConfirmActionModalWindowState)
    }
    return (
        <ModalWindowContext.Provider
            value={{
                setConfirmActionModalWindowState,
                closeConfirmActionModalWindow
            }}
        >
            <ConfirmActionModalWindow
                {...{
                    onClose: closeConfirmActionModalWindow,
                    ...confirmActionModalWindowState
                }}
            />
            {children}
        </ModalWindowContext.Provider>
    )
}

export const useModalWindowContext = () => useContext(ModalWindowContext)

export default ModalWindowWrapper