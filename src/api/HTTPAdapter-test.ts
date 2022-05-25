import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Toast } from 'react-vant'

let myRequester: number | null = null
let myResponser: number | null = null

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

const initInterceptors = () => {
  // 确保重新初始化拦截器之前，生成全新的promise对象
  const source = axios.CancelToken.source()
  // 重新初始化拦截器之前，先移除旧的拦截器
  if (myRequester !== null && myResponser !== null) {
    axios.interceptors.request.eject(myRequester)
    axios.interceptors.response.eject(myResponser)
  }

  // 前置拦截器（发起请求之前的拦截）
  myRequester = axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      (config as any).source = source
      // if (config.url && config.url.indexOf('/login') < 0 && sessionStorage.getItem('sid')) {
      //   config.headers.SID = sessionStorage.getItem('sid')
      // }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 后置拦截器（获取到响应时的拦截）
  myResponser = axios.interceptors.response.use(
    (response: AxiosResponse) => {
      const { status, data: { code, message, type } } = response
      if (code !== '000') {
        if (code === '401' || code === '403') {
          const messDom = document.getElementsByClassName('login-confirm')
          // !messDom.length && Message.loginConfirm('长时间未操作，请退出重新登录').then(() => {
          //   redirect(response)
          // })
        } else if (code === '400' || code === '410') {
          return response.data
        } else {
          if (type === 'ALERT') {
            Toast.fail(message)
          } else {
            console.log(message)
          }
        }

        return Promise.reject(response.data)
      }

      if (!response.config) { // 兼容：修改代码后保存  response结构发生了变化？？？？
        return response
      } else {
        return response.data
      }
    },
    (error: AxiosError) => {
      if (error.response) {
        const { status, data: { message } }: any = error.response
        Toast.fail(`Code: ${status}, Message: ${message}`)
        console.error('[Axios Error]', error.response)
      } else {
        Toast.fail(`${error}`)
      }
      return Promise.reject(error)
    }
  )
}

initInterceptors()

export default axios
