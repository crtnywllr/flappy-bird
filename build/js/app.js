(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BirdGraphicsComponent = function (entity) {
    this.entity = entity;
};

BirdGraphicsComponent.prototype.draw = function (context) {
    var position = this.entity.components.physics.position;

    context.save();
    context.translate(position.x, position.y);
    context.beginPath();
    context.arc(0, 0, 0.02, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
    context.restore();
};

exports.BirdGraphicsComponent = BirdGraphicsComponent;

},{}],2:[function(require,module,exports){
var PipeGraphicsComponent = function (entity) {
    this.entity = entity;
};

PipeGraphicsComponent.prototype.draw = function () {
    console.log("Drawing a pipe");
};

exports.PipeGraphicsComponent = PipeGraphicsComponent;

},{}],3:[function(require,module,exports){
var PhysicsComponent = function (entity) {
    this.entity = entity;

    this.position = {
        x: 0,
        y: 0
    };
    this.velocity = {
        x: 0,
        y: 0
    };
    this.acceleration = {
        x: 0,
        y: 0
    };
};

PhysicsComponent.prototype.update = function (delta) {
    this.velocity.x += this.acceleration.x * delta;
    this.velocity.y += this.acceleration.y * delta;

    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
};

exports.PhysicsComponent = PhysicsComponent;

},{}],4:[function(require,module,exports){
exports.Bird = Bird;

var physicsComponent = require("../components/physics/physics");
var graphicsComponent = require("../components/graphics/bird");
var Bird = function () {
    var physics = new physicsComponent.PhysicsComponent(this);
    physics.position.y = 0.5;
    physics.acceleration.y = -2;

    var graphics = new graphicsComponent.BirdGraphicsComponent(this);

    this.components = {
        physics: physics,
        graphics: graphics,
    };
};

exports.Bird = Bird;

},{"../components/graphics/bird":1,"../components/physics/physics":3}],5:[function(require,module,exports){
exports.Pipe = Pipe;

var graphicsComponent = require("../components/graphics/pipe");

var Pipe = function () {
    console.log("Creating Pipe entity");

    var graphics = new graphicsComponent.PipeGraphicsComponent(this);
    this.components = {
        graphics: graphics
    };
};

exports.Pipe = Pipe;

},{"../components/graphics/pipe":2}],6:[function(require,module,exports){
var graphicsSystem = require('./systems/graphics');
var physicsSystem = require('./systems/physics');
var inputSystem = require('./systems/input');

var bird = require('./entities/bird');
var pipe = require('./entities/pipe');

var FlappyBird = function () {
    this.entities = [new bird.Bird(), new pipe.Pipe()];
    this.graphics = new graphicsSystem.GraphicsSystem(this.entities);
    this.physics = new physicsSystem.PhysicsSystem(this.entities);
    this.input = new inputSystem.InputSystem(this.entities);
};

FlappyBird.prototype.run = function () {
    this.graphics.run();
    this.physics.run();
    this.input.run();
};

exports.FlappyBird = FlappyBird;

},{"./entities/bird":4,"./entities/pipe":5,"./systems/graphics":8,"./systems/input":9,"./systems/physics":10}],7:[function(require,module,exports){

var flappyBird = require('./flappy_bird');

document.addEventListener('DOMContentLoaded', function () {
    var app = new flappyBird.FlappyBird();
    app.run();
});

},{"./flappy_bird":6}],8:[function(require,module,exports){
var GraphicsSystem = function (entities) {
    this.entities = entities;
    // Canvas is where we draw
    this.canvas = document.getElementById('main-canvas');
    // Context is what we draw to
    this.context = this.canvas.getContext('2d');
};

GraphicsSystem.prototype.run = function () {
    // Run the render loop
    window.requestAnimationFrame(this.tick.bind(this));
};

GraphicsSystem.prototype.tick = function () {
    // Set the canvas to the correct size if the window is resized
    if (this.canvas.width != this.canvas.offsetWidth ||
        this.canvas.height != this.canvas.offsetHeight) {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.save();
    this.context.translate(this.canvas.width / 2, this.canvas.height);
    this.context.scale(this.canvas.height, -this.canvas.height);

    for (var i = 0; i < this.entities.length; i++) {
        var entity = this.entities[i];
        if (!'graphics' in entity.components) {
            continue;
        }

        entity.components.graphics.draw(this.context);
    }

    this.context.restore();

    window.requestAnimationFrame(this.tick.bind(this));
};

exports.GraphicsSystem = GraphicsSystem;

},{}],9:[function(require,module,exports){
var InputSystem = function (entities) {
    this.entities = entities;

    // Canvas is where we get input from
    this.canvas = document.getElementById('main-canvas');
};

InputSystem.prototype.run = function () {
    this.canvas.addEventListener('click', this.onClick.bind(this));
};

InputSystem.prototype.onClick = function () {
    var bird = this.entities[0];
    bird.components.physics.velocity.y = 0.7;
};

exports.InputSystem = InputSystem;

},{}],10:[function(require,module,exports){
var PhysicsSystem = function(entities) {
this.entities = entities;
};

PhysicsSystem.prototype.run = function() {
// Run the update loop
window.setInterval(this.tick.bind(this), 1000 /60);
};

PhysicsSystem.prototype.tick = function() {
for (var i=0; i<this.entities.length; i++) {
var entity = this.entities[i];
if (!'physics' in entity.components) {
continue;
}

entity.components.physics.update(1/60);
}
};

exports.PhysicsSystem = PhysicsSystem;
},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzaXRlL2pzL2NvbXBvbmVudHMvZ3JhcGhpY3MvYmlyZC5qcyIsInNpdGUvanMvY29tcG9uZW50cy9ncmFwaGljcy9waXBlLmpzIiwic2l0ZS9qcy9jb21wb25lbnRzL3BoeXNpY3MvcGh5c2ljcy5qcyIsInNpdGUvanMvZW50aXRpZXMvYmlyZC5qcyIsInNpdGUvanMvZW50aXRpZXMvcGlwZS5qcyIsInNpdGUvanMvZmxhcHB5X2JpcmQuanMiLCJzaXRlL2pzL21haW4uanMiLCJzaXRlL2pzL3N5c3RlbXMvZ3JhcGhpY3MuanMiLCJzaXRlL2pzL3N5c3RlbXMvaW5wdXQuanMiLCJzaXRlL2pzL3N5c3RlbXMvcGh5c2ljcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQmlyZEdyYXBoaWNzQ29tcG9uZW50ID0gZnVuY3Rpb24gKGVudGl0eSkge1xyXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XHJcbn07XHJcblxyXG5CaXJkR3JhcGhpY3NDb21wb25lbnQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgdmFyIHBvc2l0aW9uID0gdGhpcy5lbnRpdHkuY29tcG9uZW50cy5waHlzaWNzLnBvc2l0aW9uO1xyXG5cclxuICAgIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUocG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5hcmMoMCwgMCwgMC4wMiwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgY29udGV4dC5maWxsKCk7XHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbn07XHJcblxyXG5leHBvcnRzLkJpcmRHcmFwaGljc0NvbXBvbmVudCA9IEJpcmRHcmFwaGljc0NvbXBvbmVudDtcclxuIiwidmFyIFBpcGVHcmFwaGljc0NvbXBvbmVudCA9IGZ1bmN0aW9uIChlbnRpdHkpIHtcclxuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xyXG59O1xyXG5cclxuUGlwZUdyYXBoaWNzQ29tcG9uZW50LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJEcmF3aW5nIGEgcGlwZVwiKTtcclxufTtcclxuXHJcbmV4cG9ydHMuUGlwZUdyYXBoaWNzQ29tcG9uZW50ID0gUGlwZUdyYXBoaWNzQ29tcG9uZW50O1xyXG4iLCJ2YXIgUGh5c2ljc0NvbXBvbmVudCA9IGZ1bmN0aW9uIChlbnRpdHkpIHtcclxuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xyXG5cclxuICAgIHRoaXMucG9zaXRpb24gPSB7XHJcbiAgICAgICAgeDogMCxcclxuICAgICAgICB5OiAwXHJcbiAgICB9O1xyXG4gICAgdGhpcy52ZWxvY2l0eSA9IHtcclxuICAgICAgICB4OiAwLFxyXG4gICAgICAgIHk6IDBcclxuICAgIH07XHJcbiAgICB0aGlzLmFjY2VsZXJhdGlvbiA9IHtcclxuICAgICAgICB4OiAwLFxyXG4gICAgICAgIHk6IDBcclxuICAgIH07XHJcbn07XHJcblxyXG5QaHlzaWNzQ29tcG9uZW50LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgIHRoaXMudmVsb2NpdHkueCArPSB0aGlzLmFjY2VsZXJhdGlvbi54ICogZGVsdGE7XHJcbiAgICB0aGlzLnZlbG9jaXR5LnkgKz0gdGhpcy5hY2NlbGVyYXRpb24ueSAqIGRlbHRhO1xyXG5cclxuICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5LnggKiBkZWx0YTtcclxuICAgIHRoaXMucG9zaXRpb24ueSArPSB0aGlzLnZlbG9jaXR5LnkgKiBkZWx0YTtcclxufTtcclxuXHJcbmV4cG9ydHMuUGh5c2ljc0NvbXBvbmVudCA9IFBoeXNpY3NDb21wb25lbnQ7XHJcbiIsImV4cG9ydHMuQmlyZCA9IEJpcmQ7XHJcblxyXG52YXIgcGh5c2ljc0NvbXBvbmVudCA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3BoeXNpY3MvcGh5c2ljc1wiKTtcclxudmFyIGdyYXBoaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvZ3JhcGhpY3MvYmlyZFwiKTtcclxudmFyIEJpcmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcGh5c2ljcyA9IG5ldyBwaHlzaWNzQ29tcG9uZW50LlBoeXNpY3NDb21wb25lbnQodGhpcyk7XHJcbiAgICBwaHlzaWNzLnBvc2l0aW9uLnkgPSAwLjU7XHJcbiAgICBwaHlzaWNzLmFjY2VsZXJhdGlvbi55ID0gLTI7XHJcblxyXG4gICAgdmFyIGdyYXBoaWNzID0gbmV3IGdyYXBoaWNzQ29tcG9uZW50LkJpcmRHcmFwaGljc0NvbXBvbmVudCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLmNvbXBvbmVudHMgPSB7XHJcbiAgICAgICAgcGh5c2ljczogcGh5c2ljcyxcclxuICAgICAgICBncmFwaGljczogZ3JhcGhpY3MsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0cy5CaXJkID0gQmlyZDtcclxuIiwiZXhwb3J0cy5QaXBlID0gUGlwZTtcclxuXHJcbnZhciBncmFwaGljc0NvbXBvbmVudCA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2dyYXBoaWNzL3BpcGVcIik7XHJcblxyXG52YXIgUGlwZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgUGlwZSBlbnRpdHlcIik7XHJcblxyXG4gICAgdmFyIGdyYXBoaWNzID0gbmV3IGdyYXBoaWNzQ29tcG9uZW50LlBpcGVHcmFwaGljc0NvbXBvbmVudCh0aGlzKTtcclxuICAgIHRoaXMuY29tcG9uZW50cyA9IHtcclxuICAgICAgICBncmFwaGljczogZ3JhcGhpY3NcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnRzLlBpcGUgPSBQaXBlO1xyXG4iLCJ2YXIgZ3JhcGhpY3NTeXN0ZW0gPSByZXF1aXJlKCcuL3N5c3RlbXMvZ3JhcGhpY3MnKTtcclxudmFyIHBoeXNpY3NTeXN0ZW0gPSByZXF1aXJlKCcuL3N5c3RlbXMvcGh5c2ljcycpO1xyXG52YXIgaW5wdXRTeXN0ZW0gPSByZXF1aXJlKCcuL3N5c3RlbXMvaW5wdXQnKTtcclxuXHJcbnZhciBiaXJkID0gcmVxdWlyZSgnLi9lbnRpdGllcy9iaXJkJyk7XHJcbnZhciBwaXBlID0gcmVxdWlyZSgnLi9lbnRpdGllcy9waXBlJyk7XHJcblxyXG52YXIgRmxhcHB5QmlyZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZW50aXRpZXMgPSBbbmV3IGJpcmQuQmlyZCgpLCBuZXcgcGlwZS5QaXBlKCldO1xyXG4gICAgdGhpcy5ncmFwaGljcyA9IG5ldyBncmFwaGljc1N5c3RlbS5HcmFwaGljc1N5c3RlbSh0aGlzLmVudGl0aWVzKTtcclxuICAgIHRoaXMucGh5c2ljcyA9IG5ldyBwaHlzaWNzU3lzdGVtLlBoeXNpY3NTeXN0ZW0odGhpcy5lbnRpdGllcyk7XHJcbiAgICB0aGlzLmlucHV0ID0gbmV3IGlucHV0U3lzdGVtLklucHV0U3lzdGVtKHRoaXMuZW50aXRpZXMpO1xyXG59O1xyXG5cclxuRmxhcHB5QmlyZC5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5ncmFwaGljcy5ydW4oKTtcclxuICAgIHRoaXMucGh5c2ljcy5ydW4oKTtcclxuICAgIHRoaXMuaW5wdXQucnVuKCk7XHJcbn07XHJcblxyXG5leHBvcnRzLkZsYXBweUJpcmQgPSBGbGFwcHlCaXJkO1xyXG4iLCJcclxudmFyIGZsYXBweUJpcmQgPSByZXF1aXJlKCcuL2ZsYXBweV9iaXJkJyk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGFwcCA9IG5ldyBmbGFwcHlCaXJkLkZsYXBweUJpcmQoKTtcclxuICAgIGFwcC5ydW4oKTtcclxufSk7XHJcbiIsInZhciBHcmFwaGljc1N5c3RlbSA9IGZ1bmN0aW9uIChlbnRpdGllcykge1xyXG4gICAgdGhpcy5lbnRpdGllcyA9IGVudGl0aWVzO1xyXG4gICAgLy8gQ2FudmFzIGlzIHdoZXJlIHdlIGRyYXdcclxuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tY2FudmFzJyk7XHJcbiAgICAvLyBDb250ZXh0IGlzIHdoYXQgd2UgZHJhdyB0b1xyXG4gICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxufTtcclxuXHJcbkdyYXBoaWNzU3lzdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBSdW4gdGhlIHJlbmRlciBsb29wXHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcclxufTtcclxuXHJcbkdyYXBoaWNzU3lzdGVtLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gU2V0IHRoZSBjYW52YXMgdG8gdGhlIGNvcnJlY3Qgc2l6ZSBpZiB0aGUgd2luZG93IGlzIHJlc2l6ZWRcclxuICAgIGlmICh0aGlzLmNhbnZhcy53aWR0aCAhPSB0aGlzLmNhbnZhcy5vZmZzZXRXaWR0aCB8fFxyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCAhPSB0aGlzLmNhbnZhcy5vZmZzZXRIZWlnaHQpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLm9mZnNldEhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XHJcbiAgICB0aGlzLmNvbnRleHQudHJhbnNsYXRlKHRoaXMuY2FudmFzLndpZHRoIC8gMiwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgIHRoaXMuY29udGV4dC5zY2FsZSh0aGlzLmNhbnZhcy5oZWlnaHQsIC10aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbnRpdGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBlbnRpdHkgPSB0aGlzLmVudGl0aWVzW2ldO1xyXG4gICAgICAgIGlmICghJ2dyYXBoaWNzJyBpbiBlbnRpdHkuY29tcG9uZW50cykge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVudGl0eS5jb21wb25lbnRzLmdyYXBoaWNzLmRyYXcodGhpcy5jb250ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xyXG5cclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xyXG59O1xyXG5cclxuZXhwb3J0cy5HcmFwaGljc1N5c3RlbSA9IEdyYXBoaWNzU3lzdGVtO1xyXG4iLCJ2YXIgSW5wdXRTeXN0ZW0gPSBmdW5jdGlvbiAoZW50aXRpZXMpIHtcclxuICAgIHRoaXMuZW50aXRpZXMgPSBlbnRpdGllcztcclxuXHJcbiAgICAvLyBDYW52YXMgaXMgd2hlcmUgd2UgZ2V0IGlucHV0IGZyb21cclxuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tY2FudmFzJyk7XHJcbn07XHJcblxyXG5JbnB1dFN5c3RlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2suYmluZCh0aGlzKSk7XHJcbn07XHJcblxyXG5JbnB1dFN5c3RlbS5wcm90b3R5cGUub25DbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBiaXJkID0gdGhpcy5lbnRpdGllc1swXTtcclxuICAgIGJpcmQuY29tcG9uZW50cy5waHlzaWNzLnZlbG9jaXR5LnkgPSAwLjc7XHJcbn07XHJcblxyXG5leHBvcnRzLklucHV0U3lzdGVtID0gSW5wdXRTeXN0ZW07XHJcbiIsInZhciBQaHlzaWNzU3lzdGVtID0gZnVuY3Rpb24oZW50aXRpZXMpIHtcclxudGhpcy5lbnRpdGllcyA9IGVudGl0aWVzO1xyXG59O1xyXG5cclxuUGh5c2ljc1N5c3RlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XHJcbi8vIFJ1biB0aGUgdXBkYXRlIGxvb3Bcclxud2luZG93LnNldEludGVydmFsKHRoaXMudGljay5iaW5kKHRoaXMpLCAxMDAwIC82MCk7XHJcbn07XHJcblxyXG5QaHlzaWNzU3lzdGVtLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24oKSB7XHJcbmZvciAodmFyIGk9MDsgaTx0aGlzLmVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbnZhciBlbnRpdHkgPSB0aGlzLmVudGl0aWVzW2ldO1xyXG5pZiAoISdwaHlzaWNzJyBpbiBlbnRpdHkuY29tcG9uZW50cykge1xyXG5jb250aW51ZTtcclxufVxyXG5cclxuZW50aXR5LmNvbXBvbmVudHMucGh5c2ljcy51cGRhdGUoMS82MCk7XHJcbn1cclxufTtcclxuXHJcbmV4cG9ydHMuUGh5c2ljc1N5c3RlbSA9IFBoeXNpY3NTeXN0ZW07Il19
