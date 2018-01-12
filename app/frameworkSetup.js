const app = require('./Domain/app')
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')

let server = express() 
server.use(cors())
server.use(bodyParser.json())
server.disable('x-powered-by')
server.use(compression())
server.use(helmet())
server.use(morgan('combined'))

app(server)

server.listen(process.env.PORT, ioc.inject(function(logger) 
{
    logger.info('listening at %s', process.env.PORT)
})())