module.exports = function (app) 
{
    ioc.inject(function (frontController, authenticator, expressErrorHandler) 
    {
        app.use(authenticator.initialize())
        app.get('/auth/fb', authenticator.authenticate('facebook', { scope: 'email'}))
        app.get(process.env.FB_CBURL, authenticator.authenticate('facebook', { failureRedirect: '/auth/fail' }), frontController.fbReturn)
        app.get('/auth/fail', frontController.authFail)
        app.post('/publishpost', frontController.publishPost)
        app.delete('/deleteost', frontController.deletePost)
        app.get('/getallposts', frontController.getAllPosts)
        app.use(expressErrorHandler.manage)
    })()
}