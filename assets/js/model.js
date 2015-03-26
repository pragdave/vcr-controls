import View from "./view.js";

export default class Model {

    constructor(player, selector) {
        this.player = player;
        let element = $(selector);
        player.onStateChange((newState) => this.handleStateChange(newState));
        player.onPositionChange((newPosition) => this.handlePositionChange(newPosition));
    }
}
