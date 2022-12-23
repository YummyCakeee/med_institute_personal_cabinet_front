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
