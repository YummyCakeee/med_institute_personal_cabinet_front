import {useHttp} from "./http.hook.js";

// const domain = 'http://1085037-cq23779.tmweb.ru'
// const api = '/api'
// const account = '/Account'
//
// const url = {
//     login: domain + api + account + '/Login',
//     userInfo: domain + api + account + '/CurrentUserInfo',
// }

/**
 * Use API
 * @returns {{login: ((function(*, *): Promise<*|undefined>)|*), getUserInfo: ((function(): Promise<*|undefined>)|*), url: {userInfo: string, login: string}}}
 */
export const useApi = () => {
    const {post, get, method} = useHttp()

    async function _login(email, password) {
        try {
            return await get(
                '../static/login.json'
            )
        } catch (e) {

        }
    }

    /**
     * Login
     * @param email login
     * @param password password
     * @returns {Promise<*|undefined>}
     */
    async function login(email, password) {
        if (!window.qumicon_config?.login) {
            throw new Error("window.qumicon_config.login is not set")
        }

        const _method = window.qumicon_config.login.method.toUpperCase() === method.POST
            ? post
            : get

        try {
            return await _method(
                window.qumicon_config.login.url,
                {
                    [window.qumicon_config.login?.fields?.login || 'login']: email,
                    [window.qumicon_config.login?.fields?.password || 'password']: password
                },
            )
        } catch (e) {
            throw new Error(e.message)
        }
    }

    function _getUserInfo(admin = true) {
        return async function() {
            try {
                return await get(
                    '../static/' + (admin ? "admin" : "regular") + '.json'
                )
            } catch(e) {

            }
        }
    }

    /**
     * Get user info
     * @returns {Promise<*|undefined>}
     */
    async function getUserInfo() {
        if (!window.qumicon_config?.userInfo) {
            throw new Error("window.qumicon_config.userInfo is not set")
        }

        const _method = window.qumicon_config.userInfo.method.toUpperCase() === method.POST
            ? post
            : get

        try {
            return await _method(
                window.qumicon_config.userInfo.url
            )
        } catch (e) {
        }
    }

    return {
        login,
        getUserInfo,
        // login: _login,
        // getUserInfo: _getUserInfo(true),
    }
}