describe('Parser', () => {
    const Parser = require(`${__dirname}/../../../server/models/parser`)

    beforeEach(() => {
        parser = new Parser()
        // Lines 5 and 13 of logHelper.log changed to force errors
        parser.readFile(`${__dirname}/../../helpers/logHelper.log`)
    })

    it('Should parse lines and retrieves games information', () => {
        parserGames = parser.toObject()
        expect(Object.keys(parserGames).length).toBe(1)
        expect(parserGames['game_1']).toEqual({
        total_kills: 4,
        players: [
            'Dono da Bola',
            'Isgalamido',
            'Zeh'
        ],
        kills: {
            'Dono da Bola': -1,
            'Isgalamido': 1,
            'Zeh': -2
        } 
        })
    })

 })