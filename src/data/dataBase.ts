const dataBase = [  
    {
        nodes: [
            {
                color: 'rgb(255, 196, 84)',
                text: 'University',

            },
            {
                color: 'rgb(96, 74, 14)',
                text: 'Company'
            },
            {
                color: 'rgb(201, 144, 192)',
                text: 'Country'
            },
            {
                color: 'rgb(247, 151, 103)',
                text: 'Person'
            },
            {
                color: 'rgb(87, 199, 227)',
                text: 'Forum'
            },
            {
                color: 'rgb(241, 102, 103)',
                text: 'Post'
            },
            {
                color: 'rgb(217, 200, 174)',
                text: 'Tag'
            },
            {
                color: 'rgb(141, 204, 147)',
                text: 'City'
            },
            {
                color: 'rgb(141, 204, 147)',
                text: 'Message'
            },
            {
                color: 'rgb(141, 204, 147)',
                text: 'Continent'
            },
            {
                color: 'rgb(141, 204, 147)',
                text: 'Organisation'
            },
            {
                color: 'rgb(141, 204, 147)',
                text: 'Place'
            },
            {
                color: 'rgb(141, 204, 147)',
                text: 'Comment'
            }
        ],
        Relationship: [
            'REPLY_OF', 'HAS_MODERATOR', 'IS_SUBCLASS_OF', '"HAS_CREATOR', 'CONTAINER_OF', 'WORK_AT', 'STUDY_AT', 'IS_PART_OF', 'LIKES', 'HAS_INTEREST', 'IS_LOCATED_IN',
            'HAS_TYPE', 'KNOWS', 'HAS_TAG', 'HAS_MEMBER'
        ],
        Property: [
            'birthday', 'browserUsed', 'classYear', 'content', 'creationDate', 'email', 'firstName', 'gender', 'id', 'imageFile', 'joinDate', 'language', 'lastName', 'length', 'locationIP', 'name',
            'speaks', 'title', 'url', 'workFrom'
        ]

    }
]
export default dataBase