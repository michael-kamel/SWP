ioc.registerModule('appValidationSchemas', function (joi) 
{
    const VALIDATION_SCHEMAS =
    {
        PUBLISH_POST: joi.object().keys(
        {
            body: joi.object().keys(
                {
                    title: joi.string().required(),
                    content: joi.string().required()
                }).required(),
            headers: joi.object().keys(
                {
                    authorization:joi.string().required()
                }).required()
        }),
        REMOVE_POST: joi.object().keys(
        {
            body: joi.object().keys(
                {
                    postId: joi.string().required()
                }).required(),
            headers: joi.object().keys(
                {
                    authorization:joi.string().required()
                }).required()
        })
    }

    return VALIDATION_SCHEMAS
})
