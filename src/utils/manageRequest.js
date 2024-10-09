import {  ElMessageBox } from 'element-plus'
async function getManageInfo(url,queryMethod,querytext){
    if(queryMethod === "POST"){
        return await fetch(url,{ 
            method:queryMethod,
            headers: {
                "Content-Type": "text/plain",
            },
            body:querytext
            })
            .then((response) => response.text())
            .then((data) =>{
                console.log(JSON.parse(data),'12')
                if(JSON.parse(data).success === true){
                    return JSON.parse(data) // 你这return，应该是return到上一层了
                }else{
                    ElMessageBox.alert(JSON.parse(data).errorMessage, '提示', {
                        confirmButtonText: 'OK'
                      })
                }
            })
    }else{
        return await fetch(url)
        .then((response) => response.text())
        .then((data)=>{
            if(JSON.parse(data).success === true){
                return JSON.parse(data) // 你这return，应该是return到上一层了
            }else{
                ElMessageBox.alert(JSON.parse(data).errorMessage, '提示', {
                    confirmButtonText: 'OK'
                  })
            }
        })
    }
    
}
export default getManageInfo