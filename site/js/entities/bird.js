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
