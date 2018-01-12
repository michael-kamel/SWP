//not of so much use since the facade almost maps to orm specific methods, therefore, this will be more of testing the mock than the functions of the facade
describe('DB Facade tests', () =>
{
    let dbFacade
    let posts = []
    let users = []
    beforeAll(() =>
    {
        require('dotenv').config()
        require('../../app/utilSetup')
        require('../../app/servicesSetup')
        let dbServiceMock = function()
        {
            
            function clearDb()
            {
                posts = []
                users = []
            }
            function uuidFromString(str)
            {
                return str
            }
            function Post({userId,postTitle,postContent})
            {
                this.userId = userId
                this.postTitle = postTitle
                this.postContent = postContent
            }
            Post.prototype.saveAsync = function()
            {
                posts.push(this)
                return
            }
            function uuid()
            {
                return "8e847158-de32-41cd-8296-c9662ecdcaf2"
            }
            return {
                uuid,
                clearDb,
                uuidFromString,
                posts,
                users,
                instance:
                {
                    Post
                }
            }
        }
        ioc.registerModule('dbServiceMock', dbServiceMock)
        dbFacade = ioc.construct('dbMethods', {depMap:
        {
            dbService:'dbServiceMock'
        }})
    })

    beforeEach(() => 
    {
        posts = []
        users = []
    })

    test('adds posts', async () =>
    {
        let userId = 'someId'
        let title = 'some title'
        let content = 'some content'

        await dbFacade.addPost({userId, title, content})
        expect(posts[0]).toMatchObject({userId, postTitle:title, postContent:content})
    })
})