module.exports = (function () 
{
    const FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m

    function removeSpaces (fun) 
    {
        return fun.replace(/\s/g, '')
    }
    function extractDependencies (fun) 
    {
        return removeSpaces(fun.toString().match(FN_ARGS)[1]).split(',').filter(str => str.length > 0)
    }

    return {
        extractDependencies,
        removeSpaces
    }
})()
