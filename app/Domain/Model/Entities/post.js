ioc.inject(function (dbService, logger)
{
    let postSchema = 
    {
        fields:
        {
            postId: 
            {
                type: 'uuid',
                default: {'$db_function': 'uuid()'}
            },
            userId: 'uuid',
            postTitle: 'text',
            postContent: 'text'
        },
        key:[['userId'], 'postId'],
        options: 
        {
            timestamps: 
            {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        },
    }

    let postModel = dbService.loadSchema('Post', postSchema)

    postModel.syncDB(function(err, result) 
    {
        if (err) 
            logger.debug(err)
    })
})()