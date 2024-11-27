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

//用户服务
export const UserService = {
  AuthpublicKey() {
    return ApiService.get('/api/auth/publicKey')
  },
  AuthLogin(data: any) {
    return ApiService.post('/api/auth/login', data)
  },
  AuthRegister(data:any){
    return ApiService.post('/api/auth/register',data)
  },
  MeInfo(token:any){
    return ApiService.get('/api/me/info',{headers:{
      'Authorization':`Bearer ${token}`
    }})
  }
  // 添加更多用户相关的方法...
}

// 可以继续添加其他服务...