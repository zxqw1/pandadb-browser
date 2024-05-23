import neo4j from 'neo4j-driver';
const request = {
  async fetchData(userName, password) {
    // console.log(userName)
    // console.log(password)
    // 替换为Neo4j实例的URI、用户名和密码
    const driver = neo4j.driver(
      'bolt://10.0.82.146:7688',
      neo4j.auth.basic(userName, password)
    );

    // 使用Neo4j驱动创建一个会话
    const session = driver.session();
    session.run('MATCH (n) RETURN n LIMIT 10').then((res)=>{
    })
    try {
      // 执行Cypher查询
      const result = await session.run('MATCH (n) RETURN n LIMIT 10');
      // 获取结果并存储在nodes数组中
      // console.log(result, "15")
      this.nodes = result.records.map((record) => record.get(0));
    } finally {
      // 关闭会话
      await session.close();
    }
    关闭驱动
    await driver.close();
  },
};
export default request

