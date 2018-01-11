ioc.inject(function (dbService, logger)
{
    let userSchema = 
    {
        fields:
        {
            id: 
            {
                type: 'uuid',
                default: {'$db_function': 'uuid()'}
            },
            name: 'text',
            email: 'text',
            facebookId: 'text',
            facebookToken: 'text'
        },
        key:['id'],
        indexes:['facebookId'],
        options:
        {
            timestamps:
            {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        },
    }

    let userModel = dbService.loadSchema('User', userSchema)

    userModel.syncDB(function(err, result) 
    {
        if (err) 
            logger.debug(err)
    })
})()