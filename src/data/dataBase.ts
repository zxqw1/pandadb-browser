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
                text: 'comment',

            },
            {
                color: 'rgb(96, 74, 14)',
                text: 'forum'
            },
            {
                color: 'rgb(201, 144, 192)',
                text: 'organisation'
            },
            {
                color: 'rgb(247, 151, 103)',
                text: 'person'
            },
            {
                color: 'rgb(87, 199, 227)',
                text: 'place'
            },
            {
                color: 'rgb(241, 102, 103)',
                text: 'post'
            },
            {
                color: 'rgb(217, 200, 174)',
                text: 'tag'
            },
            {
                color: 'rgb(141, 204, 147)',
                text: 'tagclass'
            }
        ],
        Relationship: [
            'containerOf', 'hasCreator', 'hasInterest', 'hasMember', 'hasModerator', 'hasTag', 'hasType', 'isLocatedIn', 'isPartOf', 'isSubclassOf', 'knows',
            'likes', 'replyOf', 'studyAt', 'workAt'
        ],
        Property: [
            'birthday', 'browserUsed', 'classYear', 'content', 'creationDate', 'email', 'firstName', 'gender', 'id', 'imageFile', 'joinDate', 'language', 'lastName', 'length', 'locationIP', 'name',
            'speaks', 'title', 'url', 'workFrom'
        ]

    }
]
export default dataBase