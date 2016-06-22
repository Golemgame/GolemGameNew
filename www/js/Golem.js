/* global BABYLON, golem, camera, scene, AbstractGolem */
Golem = function (model) {

    /*
     BABYLON.Mesh.call(this, 'golem', scene);
     var vd = BABYLON.VertexData.CreateBox(size);
     vd.applyToMesh(this, false);
     this.scaling = new BABYLON.Vector3(1, 3, 1);
    */
    AbstractGolem.call(this, scene);

    var _this = this;
    model.meshes.forEach(function (m) {
        m.parent = _this;
        _this.addChildren(m);
    });
    this.setReady();
    //this.position.x = 10;
    var g = getGround(this.position.x, this.position.z);
    this.position.y = g.getHeightAtCoordinates(this.position.x, this.position.z) + 3.5;

    console.log("golem creato");

    this.ellipsoid = new BABYLON.Vector3(1, 1.8, 1);
    this.checkCollisions = true;
    //this.applyGravity = true;
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

    var that = this;
    var onKeyDown = function (evt) {
        var tasti = evt.keyCode;
        var ch = String.fromCharCode(tasti);

        switch (ch) {
            case "W":
                that.forward = true;
                that.backward = false;
                break;
            case "A":
                that.left = true;
                that.right = false;
                break;
            case "S":
                that.backward = true;
                that.forward = false;
                break;
            case "D":
                that.right = true;
                that.left = false;
                break;
        }
    };

    var onKeyUp = function (evt) {
        var tasti = evt.keyCode;
        var ch = String.fromCharCode(tasti);

        switch (ch) {
            case "W":
                that.forward = false;
                break;
            case "A":
                that.left = false;
                break;
            case "S":
                that.backward = false;
                break;
            case "D":
                that.right = false;
                break;
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
    if (this.forward === true) {
        var forwards = new BABYLON.Vector3(parseFloat(Math.sin(this.rotation.y)) * speed, gravity, parseFloat(Math.cos(this.rotation.y)) * speed);
        forwards = forwards.negate();
        this.moveWithCollisions(forwards);
    } else if (this.backward === true) {
        var backwards = new BABYLON.Vector3(parseFloat(Math.sin(this.rotation.y)) * speed, -gravity, parseFloat(Math.cos(this.rotation.y)) * speed);
        this.moveWithCollisions(backwards);
    } else if (this.left === true) {
        var leftwards = new BABYLON.Vector3(parseFloat(Math.cos(this.rotation.y)) * speed, -gravity, parseFloat(Math.sin(-this.rotation.y)) * speed);
        this.moveWithCollisions(leftwards);
    } else if (this.right === true) {
        var rightwards = new BABYLON.Vector3(-parseFloat(Math.cos(this.rotation.y)) * speed, -gravity, parseFloat(Math.sin(this.rotation.y)) * speed);
        this.moveWithCollisions(rightwards);
    }
};