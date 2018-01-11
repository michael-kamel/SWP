ioc.registerModule('expressErrorHandler', function (logger) 
{
    function manage(err, req, res, next)
    {
        logger.debug(err)
        res.status(500).json({success:false})
    }
    return {
        manage
    }
})