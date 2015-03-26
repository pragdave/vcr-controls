const content = `
        <progress min="0" max="100" value="0"></progress>
        <ul>
          <li><i class="icon-to-start vcr-rewind"></i></li>
          <li><i class="icon-play vcr-play"></i><i class="icon-stop vcr-stop"></i></li>
          <li><i class="icon-left-open vcr-slower"></i>
          <span class="speed">&times;<span class="speed-value">1</span></span>
          <i class="icon-right-open vcr-faster"></i>
          </li>
        </ul>
`;

const fractions = [ "??",       "&#8539;", "&frac14", "&#8540;",
                    "&frac12;", "&#8541;", "&frac34", "&#8542;" ];

export default class View {

    constructor(controls, state, controller) {
        this.controls   = controls;
        this.controller = controller;
        this.state      = state;
        this.populate(this.controls, state);
    }

    populate(controls, state) {
        controls.html(content);

        this.progress = controls.find("progress");
        this.progress.attr("min", 0);
        this.progress.attr("max", state.duration);

        this.setupCallbacks(controls);

        this.playButton = controls.find(".vcr-play");
        this.stopButton = controls.find(".vcr-stop");
        this.speedValue = controls.find(".speed-value");

        this.setState(state);
    }

    setState(state) {
        this.state = state;
        if (state.playing) {
            this.playButton.hide();
            this.stopButton.show();
        }
        else {
            this.playButton.show();
            this.stopButton.hide();
        }
        this.setSpeed(state.speed);
        this.setPlayhead(state.playhead);
    }

    setPlayhead(playhead) {
        this.progress.val(playhead);
    }

    setSpeed(speed) {
        if (speed < 1)
            speed = this.fraction(speed);
        this.speedValue.html(speed);
    }

    fraction(val) {
        val = Math.round(val*8);
        if (val < 1 || val > 7)
            return "??";
        else
            return fractions[val];

    }

    setupCallbacks(controls) {
        controls.on("click", ".vcr-rewind", (event) => { return this.rewind(event); });

        controls.on("click", ".vcr-stop",         (event) => { return this.stop(event);   });
        controls.on("click", ".vcr-play",         (event) => { return this.play(event);   });
        controls.on("click", ".vcr-slower",       (event) => { return this.slower(event);   });
        controls.on("click", ".vcr-faster",       (event) => { return this.faster(event);   });
    }

    play(event) {
        this.controller.play();
    }

    stop(event) {
        this.controller.stop();
    }

    rewind(event) {
        this.controller.rewind();
    }

    slower(event) {
        this.controller.slower();
    }

    faster(event) {
        this.controller.faster();
    }
};
