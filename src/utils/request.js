const generateRandomId = () => {
    const timestamp = new Date().getTime(); // 获取当前时间戳
    const randomNum = Math.floor(Math.random() * 1000); // 生成一个0-999之间的随机数
    return `id_${timestamp}_${randomNum}`; // 返回拼接后的ID字符串
  };
async function getJsonDataInfo() {
    await fetch(window.localStorage.getItem('address'), {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
        },
        body:
        `{
        'query': 'call db.schema.statics',
        'queryId':'${generateRandomId()}'
      }`
        ,
    }).then((response) => response.text())
        .then((data) => {
            const data2 = JSON.parse(data)
            window.localStorage.setItem('labelList', JSON.stringify(data2.response[0].value.labels))
            window.localStorage.setItem('typeList', JSON.stringify(data2.response[0].value.types))
            window.localStorage.setItem('labelNumber', data2.response[0].value.nodeCount)
            window.localStorage.setItem('TypeNumber', data2.response[0].value.relCount)
        })
}
export default getJsonDataInfo
