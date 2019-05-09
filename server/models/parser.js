const fs = require('fs')
const Game = require('./game')
const Player = require('./player')

/**
 * returns command from line
 * @example Line: 20:54 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT
 *          Command: Kill
 * @type {RegExp}
 */
const GET_LINE_COMMAND = /^.{0,7}([a-z A-Z][^:]*)/

class Parser {

    constructor() {
        this.games = new Map()
        this.currentGame = 0
    }

    /**
     * Add new game to collection
     * @param {Game} game 
     * @return {[type]}
     */
    addGame(game) {
        this.currentGame++
        this.games.set(this.currentGame, game)
        return this
    }

    /**
     * Converts games map in Object to be used on routes return
     * @return {Object} The converted games
     * @example {
     *   game_1: {
     *     total_kills: 0,
     *     players: [ "Isgalamido" ],
     *     kills: { Isgalamido: 0 }
     *   }
     * }
     */
    toObject() {
        let ret = {}
        this.games.forEach((item, id) => {
            ret[`game_${parseInt(id)}`] = {
                total_kills: item.total_kills,
                players: item.playersNames(),
                kills: item.playersKills()
            }
        })
        return ret
    }

    /**
     * Reading a log file
     * @param {string} logfile full path
     * @return {void}
     */
    readFile (logfile) {
        let lines = fs.readFileSync(logfile).toString().split("\n")
        this.parseLines(lines)
    }

    /**
     * Loop through the array and parse each one
     * @param {array} lines
     * @return {void}
     */
    parseLines (lines) {
        let command = '',
            commands = [],
            lastLine = lines.length,
            i
        ;

        for (i = 0; i < lastLine; i++) {
            command = lines[i].match(GET_LINE_COMMAND)
            commands = ['InitGame', 'ClientConnect','ClientUserinfoChanged','Kill']

            if (commands.includes(command[1]) ) {
                this.checkCommand(command[1], lines[i], i)
            } else {
                //console.log(`Could not find command on line ${i}`)
            }
        }
    }

    /**
     * Checks if the command in the passed line
     * and execute a routine like create a new game, a new player
     * count kills or update a player information
     * @param  {string} command The command
     * @param  {string} line    The line that will be parsed
     * @param  {integer} id     The line number
     * @return {void}
     */

    checkCommand (command, line, id) {
        switch(command) {
            case 'InitGame':
                Game.new(this, line)
                break
            case 'ClientConnect':
                Player.new(this, line)
                break
            case 'ClientUserinfoChanged':
                Player.update(this, line)
                break
            case 'Kill':
                Player.kill(this, line)
                break
        }
    }

    /**
     * Return the current game
     * @return {Game} 
     */
    getCurrentGame() {
        return this.games.get(this.currentGame)
    }
}

module.exports = Parser