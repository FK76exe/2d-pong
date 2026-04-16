// to manage state of game for organization

let GameState = {
    puckStatus: {
        inArena: true,
        arenaExitTime: Date.now()
    },
    score: {
        player: 0,
        opp: 0
    }
}

export default GameState;