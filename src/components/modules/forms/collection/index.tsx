import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import { CollectionType } from "components/templates/testing/useTesting"
import { Field, Formik, Form } from "formik"
import { notEmptyValidator } from "utils/validators"
import utilStyles from "styles/utils.module.scss"

interface CollectionFormProps {
    mode?: "add" | "edit",
    collection?: CollectionType
}

const CollectionForm = ({
    mode = "add",
    collection
}: CollectionFormProps) => {

    const onSubmit = async () => {

    }

    return (
        <Formik
            initialValues={mode === "add" ?
                {
                    name: ""
                } :
                {
                    name: collection?.collectionName || ""
                }
            }
            onSubmit={onSubmit}
        >
            {({ }) => (
                <Form>
                    <Field
                        name="name"
                        placeholder="Название коллекции"
                        component={InputField}
                        validate={notEmptyValidator}
                    />
                    <div className={utilStyles.form_button_container}>
                        <Button
                            title={mode === "add" ? "Добавить" : "Сохранить"}
                            size="small"
                            type="submit"
                        />
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default CollectionForm