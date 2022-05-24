import axios from 'axios'

// export const recommendUrl = 'https://3g.163.com/fe/api/hot/news/list?limit=5&origin=baidu&from=wap3g'
export const recommendUrl = 'http://3g.163.com/touch/nc/api/user/recommend/GuessLike/1-10-10-10.do?__rnd=7007793&callback=recommendList'
export const hotUrl = 'http://3g.163.com/fe/api/hot/news/flow'

const base = ''
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
    // axiosIns
}
export default ajax
