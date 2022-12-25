import { default as LibComboBox } from 'react-responsive-combo-box'
import 'react-responsive-combo-box/dist/index.css'
import styles from "./ComboBox.module.scss"

type ComboBoxProps = {
    options: string[],
    defaultValue?: string,
    onSelect?: (option: string) => void,
}

const ComboBox = ({
    options,
    defaultValue,
    onSelect = () => { }
}: ComboBoxProps) => {



    return (
        <LibComboBox
            options={options}
            defaultValue={defaultValue}
            editable={false}
            onSelect={onSelect}
            inputClassName={styles.combobox}
        />
    )
}

export default ComboBox