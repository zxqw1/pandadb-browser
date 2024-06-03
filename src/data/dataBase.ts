const dataBase = [
    // {
    //     "name": "dataBase",
    //     "username": "pandaDB-admin",
    //     "title": "系统介绍",
    //     "type": "text2",
    //     "clusterRole": "独立",
    //     "version": "1.0",
    //     "edition": "社区",
    //     "nodes": [
    //         {
    //             rootId: 'a',
    //             nodes: [
    //                 {
    //                     category: "teacher",
    //                     id: 1,
    //                     nodes: [
    //                         {
    //                             id: '1',
    //                             text: '语文',
    //                             color: "red",
    //                             borderColor: 'yellow',
    //                         },
    //                         {
    //                             id: '2',
    //                             text: '数学',
    //                             borderColor: 'yellow',
    //                             color: "red",
    //                             fontColor: 'yellow'
    //                         },

    //                     ],
    //                     lines: [
    //                         {
    //                             "from": "1",
    //                             "to": "2",
    //                             "text": "同事",
    //                             "color": "#d2c0a5",
    //                             "fontColor": "#d2c0a5",
    //                             "data": {
    //                                 "type": "同事"
    //                               }
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     category: "student",
    //                     id: 2,
    //                     nodes: [
    //                         {
    //                             id: '1',
    //                             text: '张三',
    //                             borderColor: 'yellow',
    //                             color: "red",
    //                             fontColor: 'yellow'
    //                         },
    //                         {
    //                             id: '2',
    //                             text: '李四',
    //                             borderColor: 'yellow',
    //                             color: "red",
    //                             fontColor: 'yellow'
    //                         },

    //                     ],
    //                     lines: [
    //                         {
    //                             "from": "1",
    //                             "to": "2",
    //                             "text": "同学2",
    //                             "color": "#d2c0a5",
    //                             "fontColor": "#d2c0a5",
    //                             "data": {
    //                                 "type": "同学2"
    //                               }
    //                         }
    //                     ]
    //                 },
    //             ],
    //             lines: [
    //                 {
    //                     "from": "1",
    //                     "to": "2",
    //                     "text": "同学2",
    //                     "color": "#d2c0a5",
    //                     "fontColor": "#d2c0a5",
    //                     "data": {
    //                         "type": "同学2"
    //                       }
    //                 }
    //             ]
    //         },
    //     ]
    // }
    {
        // nodes:['City',
        // 'Comment','Company','Continent',
        // 'Country','Forum','Message', 'Organisation',
        // 'Person','Place','Post','Tag','TagClass','TagClass']
        nodes: [
            {
                color: 'rgb(255, 196, 84)',
                text: 'City',

            },
            {
                color: 'rgb(96, 74, 14)',
                text: 'Comment'
            },
            {
                color: 'rgb(201, 144, 192)',
                text: 'Company'
            },
            {
                color: 'rgb(247, 151, 103)',
                text: 'Continent'
            },
            {
                color: 'rgb(87, 199, 227)',
                text: 'Country'
            },
            {
                color: 'rgb(241, 102, 103)',
                text: 'Forum'
            },
            {
                color: 'rgb(217, 200, 174)',
                text: 'Message'
            },
            {
                color: 'rgb(141, 204, 147)',
                text: 'Organisation'
            },
            {
                color: 'rgb(236, 181, 201)',
                text: 'Person'
            },
            {
                color: 'rgb(76, 142, 218)',
                text: 'Place'
            },
            {
                color: 'rgb(255, 196, 84)',
                text: 'Post'
            },
            {
                color: 'rgb(218, 113, 148)',
                text: 'Tag'
            },
            {
                color: 'rgb(217, 200, 174)',
                text: 'TagClass'
            },
            {
                color: 'rgb(217, 200, 174)',
                text: 'University'
            }
        ],
        Relationship: [
            'CONTAINER_OF', 'HAS_CREATOR', 'HAS_INTEREST', 'HAS_MEMBER', 'HAS_MODERATOR', 'HAS_TAG', 'HAS_TYPE', 'IS_LOCATED_IN', 'IS_PART_OF', 'IS_SUBCLASS_OF', 'KNOWS',
            'LIKES', 'REPLY_OF', 'STUDY_AT', 'WORK_AT'
        ],
        Property: [
            'birthday', 'browserUsed', 'classYear', 'content', 'creationDate', 'email', 'firstName', 'gender', 'id', 'imageFile', 'joinDate', 'language', 'lastName', 'length', 'locationIP', 'name',
            'speaks', 'title', 'url', 'workFrom'
        ]

    }
]
export default dataBase