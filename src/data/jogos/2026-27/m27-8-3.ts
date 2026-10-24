// 8.ª jornada · Académica do Lobito–FC Luanda
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-8-3',
  round: 8,
  homeTeamId: 'lobito',
  awayTeamId: 'fcluanda',
  schedule: { date: '2026-10-24T15:00:00+01:00', stadium: 'Estádio Nacional de Ombaka', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // A Académica recebe no Estádio Nacional de Ombaka (indicação de 28/09/2026).
  // Constituição das Equipas: imagens fornecidas pelo utilizador em 24/10/2026.
  // Ordem, nomes e camisolas transcritos da ficha; 11 titulares e 9 suplentes por equipa.
  // Ligações a jogadores apenas quando o nome já está confirmado em fichas anteriores.
  coaches: {"home":"Silvestre Pelé","away":"Rui Santos"},
  lineups: {
    "home": [
      {
        "name": "Caxito",
        "number": 30,
        "position": "GK",
        "isStarter": true,
        "playerId": "caxito-lobito"
      },
      {
        "name": "Lourenço",
        "number": 5,
        "position": "DEF",
        "isStarter": true,
        "playerId": "lourenco-lobito"
      },
      {
        "name": "Manú",
        "number": 3,
        "position": "DEF",
        "isStarter": true,
        "playerId": "nanga-lobito"
      },
      {
        "name": "Cachi",
        "number": 7,
        "position": "MID",
        "isStarter": true,
        "playerId": "januario-lobito"
      },
      {
        "name": "Mutu",
        "number": 8,
        "position": "MID",
        "isStarter": true,
        "playerId": "quiteque-lobito"
      },
      {
        "name": "Muenho",
        "number": 13,
        "position": "DEF",
        "isStarter": true,
        "playerId": "fifa-1jrj1l5"
      },
      {
        "name": "Guilherme",
        "number": 18,
        "isStarter": true
      },
      {
        "name": "Bebucho",
        "number": 19,
        "position": "FWD",
        "isStarter": true,
        "playerId": "antonio-lobito"
      },
      {
        "name": "Sistema",
        "number": 22,
        "position": "DEF",
        "isStarter": true,
        "playerId": "leonel-lobito"
      },
      {
        "name": "Luizinho Panda",
        "number": 31,
        "position": "MID",
        "isStarter": true,
        "playerId": "fifa-1l60xh8"
      },
      {
        "name": "Didi Craque",
        "number": 32,
        "position": "MID",
        "isStarter": true,
        "playerId": "fifa-1ndemr2"
      },
      {
        "name": "Gui",
        "number": 12,
        "position": "GK",
        "isStarter": false,
        "playerId": "guilherme-lobito"
      },
      {
        "name": "Elieve",
        "number": 9,
        "isStarter": false,
        "playerId": "elieve-lobito"
      },
      {
        "name": "Ezequiel",
        "number": 10,
        "position": "MID",
        "isStarter": false,
        "playerId": "ezequiel-lobito"
      },
      {
        "name": "Florentino",
        "number": 11,
        "position": "FWD",
        "isStarter": false,
        "playerId": "kaporal"
      },
      {
        "name": "Chico Papel",
        "number": 16,
        "position": "MID",
        "isStarter": false,
        "playerId": "joaquim-lobito"
      },
      {
        "name": "Isaac Vidal",
        "number": 20,
        "isStarter": false,
        "playerId": "isaal-vidal-lobito"
      },
      {
        "name": "Farrada",
        "number": 26,
        "position": "DEF",
        "isStarter": false,
        "playerId": "fifa-1nc8yh3"
      },
      {
        "name": "Jorge",
        "number": 28,
        "position": "DEF",
        "isStarter": false,
        "playerId": "jorge-28-lobito"
      },
      {
        "name": "Júnior",
        "number": 37,
        "isStarter": false,
        "playerId": "joao-chimema-lobito"
      }
    ],
    "away": [
      {
        "name": "Patrício",
        "number": 12,
        "position": "GK",
        "isStarter": true,
        "playerId": "fifa-1l7wk59"
      },
      {
        "name": "Filipe",
        "number": 17,
        "position": "DEF",
        "isStarter": true,
        "playerId": "fifa-1k2wth5"
      },
      {
        "name": "Viegas",
        "number": 2,
        "isStarter": true
      },
      {
        "name": "Motivado",
        "number": 7,
        "position": "MID",
        "isStarter": true,
        "playerId": "fifa-1liwnq8"
      },
      {
        "name": "Gelson",
        "number": 8,
        "position": "MID",
        "isStarter": true,
        "playerId": "fifa-1ljudk2"
      },
      {
        "name": "Kaba",
        "number": 11,
        "isStarter": true
      },
      {
        "name": "Domingos",
        "number": 14,
        "position": "MID",
        "isStarter": true,
        "playerId": "fifa-1mall47"
      },
      {
        "name": "Rubem",
        "number": 15,
        "isStarter": true
      },
      {
        "name": "Gabriel",
        "number": 21,
        "isStarter": true,
        "playerId": "gabriel-cavalcante-fcluanda"
      },
      {
        "name": "Célio",
        "number": 26,
        "position": "MID",
        "isStarter": true,
        "playerId": "fifa-1qw3z14"
      },
      {
        "name": "Jaime",
        "number": 30,
        "position": "MID",
        "isStarter": true,
        "playerId": "fifa-1qw9vb1"
      },
      {
        "name": "Deo",
        "number": 22,
        "position": "GK",
        "isStarter": false,
        "playerId": "fifa-1l7w9k9"
      },
      {
        "name": "Miguel",
        "number": 3,
        "position": "MID",
        "isStarter": false,
        "playerId": "fifa-1l064e1"
      },
      {
        "name": "Francisco",
        "number": 9,
        "position": "FWD",
        "isStarter": false,
        "playerId": "fifa-1l11132"
      },
      {
        "name": "Arnaldo",
        "number": 16,
        "position": "MID",
        "isStarter": false,
        "playerId": "fifa-1m8xdu3"
      },
      {
        "name": "Yabala",
        "number": 20,
        "isStarter": false
      },
      {
        "name": "De Paiza",
        "number": 24,
        "isStarter": false
      },
      {
        "name": "Edmilson",
        "number": 25,
        "isStarter": false
      },
      {
        "name": "Batista",
        "number": 27,
        "position": "MID",
        "isStarter": false,
        "playerId": "fifa-1v0ca42"
      },
      {
        "name": "Kano",
        "number": 31,
        "position": "FWD",
        "isStarter": false,
        "playerId": "fifa-1malhf8"
      }
    ]
  },
});
