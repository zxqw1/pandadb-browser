// 引入Neo4j驱动
const neo4j = require('neo4j-driver');

// Neo4j数据库连接信息
const uri = 'bolt://10.0.82.146:7688';
const user = 'neo4j';
const password = 'bigdata';

// 创建一个Neo4j驱动实例
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// 创建一个Neo4j会话
const session = driver.session();

// 执行查询
const query = 'MATCH (n:Person) RETURN n LIMIT 10';
session
    .run(query)
    .then(result => {
        // 处理查询结果
        result.records.forEach(record => {
            console.log(record.get('n').properties);
        });
    })
    .catch(error => {
        console.error('Neo4j查询错误:', error);
    })
    .finally(() => {
        // 关闭会话
        session.close();
        // 关闭驱动
        driver.close();

    });