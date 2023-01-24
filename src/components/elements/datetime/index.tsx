import dynamic from "next/dynamic"
const LibDatetime = dynamic(() => import('react-datetime'), { ssr: false })
import { Moment } from 'moment';
import "react-datetime/css/react-datetime.css"
import styles from "./Datetime.module.scss"
import 'moment/locale/ru';
import cn from "classnames"

type DatetimeProps = {
    value: Date | Moment | undefined,
    onChange: (value: string) => void,
    time?: boolean,
    label?: string,
    allowEmpty?: boolean,
    disabled?: boolean
}

const Datetime = ({
    value,
    onChange,
    time,
    label,
    allowEmpty,
    disabled,
    ...props
}: DatetimeProps) => {

    const renderInput = (props: any, openCalendar: Function, closeCalandar: Function) => {
        return (
            <input
                {...{
                    disabled,
                    ...props
                }}
                className={cn(
                    styles.dateTime,
                    { [styles.disabled]: disabled }
                )} />
        )
    }

    const onDateChange = (value: string | Moment) => {
        const date = value.toString()
        try {
            new Date(date)
            if (date.length || allowEmpty)
                onChange(date)
        }
        catch { }
    }

    return (
        <div className={styles.container}>
            {label &&
                <div className={styles.label}>{label}</div>
            }
            <LibDatetime
                {...{
                    closeOnClickOutside: true,
                    locale: "ru",
                    dateFormat: "DD.MM.YYYY",
                    timeFormat: time ? "HH:mm" : "",
                    value,
                    onChange: onDateChange,
                    renderInput,
                    ...props
                }}
            />
        </div>
    )
}

export default Datetime