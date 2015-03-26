(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var View = _interopRequire(require("./view.js"));

var VCR = (function () {
    function VCR(player, selector) {
        var _this = this;

        _classCallCheck(this, VCR);

        this.player = player;
        this.controls = $(selector);
        this.state = player.state;

        player.onStateChange(function (newState) {
            return _this.handleStateChange(newState);
        });
        player.onPlayheadChange(function (newPosition) {
            return _this.handlePlayheadChange(newPosition);
        });
        this.view = new View(this.controls, this.state, this);
    }

    _createClass(VCR, {
        play: {
            value: function play() {
                this.player.start();
            }
        },
        stop: {
            value: function stop() {
                this.player.stop();
            }
        },
        rewind: {
            value: function rewind() {
                this.player.rewind();
            }
        },
        slower: {
            value: function slower() {
                var newSpeed = this.player.state.speed / 2;
                if (newSpeed >= this.player.state.minSpeed) this.player.setSpeed(newSpeed);
            }
        },
        faster: {
            value: function faster() {
                var newSpeed = this.player.state.speed * 2;
                if (newSpeed <= this.player.state.maxSpeed) this.player.setSpeed(newSpeed);
            }
        },
        handleStateChange: {
            value: function handleStateChange(state) {
                this.view.setState(state);
            }
        },
        handlePlayheadChange: {
            value: function handlePlayheadChange(playhead) {
                this.view.setPlayhead(playhead);
            }
        }
    });

    return VCR;
})();

module.exports = VCR;

var Pragprog = global.Pragprog || {};
Pragprog.VCR = VCR;
global.Pragprog = Pragprog;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./view.js":2}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var content = "\n        <progress min=\"0\" max=\"100\" value=\"0\"></progress>\n        <ul>\n          <li><i class=\"icon-to-start vcr-rewind\"></i></li>\n          <li><i class=\"icon-play vcr-play\"></i><i class=\"icon-stop vcr-stop\"></i></li>\n          <li><i class=\"icon-left-open vcr-slower\"></i>\n          <span class=\"speed\">&times;<span class=\"speed-value\">1</span></span>\n          <i class=\"icon-right-open vcr-faster\"></i>\n          </li>\n        </ul>\n";

var fractions = ["??", "&#8539;", "&frac14", "&#8540;", "&frac12;", "&#8541;", "&frac34", "&#8542;"];

var View = (function () {
    function View(controls, state, controller) {
        _classCallCheck(this, View);

        this.controls = controls;
        this.controller = controller;
        this.state = state;
        this.populate(this.controls, state);
    }

    _createClass(View, {
        populate: {
            value: function populate(controls, state) {
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
        },
        setState: {
            value: function setState(state) {
                this.state = state;
                if (state.playing) {
                    this.playButton.hide();
                    this.stopButton.show();
                } else {
                    this.playButton.show();
                    this.stopButton.hide();
                }
                this.setSpeed(state.speed);
                this.setPlayhead(state.playhead);
            }
        },
        setPlayhead: {
            value: function setPlayhead(playhead) {
                this.progress.val(playhead);
            }
        },
        setSpeed: {
            value: function setSpeed(speed) {
                if (speed < 1) speed = this.fraction(speed);
                this.speedValue.html(speed);
            }
        },
        fraction: {
            value: function fraction(val) {
                val = Math.round(val * 8);
                if (val < 1 || val > 7) {
                    return "??";
                } else {
                    return fractions[val];
                }
            }
        },
        setupCallbacks: {
            value: function setupCallbacks(controls) {
                var _this = this;

                controls.on("click", ".vcr-rewind", function (event) {
                    return _this.rewind(event);
                });

                controls.on("click", ".vcr-stop", function (event) {
                    return _this.stop(event);
                });
                controls.on("click", ".vcr-play", function (event) {
                    return _this.play(event);
                });
                controls.on("click", ".vcr-slower", function (event) {
                    return _this.slower(event);
                });
                controls.on("click", ".vcr-faster", function (event) {
                    return _this.faster(event);
                });
            }
        },
        play: {
            value: function play(event) {
                this.controller.play();
            }
        },
        stop: {
            value: function stop(event) {
                this.controller.stop();
            }
        },
        rewind: {
            value: function rewind(event) {
                this.controller.rewind();
            }
        },
        slower: {
            value: function slower(event) {
                this.controller.slower();
            }
        },
        faster: {
            value: function faster(event) {
                this.controller.faster();
            }
        }
    });

    return View;
})();

module.exports = View;

},{}]},{},[1]);
