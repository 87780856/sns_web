import axios from 'axios'
import { getToken } from '@/utils/auth'
import store from '@/store'

// 创建axios实例
const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000', // api的base_url
  timeout: 600000                    // 请求超时时间60秒
})

// request拦截器
instance.interceptors.request.use((config) => {
  // Do something before request is sent
  // 判断是否存在token，如果存在的话，则每个http header都加上token
  if (store.getters.token) {  
    config.headers.Authorization = 'token ' + store.getters.token//getToken();
  }

  return config
}, (error) => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data
},(error) => {
  // Do something with response error
  console.log(error)// for debug
  return Promise.reject(error)
})

export default instance
