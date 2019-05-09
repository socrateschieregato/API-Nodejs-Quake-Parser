class Game {
    constructor(line = '') {
        this.players = new Map()
        this.total_kills = 0 
    }

    /**
     * Create a new game and add to the parser
     * @param {Parser} parser 
     * @param {string} line
     * @return {void}
     */

    static new (parser, line) {
        parser.addGame(new Game(line))
    }

    /**
     * Increment game number ok kills
     * @return {void}
     */
    addKill () {
        this.total_kills++
    }

    /**
    * Finds a player by ID on game and return it
     * @param {string} id Player ID
     * @return {Player}   Player
     */

    getPlayerId (id) {
        if (this.players.has(id)) {
            return this.players.get(id)
        }
        return null
    }
     
    /**
     * Adds the passed player to the game
     * @param  {Player} player
     * @return {void}
     */
    newPlayer (player) {
        this.players.set(player.id, player)
    }

    /**
     * Return player names
     * @example ['Joao']
     * @return {array} 
     */
    playersNames () {
        let result = []
        this.players.forEach(player => {
            result.push(player.username)
        })
        return result
    }

    /**
     * Return the number of kills for each player
     * @example {'Joao': 5}
     * @return {Object}
     */

    playersKills () {
        let result = {}
        this.players.forEach(player => {
            result[player.username] = player.calcScore()
        })
        return result
    }

}

module.exports = Game