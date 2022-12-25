import dynamic from "next/dynamic"
const LibDatetime = dynamic(() => import('react-datetime'), { ssr: false })
import { Moment } from 'moment';
import "react-datetime/css/react-datetime.css"
import styles from "./Datetime.module.scss"

type DatetimeProps = {
    value: string | Date | Moment | undefined,
    onChange: (value: string | Moment) => void
}

const Datetime = ({
    value,
    onChange,
    ...props
}: DatetimeProps) => {

    return <LibDatetime
        {...{
            className: styles.container,
            closeOnClickOutside: true,
            locale: "ru",
            value,
            onChange,
            ...props
        }}
    />
}

export default Datetime