describe('GamesController', () => {
    const Server = require(`${__dirname}/../../../server`)
    const Parser = require(`${__dirname}/../../../server/models/parser`)
  
    describe('index', () => {
      it('Should returns 21 games', done => {
        expect(() => {
          Server.inject({
            method: 'GET',
            url: '/api/v1/games'
            }).then(response => {
                expect(response.statusCode).toEqual(200)
                expect(Object.keys(response.result).length).toEqual(21)
                done()
            })
        }).not.toThrowError()
      })
    })
  
    describe('show', () => {
        it('Should returns 1 game', done => {
            expect(() => {
            Server.inject({
                method: 'GET',
                url: '/api/v1/games/3'
            }).then(response => {
                expect(response.statusCode).toEqual(200)
                expect(response.result).toEqual({
                    "total_kills": 4,
                    "players": [ "Dono da Bola",
                        "Isgalamido",
                        "Zeh"
                    ],
                    "kills": {
                        "Dono da Bola": -1,
                        "Isgalamido": 1,
                        "Zeh": -2
                    }
                })
                done()
                })
            }).not.toThrowError()
        })
  
        it('Should returns error', done => {
            expect(() => {
            Server.inject({
                method: 'GET',
                url: '/api/v1/games/30'
            }).then(response => {
                expect(response.statusCode).toEqual(404)
                expect(response.result).toEqual({ error: 'Game 30 not found' })
                done()
            })
            }).not.toThrowError()
        })
    })
  
})