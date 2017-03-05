var lambda  = require('../index.js')
var context = require('../context.json')
var event = require('../event.json')
lambda.handler(event,context)