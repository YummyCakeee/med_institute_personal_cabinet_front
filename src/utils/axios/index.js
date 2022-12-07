import axios from "axios"

export const createAxiosInstance = () => {

    const baseURL =
        (!process.env.NODE_ENV || process.env.NODE_ENV === "development") ?
            "http://localhost:5000" :
            "http://localhost:5000"

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const instance = axios.create({
        baseURL,
        headers,
        withCredentials: false
    })

    return instance
}

const axiosApi = createAxiosInstance()
export default axiosApi