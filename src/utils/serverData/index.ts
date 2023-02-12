import { AxiosError } from "axios"
import { TestType } from "components/templates/testing/types"

export const convertServerTestToClient = (test: TestType) => {
    const testBody = JSON.parse(test.testBody || "")
    const newTest: TestType = {
        ...test,
        exerciseText: testBody.ExerciseText || testBody.QuestionText || "",
        questionText: testBody.QuestionText || testBody.ExerciseText || "",
        answers: testBody.Answers?.map((el: any) => ({ text: el.Text, correct: el.Correct })) || [],
    }
    return newTest
}

export const getServerErrorResponse = (err: AxiosError) => {
    if (!err.isAxiosError) return err
    if (err.response?.data) {
        const data: any = err.response.data
        const errors: string[] = []
        if (data.message) return data.message
        const errorsData = data.errors
        if (errorsData) {
            Object.keys(errorsData).forEach(key => {
                errors.push(errorsData[key])
            })
            return errors.join('\n')
        }
        if (data.title) return data.title
    }
    return err.message || err.code || ""
}