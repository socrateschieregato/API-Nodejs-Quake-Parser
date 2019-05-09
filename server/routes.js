const gamesController = require('./controllers/controllers')

//Routes
const Router = (server, parser) => {
    [
        //all parsed games
        ['GET', '/games', gamesController.index(parser)],

        //returns a game by id
        ['GET', '/games/{id}', gamesController.show(parser)]
    ].forEach(item => {

        //route server
        server.route({
            method: item[0],
            path: `/api/v1${item[1]}`,
            handler: item[2]
        })
        console.log(`Route /api/v1${item[1]} registered`)
    })
}

module.exports = Router