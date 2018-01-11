const util = require('util')
const lodash = require('lodash')
const reflection = require('./Utils/reflection')

global.util = Object.assign(util,
    {
        _: lodash,
        reflection: reflection
    })
