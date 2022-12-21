export const ENDPOINT_REGISTER = "api/Account/Register"
export const ENDPOINT_LOGIN = "api/Account/Login"
export const ENDPOINT_LOGOUT = "api/Account/Logout"
export const ENDPOINT_COURSES = "api/Courses"
export const ENDPOINT_THEMES = "api/Themes"
export const getCourseThemesEndpoint = (courseId: string) =>
    `${ENDPOINT_COURSES}/${courseId}/Themes`
export const ENDPOINT_USERS = ""
export const ENDPOINT_COLLECTIONS = "api/Collections"
export const ENDPOINT_TEST_BLOCKS = "api/TestBlocks"
export const ENDPOINT_EDUCATIONAL_PROGRAMS = "api/Program"