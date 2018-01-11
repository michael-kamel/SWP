ioc.registerModule('errorFilter', function (logger) 
{
    function filterMaker (...errTypes) 
    {
        return function (func, context) 
        {
            return function (...args) 
            {
                try 
                {
                    return func.apply(context, args)
                }
                catch (err) 
                {
                    logger.debug(err)
                    util._.forEach(errTypes, eerr => 
                    {
                        if (err instanceof eerr) 
                        {
                            throw err 
                        }
                    })
                    throw new Error(err.message)
                }
            }
        }
    }
    return {
        filterMaker
    }
})
