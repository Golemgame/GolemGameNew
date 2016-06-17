/* global BABYLON, golem, camera, scene */
Golem = function (size) {

    BABYLON.Mesh.call(this, 'golem', scene);
    var vd = BABYLON.VertexData.CreateBox(size);
    vd.applyToMesh(this, false);
    this.scaling = new BABYLON.Vector3(1, 3, 1);
    this.position.x = 10;
    var g = getGround(this.position.x,this.position.z);
    this.position.y = g.getHeightAtCoordinates(this.position.x, this.position.z) + 3;
    
    console.log("golem creato");
    
    this.ellipsoid = new BABYLON.Vector3(0.1, 1, 0.1);
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

Golem.prototype = Object.create(BABYLON.Mesh.prototype);
Golem.prototype.constructor = Golem;

Golem.prototype._initMovement = function () {

    var that = this;
    var onKeyDown = function (evt) {
        var tasti = evt.keyCode;
        var ch = String.fromCharCode(tasti);

    if(ch === "W"){that.forward = true;}
    if(ch === "A"){that.left = true;}
    if(ch === "S"){that.backward = true;}
    if(ch === "D"){that.right = true;}
    };

    var onKeyUp = function (evt) {
        var tasti = evt.keyCode;
        var ch = String.fromCharCode(tasti);

    if(ch === "W"){that.forward = false;}
    if(ch === "A"){that.left = false;}
    if(ch === "S"){that.backward = false;}
    if(ch === "D"){that.right = false;}

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
    }
    else if (this.backward === true){
        var backwards = new BABYLON.Vector3(parseFloat(Math.sin(this.rotation.y)) * speed, -gravity, parseFloat(Math.cos(this.rotation.y)) * speed);
        this.moveWithCollisions(backwards);
    }
    else if(this.left === true){ 
        var leftwards = new BABYLON.Vector3(parseFloat(Math.cos(this.rotation.y)) * speed, -gravity, parseFloat(Math.sin(-this.rotation.y)) * speed);
        this.moveWithCollisions(leftwards);
    }
    else if(this.right === true){
       var rightwards = new BABYLON.Vector3(-parseFloat(Math.cos(this.rotation.y)) * speed,-gravity, parseFloat(Math.sin(this.rotation.y)) * speed);
        this.moveWithCollisions(rightwards);
    }
};