import dynamic from "next/dynamic"
const LibDatetime = dynamic(() => import('react-datetime'), { ssr: false })
import { Moment } from 'moment';
import "react-datetime/css/react-datetime.css"
import styles from "./Datetime.module.scss"
import 'moment/locale/ru';

type DatetimeProps = {
    value: string | Date | Moment | undefined,
    onChange: (value: string | Moment) => void,
    time?: boolean,
    label?: string
}

const Datetime = ({
    value,
    onChange,
    time,
    label,
    ...props
}: DatetimeProps) => {

    const renderInput = (props: any, openCalendar: Function, closeCalandar: Function) => {
        return (
            <input {...props} className={styles.dateTime} />
        )
    }

    return <div className={styles.container}>
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
                onChange,
                renderInput,
                ...props
            }}
        />
    </div>
}

export default Datetime