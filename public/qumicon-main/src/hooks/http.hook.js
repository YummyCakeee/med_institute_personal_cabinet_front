import axios from "axios";
import {App} from "antd";

/**
 * HTTP method
 * @type {{POST: string, GET: string}}
 */
const method = {
    POST: 'POST',
    GET: 'GET',
}

/**
 * Use HTTP
 * @returns {{method: {POST: string, GET: string}, post: (function(*, *, {}=): Promise<axios.AxiosResponse<*>>), get: (function(*, {}=): Promise<axios.AxiosResponse<*>>)}}
 */
export const useHttp = () => {
    const {message} = App.useApp()

    /**
     * HTTP Request
     * @param url request URL
     * @param method request method
     * @param body request body
     * @param headers request headers
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    async function request(url, method = method.GET, body = null, headers = {}) {
        try {
            return await axios.request({
                url,
                method,
                data: body,
                withCredentials: true,
                headers,
            })
        } catch (e) {
            return e.response
        }
    }

    return {
        method,
        /**
         * GET request
         * @param url URL
         * @param headers headers
         * @returns {Promise<axios.AxiosResponse<*>>}
         */
        get: async (url, headers = {}) => await request(url, method.GET, null, headers),
        /**
         * POST request
         * @param url URL
         * @param body body
         * @param headers headers
         * @returns {Promise<axios.AxiosResponse<*>>}
         */
        post: async (url, body, headers = {}) => await request(url, method.POST, body, headers),
    }
}