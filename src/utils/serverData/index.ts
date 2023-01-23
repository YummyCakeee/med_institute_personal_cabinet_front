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
    if (err.response?.data) {
        const errors: string[] = []
        const errorsData = (err.response.data as any).errors

        Object.keys(errorsData).forEach(key => {
            errors.push(errorsData[key])
        })
        return errors.join('\n')
    }
    return err.message ? err.message : err.code
}