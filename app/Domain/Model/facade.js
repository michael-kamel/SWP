ioc.registerModule('dbMethods', function(dbService, logger)
{
    async function addPost({userId, title, content})
    {
        let post = new dbService.instance.Post(
        {
            userId:dbService.uuidFromString(userId),
            postTitle: title,
            postContent: content
        })
        await post.saveAsync()
        return post
    }
    async function deletePost({userId, postId})
    {
        await dbService.instance.Post.deleteAsync({userId:dbService.uuidFromString(userId), postId:dbService.uuidFromString(postId)})
    }
    async function findUserByFacebookId({id})
    {
        let user = await dbService.instance.User.findOneAsync({ 'facebookId' : id })
        return user
    }
    async function findUserById({id})
    {
        let user = await dbService.instance.User.findOneAsync({id})
        return user
    }
    async function createUser({name, email, facebookId, facebookToken})
    {
        let newUser = new dbService.instance.User({name, email, facebookId, facebookToken})
        await newUser.saveAsync()
        return newUser
    }
    async function getAllPosts()
    {
        let posts = []
        return new Promise(async function(resolve, reject) 
        {
            await dbService.instance.Post.stream({}, {raw: true}, function(reader)
            {
                while (row = reader.readRow()) 
                {
                    posts.push(row)
                }
            }, function(err)
            {
                if(err)
                    reject(err)
                else
                    resolve(posts)
            })
        })
    }

    return {
        addPost,
        deletePost,
        findUserByFacebookId,
        findUserById,
        createUser,
        getAllPosts
    }
})