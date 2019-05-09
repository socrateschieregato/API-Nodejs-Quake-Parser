const USER_WORLD_ID = 1022

class Player {

    constructor (line ='') {
        this.id = Player.getPlayerId(line)
        this.username = ''
        this.kills = 0
        this.deadsByWorld = 0
        this.weapon = ''
    }

    /**
     * Retrives player ID of the line passed by argument
     * @param {string} line
     * @return {string} id
     */
    static getPlayerId (line) {
        const regex = /Client(Connect|UserinfoChanged): ([0-9]*)/
        let playerId = line.match(regex)
        return playerId[2] 
    }

    /**
     * Creates a new player based on line and add to parser
     * @param {Parser} parser
     * @param {string} line
     * @return {void}
     */
    static new (parser, line) {
        let currentGame = parser.getCurrentGame()
        currentGame.newPlayer(new Player(line))
    }

    /**
     * Updates information of Player
     * @param {Parser} parser
     * @param {string} line
     * @return {void}
     */
    static update (parser, line) {
        let currentGame = parser.getCurrentGame()
        let player = currentGame.getPlayerId(Player.getPlayerId(line))

        if (player) {
            player.update(line)
        } else {
            console.log(`[WARNING] Could not find player by ID (line: ${line})`)
        }
    }
    
    /**
     * Increment a kill to the Player of the passed Parser,
     * if the killes is <world>, the Player loses a kill
     * @param  {Parser} parser 
     * @param  {string} line
     * @return {void}
     */
    static kill (parser, line) {
        let currentGame = parser.getCurrentGame(),
            regex = /Kill: ([0-9]+) ([0-9]+)/,
            weapon = line.match(/by MOD_([a-z A-Z][^ ]*)/)[1],
            players = line.match(regex) // players[1] => Killer user ID, players[2] => Loser user ID
        ;

        if (players) {
            currentGame.addKill()
            
            if (players[1] == USER_WORLD_ID) {
                let killed = line.match(/killed (.*)\sby/)[1]
                
                currentGame.players.get(players[2]).deadsByWorld++
                console.log(`O player ${killed} morreu pois estava ferido e caiu de uma altura que o matou.`)
            } else {
                let killer = line.match(/\d+:\s(.*)\skilled/)[1],
                    killed = line.match(/killed (.*)\sby/)[1]
                ;
                weapon = weapon.slice(0,1) + weapon.slice(1).toLowerCase()
                currentGame.players.get(players[1]).addKill()
                console.log(`O player ${killer} matou o ${killed} usando a arma ${weapon}.`)
            }
        } else {
            console.log(`[WARNING] Could not find players to count kills (line: ${line})`)
        }
    }

    /**
     * Add a kill to the player
     * @return {void}
     */
    addKill () {
        this.kills++
    }

    /**
     * Calcs number of Player kills by subtracting
     * the number of deads by world for your number of kills
     * @return {integer} The number of Player kills
     */
    calcScore () {
        const score = this.kills - this.deadsByWorld
        return score
    }

    /**
     * Removes a kill of player
     * @return {void}
     */
    removeKill () {
        this.kills -= 1
    }

    /**
     * Updates user information with the passed line parsed
     * @param  {string} line The line
     * @return {void}
     */
    update (line) {
        this.username = line.match(/ClientUserinfoChanged: [0-9]* n\\(.*)\\t\\[0-9]+\\model/)[1]
    }
}

module.exports = Player