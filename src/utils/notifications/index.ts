import { iNotification, NOTIFICATION_CONTAINER, NOTIFICATION_TYPE, Store } from "react-notifications-component"

interface NotificationProps extends Omit<iNotification, "container"> {
    type: NOTIFICATION_TYPE,
    title: string,
    message?: string,
    container?: NOTIFICATION_CONTAINER
}

const addNotification = ({
    type,
    title,
    message = "",
    container = "top-right",
    ...props
}: NotificationProps) => {
    Store.addNotification({
        container,
        type,
        title,
        message,
        dismiss: {
            duration: 5000,
            onScreen: true
        },
        ...props
    })
}

export default addNotification