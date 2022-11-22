import axios from "axios"

export const createAxiosInstance = () => {

    const baseURL =
        (!process.env.NODE_ENV || process.env.NODE_ENV === "development") ?
            "https://localhost" :
            "https://localhost"

    const headers = {
        'Content-Type': 'application/json',
    }
    const instance = axios.create({
        baseURL,
        headers
    })

    return instance
}

const axiosApi = createAxiosInstance()
export default axiosApi