function MockPlayer() {
    this.box = $("#box");
    this.stateChangeCallbacks = [];
    this.playheadChangeCallbacks = [];

    this.state = {
        playing:  false,
        duration: 100000,
        playhead: 44000,
        minSpeed: 0.125,
        maxSpeed: 8,
        speed:    1
    };

    this.onStateChange = function(callback) {
        this.stateChangeCallbacks.push(callback);
    };

    this.onPlayheadChange = function(callback) {
        this.playheadChangeCallbacks.push(callback);
    };

    this.stop = function() {
        this.state.playing = false;
        this.notifyStateChange();
    };

    this.start = function() {
        if (!this.state.playing) {
            var self = this;
            this.state.playing = true;
            this.startTime = null;
            if (this.state.playhead >= this.state.duration)
                this.state.playhead = 0;

            window.requestAnimationFrame(function(time) {
                self.tick(time);
            });
            this.notifyStateChange();
        };
    };

    this.rewind = function() {
        this.stop();
        this.state.playhead = 0;
        this.redraw();
        this.notifyStateChange();
    };

    this.setSpeed = function(speed) {
        this.state.speed = speed;
        this.notifyStateChange();
    }

    this.tick = function(time) {

        if (!this.state.playing)
            return;

        if (!this.startTime)
            this.startTime = time;

        this.state.playhead += (time - this.startTime);

        if (this.state.playhead > this.state.duration)
            this.state.playhead = this.state.duration;

        this.redraw();

        if (this.state.playhead < this.state.duration) {
            var self = this;
            window.requestAnimationFrame(function(time) {
                self.tick(time);
            });
            this.trigger(this.playheadChangeCallbacks, this.state.playhead);
        }
        else {
            this.state.playing = false;
            this.notifyStateChange();
        }

    };

    this.redraw = function() {
        var ratio = this.state.playhead/this.state.duration;
        var percent = "" + 100*(ratio*ratio) + "%";
        this.box.css("width", percent).css("height", percent);
    };

    this.notifyStateChange = function() {
        this.trigger(this.stateChangeCallbacks, this.state);
    };

    this.trigger = function(callbacks, param) {
        var callback;
        for (callback of callbacks) {
            callback(param);
        }
    };
};
