import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Toast } from 'react-vant';

const base = ''
const axiosIns = axios.create()
// 带cookie请求
axios.defaults.withCredentials = true
axios.defaults.timeout = 60 * 1000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

// request 请求拦截器 - 请求之前headers加sid
axios.interceptors.request.use(
    (config: any) => {
        //  每次发送请求之前检测都vuex存有token,那么都要放在请求头发送给服务器
        const sid = sessionStorage.getItem('sid')
        const locale = sessionStorage.getItem('locale')
        if (config.url.indexOf('/login') < 0 && sid) {
            config.headers.SID = sid
            config.headers.LOCALE = locale || 'zh'
        }
        if (config.url.indexOf('/login') > 0) {
            config.headers.LOCALE = locale || 'zh'
        }
        return config
    }, err => err
)
// response 错误统一处理
axios.interceptors.response.use(
    (res: AxiosResponse) => {
        if (res.data.code === '401' || res.data.code === '403') {
            console.log(res)
        }
        if (res.data.type == 'LOG') {
            console.log(res.data.message)
            return res
        }
        if (res.data.type == 'TIPS' || res.data.type == 'ALERT') {
            Toast({ type: 'fail', message: res.data.message })
            return res
        }
        return res
    },
    err => {
        console.log('接口访问失败:')
        if (err.code === 'ECONNABORTED') {
            Toast({ type: 'fail', message: err.message })
        }
        return err
    }
)

/**
 * get方法，对应get请求c
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url: string, params: object) {
    return new Promise((resolve, reject) => {
        axios.get(`${base}/${url}`, {
            params
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject((err && err.data) || err)
        })
    })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */

export function post(url: string, params: object) {
    return new Promise((resolve, reject) => {
        axios.post(`${base}/${url}`, params).then(res => {
            if (url.indexOf('login') > -1) {
                resolve(res)
            } else {
                resolve(res.data)
            }
        }).catch(err => {
            reject((err && err.data) || err)
        })
    })
}

const ajax = {
    post,
    get,
    axios,
    axiosIns
}
export default ajax
