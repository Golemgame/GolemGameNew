/* global BABYLON, golem, camera */
Golem = function (size, scene) {

    BABYLON.Mesh.call(this, 'golem', scene);
    var vd = BABYLON.VertexData.CreateBox(size);
    vd.applyToMesh(this, false);
    this.scaling = new BABYLON.Vector3(1, 3, 1);
    this.position.x = 10;
    var g = getGround(this.position.x,this.position.z);
    this.position.y = g.getHeightAtCoordinates(this.position.x, this.position.z) + 2;
    
    console.log("golem creato");
    /*camera adjustment
    camera[0].position = this.position;
    camera[0].position.y += 3;
    camera[0].target = this.position;*/
    
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

Golem.prototype = Object.create(BABYLON.Mesh.prototype);
Golem.prototype.constructor = Golem;

Golem.prototype._initMovement = function () {

    var onKeyDown = function (evt) {
        var tasti = evt.keyCode;
        var ch = String.fromCharCode(tasti);

    if(ch === "W"){golem.forward = true;}
    if(ch === "A"){golem.left = true;}
    if(ch === "S"){golem.backward = true;}
    if(ch === "D"){golem.right = true;}
    };

    var onKeyUp = function (evt) {
        var tasti = evt.keyCode;
        var ch = String.fromCharCode(tasti);

    if(ch === "W"){golem.forward = false;}
    if(ch === "A"){golem.left = false;}
    if(ch === "S"){golem.backward = false;}
    if(ch === "D"){golem.right = false;}

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
    }
    else if (golem.backward === true){
        var backwards = new BABYLON.Vector3(parseFloat(Math.sin(golem.rotation.y)) * speed, -gravity, parseFloat(Math.cos(golem.rotation.y)) * speed);
        golem.moveWithCollisions(backwards);
    }
    else if(golem.left === true){ 
        var leftwards = new BABYLON.Vector3(parseFloat(Math.cos(golem.rotation.y)) * speed, -gravity, parseFloat(Math.sin(-golem.rotation.y)) * speed);
        golem.moveWithCollisions(leftwards);
    }
    else if(golem.right === true){
       var rightwards = new BABYLON.Vector3(-parseFloat(Math.cos(golem.rotation.y)) * speed,-gravity, parseFloat(Math.sin(golem.rotation.y)) * speed);
        golem.moveWithCollisions(rightwards);
    }
};