ioc.registerModule('frontController', function(logger, dbMethods, appValidationSchemas, jwt, joi)
{
    function fbReturn(req, res)
    {
        let token = tokenizeUser(req.user.id)
        res.status(200).json({success:true, token})
    }
    async function publishPost(req, res, next)
    {
        try
        {
            await joi.validate(req, appValidationSchemas.PUBLISH_POST, {allowUnknown:true})
            req.user = await authorizeUser(req.headers.authorization)
            if(!req.user)
                return res.status(401).json({success:false})
            let post = await dbMethods.addPost({userId:req.user.id, title:req.body.title, content:req.body.content})
            res.status(200).json({success:true, post})
        }
        catch(err)
        {
            next(err)
        }
    }
    async function deletePost(req, res, next)
    {
        try
        {
            await joi.validate(req, appValidationSchemas.REMOVE_POST, {allowUnknown:true})
            req.user = await authorizeUser(req.headers.authorization)
            if(!req.user)
                return res.status(401).json({success:false})
            await dbMethods.deletePost({userId:req.user.id, postId:req.body.postId})
            res.status(200).json({success:true})
        }
        catch(err)
        {
            next(err)
        }
    }
    function authFail(req, res)
    {
        res.status(401).json({success:false})
    }
    async function getAllPosts(req, res, next)
    {
        try
        {
            let posts = await dbMethods.getAllPosts()
            res.status(200).json({success:true, posts})
        }
        catch(err)
        {
            next(err)
        }
    }

    function tokenizeUser(id)
    {
        return jwt.sign({id}, process.env.JWT_SECRET)
    }
    async function authorizeUser(authtoken)
    {
         let token = jwt.verify(authtoken, process.env.JWT_SECRET)
         return dbMethods.findUserById({id:token.id})
    }
    return {
        fbReturn,
        publishPost,
        deletePost,
        authFail,
        getAllPosts
    }
})