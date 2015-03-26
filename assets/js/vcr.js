import View from  "./view.js";

export default class VCR {
    constructor(player, selector) {
        this.player = player;
        this.controls = $(selector);
        this.state    = player.state;

        player.onStateChange((newState) => this.handleStateChange(newState));
        player.onPlayheadChange((newPosition) => this.handlePlayheadChange(newPosition));
        this.view  = new View(this.controls, this.state, this);
    }

    play() {
        this.player.start();
    }

    stop() {
        this.player.stop();
    }

    rewind() {
        this.player.rewind();
    }

    slower() {
        let newSpeed = this.player.state.speed / 2;
        if (newSpeed >= this.player.state.minSpeed)
            this.player.setSpeed(newSpeed);
    }

    faster() {
        let newSpeed = this.player.state.speed * 2;
        if (newSpeed <= this.player.state.maxSpeed)
            this.player.setSpeed(newSpeed);
    }

    handleStateChange(state) {
        this.view.setState(state);
    }

    handlePlayheadChange(playhead) {
        this.view.setPlayhead(playhead);
    }


}





let Pragprog    = global.Pragprog || {};
Pragprog.VCR    = VCR;
global.Pragprog = Pragprog;
