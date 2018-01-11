ioc.registerModule('logger', function () 
{
    const winston = require('winston')
    winston.level = process.env.LOGGING_LEVEL
    return winston
})
