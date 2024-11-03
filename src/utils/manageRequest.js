import {  ElMessageBox } from 'element-plus'
async function getManageInfo(url, queryMethod, querytext){ // 参数1：请求地址， 参数2：请求方式，参数3：请求传参，参数4：传参格式
        return await fetch(url, {
            method: queryMethod,
            headers: {
                // "Content-Type": "multipart/form-data;", // 默认："text/plain"
                "userName" : window.localStorage.getItem("username") ? window.localStorage.getItem("username") : "admin"
            },
            body: querytext
            })
            .then((response) => response.text())
            .then((data) =>{
                if(JSON.parse(data).success === true && (JSON.parse(data).errorMessage || JSON.parse(data).errorMessage ==="")){
                    ElMessageBox.alert(JSON.parse(data).errorMessage, '提示', {
                                confirmButtonText: 'OK'
                              })
                }else if(JSON.parse(data).success === true){
                    return JSON.parse(data)
                }else{
                    ElMessageBox.alert(JSON.parse(data).errorMessage, '提示', {
                                confirmButtonText: 'OK'
                              })
                }
            })
}
export default getManageInfo