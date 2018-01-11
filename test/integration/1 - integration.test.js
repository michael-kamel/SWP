const fetch = require('node-fetch')
describe('Integration tests', () =>
{
    let testUser
    beforeAll(async () =>
    {
        require('../../app/server')
        let dbFacade = ioc.get('dbMethods')
        dbFacade.createUser(
        {
            name:'test', 
            email:'test@test.com', 
            facebookId:'fbid', 
            facebookToken:'fbtoken'
        })
        testUser = await dbFacade.findUserByFacebookId({id:'fbid'})
    })
    test('Can publish posts if authorized', done =>
    {
        let jwt = ioc.get('jwt')
        let token = jwt.sign({id:testUser.id}, process.env.JWT_SECRET)
        fetch('http://localhost:' + process.env.PORT + '/publishpost', { method: 'POST', body: JSON.stringify({title:'test', content:'test'}) , headers: {authorization:token, 'Content-Type': 'application/json',
        Accept: 'application/json'}})
        .then(function(res) 
        {
            expect(res.status).toEqual(200)
            done()
        })
    })
    test('Cant publish posts if not authorized', done =>
    {
        fetch('http://localhost:' + process.env.PORT + '/publishpost', { method: 'POST', body: JSON.stringify({title:'test', content:'test'}) , headers: {authorization:'test', 'Content-Type': 'application/json',
        Accept: 'application/json'}})
        .then(function(res) 
        {
            expect(res.status).not.toEqual(200)
            done()
        })
    })
})