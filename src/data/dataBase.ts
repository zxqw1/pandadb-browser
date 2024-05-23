const dataBase = [
    {
        "name": "dataBase",
        "username": "pandaDB-admin",
        "title": "系统介绍",
        "type": "text2",
        "clusterRole": "独立",
        "version": "1.0",
        "edition": "社区",
        "nodes": [
            {
                rootId: 'a',
                nodes: [
                    {
                        category: "teacher",
                        id: 1,
                        nodes: [
                            {
                                id: '1',
                                text: '语文',
                                color: "red",
                                borderColor: 'yellow',
                            },
                            {
                                id: '2',
                                text: '数学',
                                borderColor: 'yellow',
                                color: "red",
                                fontColor: 'yellow'
                            },

                        ],
                        lines: [
                            {
                                "from": "1",
                                "to": "2",
                                "text": "同事",
                                "color": "#d2c0a5",
                                "fontColor": "#d2c0a5",
                                "data": {
                                    "type": "同事"
                                  }
                            }
                        ]
                    },
                    {
                        category: "student",
                        id: 2,
                        nodes: [
                            {
                                id: '1',
                                text: '张三',
                                borderColor: 'yellow',
                                color: "red",
                                fontColor: 'yellow'
                            },
                            {
                                id: '2',
                                text: '李四',
                                borderColor: 'yellow',
                                color: "red",
                                fontColor: 'yellow'
                            },

                        ],
                        lines: [
                            {
                                "from": "1",
                                "to": "2",
                                "text": "同学2",
                                "color": "#d2c0a5",
                                "fontColor": "#d2c0a5",
                                "data": {
                                    "type": "同学2"
                                  }
                            }
                        ]
                    },
                ],
                lines: [
                    {
                        "from": "1",
                        "to": "2",
                        "text": "同学2",
                        "color": "#d2c0a5",
                        "fontColor": "#d2c0a5",
                        "data": {
                            "type": "同学2"
                          }
                    }
                ]
            },
        ]
    },
    {
        "name": "system",
        "username": "pandaDB-admin",
        "title": "系统介绍",
        "type": "text2",
        "clusterRole": "独立",
        "version": "1.0",
        "edition": "社区",
        "nodes": [
            {
                rootId: 'a',
                nodes: [
                    {
                        category: "教务处",
                        id: 1,
                        nodes: [
                            {
                                id: '1',
                                text: '教务老师',
                                color: "red",
                                borderColor: 'yellow',
                                // fontColor: 'yellow',
                                data: {
                                    "isGoodMan": true,
                                    "sexType": "male",
                                    // "icon": "https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2308340537,462224207&fm=58&app=83&f=JPEG?w=250&h=250&s=EC708F46DA96B89CB69D5DDA0300D014&n=侯亮平"
                                }
                            },
                            {
                                id: '2',
                                text: '体育老师',
                                borderColor: 'yellow',
                                color: "red",
                                fontColor: 'yellow'
                            },

                        ],
                        lines: [
                            {
                                "from": "1",
                                "to": "2",
                                "text": "同事",
                                "color": "#d2c0a5",
                                "fontColor": "#d2c0a5",
                                "data": {
                                    "type": "同事"
                                  }
                            }
                        ]
                    },
                    {
                        category: "高三组",
                        id: '2',
                        nodes: [
                            {
                                id: '1',
                                text: '张三',
                                borderColor: 'yellow',
                                color: "red",
                                fontColor: 'yellow'
                            },
                            {
                                id: '2',
                                text: '李四',
                                borderColor: 'yellow',
                                color: "red",
                                fontColor: 'yellow'
                            },

                        ]
                    },
                ],
                lines: [
                    {
                        "from": "1",
                        "to": "2",
                        "text": "同学",
                        "color": "#d2c0a5",
                        "fontColor": "#d2c0a5",
                        "data": {
                            "type": "同学"
                          }
                    }
                ]
            },
        ]
    }
]
export default dataBase