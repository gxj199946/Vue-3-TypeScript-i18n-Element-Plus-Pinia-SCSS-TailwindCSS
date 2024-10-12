import axios from '@/utils/axios'

export const ApiService = {
  get(resource: string, config = {}) {
    return axios.get(resource, config)
  },

  post(resource: string, data: any, config = {}) {
    return axios.post(resource, data, config)
  },

  put(resource: string, data: any, config = {}) {
    return axios.put(resource, data, config)
  },

  delete(resource: string, config = {}) {
    return axios.delete(resource, config)
  }
}

// 你可以为特定的 API 端点创建服务
export const UserService = {
  getCourses() {
    return ApiService.get('/courses')
  },
//   getUserById(id: number) {
//     return ApiService.get(`/users/${id}`)
//   },
  // 添加更多用户相关的方法...
}

// 可以继续添加其他服务...