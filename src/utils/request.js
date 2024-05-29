import neo4j from 'neo4j-driver';
const request = {
  async fetchData(userName, password,Cypher) {
    // 替换为Neo4j实例的URI、用户名和密码
    const driver = neo4j.driver(
      'bolt://10.0.82.146:7687',
      neo4j.auth.basic(userName, password)
    );

    // 使用Neo4j驱动创建一个会话
    const session = driver.session();
    // session.run('MATCH (n) RETURN n LIMIT 10').then((res)=>{
    // })
    try {
      let nodes = undefined
      // 执行Cypher查询
      const result = await session.run(Cypher);
      // console.log(result,18)
      // 获取结果并存储在nodes数组中s
    //  nodes = result.records.map((record) => record.get(0));
      return result
    } finally {
      // 关闭会话
      await session.close();
    }
    // 关闭驱动
    await driver.close();
  },
};
export default request

