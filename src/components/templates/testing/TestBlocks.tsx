import React from "react"
import utilStyles from "styles/utils.module.scss"
import ItemList from "components/modules/itemList"

const TestBlocks = () => {

    return (
        <>
            <div className={utilStyles.section_title}>Тестовые блоки</div>
            <ItemList
                headers={[
                    {
                        title: "Тип теста",
                        field: "testTypeId",
                    },
                    {
                        title: "Тело теста",
                        field: "testBody",
                    },
                    {
                        title: "Коллекция",
                        field: "collection",
                    }
                ]}
                controlButtonsBottom={[
                    {
                        title: "Добавить",
                        size: "small"
                    }
                ]}
            />
        </>
    )
}

export default TestBlocks