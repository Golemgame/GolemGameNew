/* global BABYLON, golem, AbstractGolem */

Golem = function (scene, model) {

    // Call super constructor
    AbstractGolem.call(this, scene);

    var _this = this;
    model.meshes.forEach(function (m) {
        m.parent = _this;
        _this.addChildren(m);
    });

    this.position.x = 10;
    var g = getGround(this.position.x, this.position.z);
    this.position.y = g.getHeightAtCoordinates(this.position.x, this.position.z) + 2;

    // Compute world matrix at first frame
    this.setReady();
    
        
    blip = new BABYLON.Sound("Blip", "asset/sounds/ambient.wav", scene, function () {
    }, {loop: true, autoplay: true});

    // Sound will now follow the mesh position
    blip.attachToMesh(this);

    this.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
    this.ellipsoid = new BABYLON.Vector3(0.1, 1, 0.1);
    this.checkCollisions = true;
    this.applyGravity = true;
    this._initMovement();
    this.dead = false;
    //movimenti
    this.left = false;
    this.right = false;
    this.forward = false;
    this.backward = false;
};

Golem.prototype = Object.create(AbstractGolem.prototype);
Golem.prototype.constructor = Golem;

Golem.prototype._initMovement = function () {

    var onKeyDown = function (evt) {
        var tasti = evt.keyCode;
        var ch = String.fromCharCode(tasti);

        switch (ch) {
            case "W":
                golem.forward = true;
                break;
            case "A":
                golem.left = true;
                break;
            case "S":
                golem.backward = true;
                break;
            case "D":
                golem.right = true;
                break;
        }
    };

    var onKeyUp = function (evt) {
        var tasti = evt.keyCode;
        var ch = String.fromCharCode(tasti);

        if (ch === "W") {
            golem.forward = false;
        }
        if (ch === "A") {
            golem.left = false;
        }
        if (ch === "S") {
            golem.backward = false;
        }
        if (ch === "D") {
            golem.right = false;
        }

    };

    BABYLON.Tools.RegisterTopRootEvents([{
            name: "keydown",
            handler: onKeyDown
        }, {
            name: "keyup",
            handler: onKeyUp
        }]);
};

Golem.prototype.move = function () {
    var speed = 1.2;
    var gravity = 0.5;
    if (golem.forward === true) {
        var forwards = new BABYLON.Vector3(parseFloat(Math.sin(golem.rotation.y)) * speed, gravity, parseFloat(Math.cos(golem.rotation.y)) * speed);
        forwards = forwards.negate();
        golem.moveWithCollisions(forwards);
    } else if (golem.backward === true) {
        var backwards = new BABYLON.Vector3(parseFloat(Math.sin(golem.rotation.y)) * speed, -gravity, parseFloat(Math.cos(golem.rotation.y)) * speed);
        golem.moveWithCollisions(backwards);
    } else if (golem.left === true) {
        var leftwards = new BABYLON.Vector3(parseFloat(Math.cos(golem.rotation.y)) * speed, -gravity, parseFloat(Math.sin(-golem.rotation.y)) * speed);
        golem.moveWithCollisions(leftwards);
    } else if (golem.right === true) {
        var rightwards = new BABYLON.Vector3(-parseFloat(Math.cos(golem.rotation.y)) * speed, -gravity, parseFloat(Math.sin(golem.rotation.y)) * speed);
        golem.moveWithCollisions(rightwards);
    }
};