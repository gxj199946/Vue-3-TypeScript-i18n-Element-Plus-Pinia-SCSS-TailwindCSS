import axios from 'axios'

const instance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 设置基础URL
  baseURL:'',
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  }
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如，添加认证令牌
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，可能需要重新登录
          break
        case 404:
          // 请求的资源不存在
          break
        case 500:
          // 服务器错误
          break
        default:
          // 处理其他错误
      }
    }
    return Promise.reject(error)
  }
)

export default instance