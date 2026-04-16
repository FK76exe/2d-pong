// to manage state of game for organization

class GameState {

    constructor() {
        this.puckStatus = {
            inArena: true,
            arenaExitTime: Date.now()
        };
        this.score = {
            player: 0,
            opp: 0
        },
        this.activeKeys = new Set([]);
        this.validKeys = new Set(["KeyS", "KeyW", "KeyP"]);
    }

    isGamePaused() {
        return this.activeKeys.has("KeyP");
    }

}

export default GameState;