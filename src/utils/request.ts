import axios from 'axios'//导入axios
import type { AxiosInstance } from 'axios';
import { ElMessage } from 'element-plus';

const request: AxiosInstance = axios.create({
    baseURL: 'http://localhost',
    timeout: 60000,
})
// 添加请求拦截器
request.interceptors.request.use(
    function (config) {
        if (config.url !== "/admin/login") {
            // config.headers.token = store.state.userInfo.token;
            // 请求是否需要token？
            // config.headers.token = window.localStorage.getItem('token')
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);
//添加响应拦截器
request.interceptors.response.use(
    (res:any) => {
        //抓举核心响应式数据
        if (res.data.code === 0) {
            return res
        }
        //处理业务失败（给提示抛出错误）
        ElMessage.error(res.data.messsage || '服务异常')
        return Promise.reject(res.data)
    },
    //默认错误情况，只需要给提示
    (err)=>{
        ElMessage.error(err.response.data.messsage || '服务异常')
        return Promise.reject(err)
    }

);
export default request