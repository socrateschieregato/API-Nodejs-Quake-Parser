describe('Game', () => {
    const modelsPath = `${__dirname}/../../../server/models`
    const Game = require(`${modelsPath}/game`)
    const Player = require(`${modelsPath}/player`)

    const lines = [
        "  0:00 InitGame: \\sv_floodProtect\\1\\sv_maxPing\\0\\sv_minPing\\0\\sv_maxRate\\10000\\sv_minRate\\0\\sv_hostname\\Code Miner Server\\g_gametype\\0\\sv_privateClients\\2\\sv_maxclients\\16\\sv_allowDownload\\0\\dmflags\\0\\fraglimit\\20\\timelimit\\15\\g_maxGameClients\\0\\capturelimit\\8\\version\\ioq3 1.36 linux-x86_64 Apr 12 2009\\protocol\\68\\mapname\\q3dm17\\gamename\\baseq3\\g_needpass\\0",
        "  9:32 InitGame: \\sv_floodProtect\\1\\sv_maxPing\\0\\sv_minPing\\0\\sv_maxRate\\10000\\sv_minRate\\0\\sv_hostname\\Code Miner Server\\g_gametype\\0\\sv_privateClients\\2\\sv_maxclients\\16\\sv_allowDownload\\0\\dmflags\\0\\fraglimit\\20\\timelimit\\15\\g_maxGameClients\\0\\capturelimit\\8\\version\\ioq3 1.36 linux-x86_64 Apr 12 2009\\protocol\\68\\mapname\\q3dm17\\gamename\\baseq3\\g_needpass\\0",
        " 20:34 ClientConnect: 2",
        " 12:34 ClientConnect: 3",
        " 12:34 ClientConnectado: 3",
    ]

    var game

    beforeEach(() => {
        game = new Game()
    })

    it('Should be able to add kills to game', () => {
        expect(game.total_kills).toBe(0)
        game.addKill()
        expect(game.total_kills).toBe(1)
    })

    describe('Game Players', () => {
        var player1, player2

        beforeEach(() => {
            player1 = new Player(lines[2])
            player1.username = 'Bolsonaro'
            player2 = new Player(lines[3])
            player2.username = 'Haddad'
        })

        it('Should be able to add new players to game', () => {
            expect(game.players.size).toBe(0)
            game.newPlayer(player1)
            expect(game.players.size).toBe(1)
            game.newPlayer(player2)
            expect(game.players.size).toBe(2)
            })

            it('Should be able to find a player by it\'s ID', () => {
            game.newPlayer(player1)
            game.newPlayer(player2)
            expect(game.getPlayerId('2')).toBe(player1)
            expect(game.getPlayerId('3')).toBe(player2)
            expect(game.getPlayerId('4')).toBe(null)
        })

        it('Should returns players kills list', () => {
            const emptyPlayersKills = { 'Bolsonaro': 0, 'Haddad': 0 }
            const playersKills = { 'Bolsonaro': 5, 'Haddad': 0 }
            game.newPlayer(player1)
            game.newPlayer(player2)
            expect(game.playersKills()).toEqual(emptyPlayersKills)
            player1.addKill()
            player1.addKill()
            player1.addKill()
            player1.addKill()
            player1.addKill()
            expect(game.playersKills()).toEqual(playersKills)
        })

        it('Should returns players names list', () => {
            expect(game.playersNames().length).toBe(0)
            game.newPlayer(player1)
            expect(game.playersNames().length).toBe(1)
            expect(game.playersNames()).toEqual(['Bolsonaro'])
            game.newPlayer(player2)
            expect(game.playersNames().length).toBe(2)
            expect(game.playersNames()).toEqual(['Bolsonaro', 'Haddad'])
        })
    })

})