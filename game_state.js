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

    resetGame() {
        this.activeKeys = new Set([]);
        this.score.player = 0;
        this.score.opp = 0;
    }

    isGameCompleted() {
        return Math.max(this.score.player, this.score.opp) == 10;
    }

}

export default GameState;