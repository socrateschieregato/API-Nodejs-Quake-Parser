const Hapi = require('hapi')
const server = new Hapi.Server()
const Parser = require('./models/parser')

// Parser Object
const parser = new Parser()

//Parse games.log
parser.readFile(`${__dirname}/../data/games.log`)

//Server connection
server.connection({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 8000
})

//Server routes
require('./routes')(server, parser)

module.exports = server
