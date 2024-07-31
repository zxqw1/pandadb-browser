// import neo4j from 'neo4j-driver';

// const request = {
//   async fetchData(userName, password,Cypher) {
//     // 替换为Neo4j实例的URI、用户名和密码
//     const driver = neo4j.driver(
//       'bolt://10.0.82.146:7687',
//       neo4j.auth.basic(userName, password)
//     );

//     // 使用Neo4j驱动创建一个会话
//     const session = driver.session();
//     try {
//       let nodes = undefined
//       // 执行Cypher查询
//       const result = await session.run(Cypher);
//       return result
//     } finally {
//       // 关闭会话
//       await session.close();
//     }
//     // 关闭驱动
//     await driver.close();
//   },
// };
// export default request

// const request  = {
//     async fetc
// }
async function getJsonDataInfo() {
    await fetch(window.localStorage.getItem('address'), {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
        },
        body: 'call db.schema.statics',
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
