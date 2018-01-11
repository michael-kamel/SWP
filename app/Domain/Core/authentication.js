ioc.registerModule('authenticator', function(logger, dbMethods)
{
    const passport = require('passport')
    const FacebookStrategy = require('passport-facebook').Strategy

    passport.serializeUser(function(user, done) 
    {
        done(null, user);
    })
    passport.deserializeUser(async function(id, done) 
    {
        try
        {
            let user = await dbMethods.findUserById({id:id})
            done(user)
        }
        catch(err)
        {
            done(err)
        }
    })
    passport.use(new FacebookStrategy(
    {
        clientID        : process.env.FB_CLIENT_ID,
        clientSecret    : process.env.FB_CLIENT_SECRET,
        callbackURL     : process.env.URL + process.env.FB_CBURL,
        profileFields   : ['id', 'name', 'emails']
    },
    async function(token, refreshToken, profile, done) 
    {
        try
        {
            let user = await dbMethods.findUserByFacebookId({id:profile.id})
            if(user)
                return done(null, user)
            else 
            {
                await dbMethods.createUser(
                {
                    name: profile.name.givenName + ' ' + profile.name.familyName,
                    email: profile.emails[0].value,
                    facebookId: profile.id,
                    facebookToken: token
                })
                let createdUser = await dbMethods.findUserByFacebookId({id:profile.id})
                done(null, createdUser)
            }
        }
        catch(err)
        {
            done(err)
        }
    }))
    return passport
})