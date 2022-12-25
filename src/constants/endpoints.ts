export const ENDPOINT_ACCOUNT = "api/Account"
export const ENDPOINT_COURSES = "api/Courses"
export const ENDPOINT_PROGRAMS = "api/Program"
export const ENDPOINT_THEMES = "api/Themes"
export const getCourseThemesEndpoint = (courseId: string) =>
    `${ENDPOINT_COURSES}/${courseId}/Themes`
export const ENDPOINT_USER_THEMES = "api/UserTheme"
export const ENDPOINT_USERS = "api/Users"
export const ENDPOINT_COLLECTIONS = "api/Collections"
export const ENDPOINT_TESTS = "api/Tests"
export const ENDPOINT_TEST_BLOCKS = "api/TestBlocks"
export const ENDPOINT_EDUCATIONAL_PROGRAMS = "api/Program"