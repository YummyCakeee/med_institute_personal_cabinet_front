import Button from "components/elements/button/Button"
import InputField from "components/elements/formikComponents/inputField/InputField"
import { CollectionType } from "components/templates/testing/types"
import { Field, Formik, Form, FormikValues } from "formik"
import { notEmptyValidator } from "utils/validators"
import utilStyles from "styles/utils.module.scss"
import axiosApi from "utils/axios"
import { ENDPOINT_COLLECTIONS } from "constants/endpoints"

interface CollectionFormProps {
    mode: "add" | "edit",
    collection?: CollectionType,
    onSuccess?: (collection: CollectionType) => void,
    onError?: (error: any) => void
}

const CollectionForm = ({
    mode,
    collection,
    onSuccess = () => { },
    onError = () => { }
}: CollectionFormProps) => {

    const onSubmit = async (values: FormikValues) => {
        const data: CollectionType = {
            collectionName: values.name
        }
        if (mode === "add") {
            return await axiosApi.post(ENDPOINT_COLLECTIONS, data)
                .then(res => {
                    onSuccess(res.data)
                })
                .catch(err => {
                    onError(err)
                })
        }
        data.collectionId = collection?.collectionId
        return await axiosApi.put(`${ENDPOINT_COLLECTIONS}/${collection?.collectionId}`, data)
            .then(res => {
                const updatedCollection: CollectionType = {
                    ...collection,
                    collectionName: values.name
                }
                onSuccess(updatedCollection)
            })
            .catch(err => {
                onError(err)
            })
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