const homeList = [
    {
        "title": "数据库连接选择",
        "type": "select",
        "select": [
            "数据库1",
            "数据库2"
        ]
    },
    {
        "title": "节点标签",
        "type": "tag",
        "class": [
            {
                "name": "第一类",
                "color": "pink"
            },
            {
                "name": "第二类",
                "color": "red"
            },
            {
                "name": "第三类",
                "color": "red"
            },
        ]
    },
    {
        "title": "关系类型",
        "type": "tag2",
        "relationship": [
            "关系一",
            "关系二",
            "关系三",
            "关系四",
            "关系五"
        ]
    },
    {
        "title": "属性值",
        "type": "tag3",
        "label": [
            "name",
            "id"
        ]
    },
    {
        "title": "连接库信息",
        "type": "text",
        "data":["pandaDB-admin"]
    },
    {
        "title": "系统介绍",
        "type":"text2",
        "clusterRole": "独立",
        "version": "1.0",
        "edition": "社区",
        "username": "pandaDB-admin",
        "information": [
            {
                "name":['pandaDB','system']
            },
            {
                "adress":[
                    'http://localhost:5173/',
                    'http://localhost:5173/'
                ]
            },
            {
                "Role":[
                    "standalone",
                    "standalone"
                ]
            },
            {
                "Status":[
                    "online","online"
                ]
            },
            {
                "Default":[
                    "true",
                    "none"
                ]
            },
            {
                "Error":[
                    "none","none"
                ]
            }
        ],
        "Querylist":[]
    }
]
export default homeList