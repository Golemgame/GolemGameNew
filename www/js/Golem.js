<<<<<<< HEAD
/* global BABYLON, golem, AbstractGolem */

Golem = function (scene, model) {

    // Call super constructor
    AbstractGolem.call(this, scene);

    var _this = this;
    model.meshes.forEach(function (m) {
        m.parent = _this;
        _this.addChildren(m);
    });
=======
/* global BABYLON, golem, camera, scene */
Golem = function (size) {
>>>>>>> refs/remotes/origin/master

    this.position.x = 10;
<<<<<<< HEAD
    var g = getGround(this.position.x, this.position.z);
    this.position.y = g.getHeightAtCoordinates(this.position.x, this.position.z) + 2;

    // Compute world matrix at first frame
    this.setReady();
    
        
    blip = new BABYLON.Sound("Blip", "asset/sounds/ambient.wav", scene, function () {
    }, {loop: true, autoplay: true});

    // Sound will now follow the mesh position
    blip.attachToMesh(this);

    this.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
=======
    var g = getGround(this.position.x,this.position.z);
    this.position.y = g.getHeightAtCoordinates(this.position.x, this.position.z) + 3;
    
    console.log("golem creato");
    
>>>>>>> refs/remotes/origin/master
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

Golem.prototype = Object.create(AbstractGolem.prototype);
Golem.prototype.constructor = Golem;

Golem.prototype._initMovement = function () {

    var that = this;
    var onKeyDown = function (evt) {
        var tasti = evt.keyCode;
        var ch = String.fromCharCode(tasti);

<<<<<<< HEAD
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
=======
    if(ch === "W"){that.forward = true;}
    if(ch === "A"){that.left = true;}
    if(ch === "S"){that.backward = true;}
    if(ch === "D"){that.right = true;}
>>>>>>> refs/remotes/origin/master
    };

    var onKeyUp = function (evt) {
        var tasti = evt.keyCode;
        var ch = String.fromCharCode(tasti);

<<<<<<< HEAD
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
=======
    if(ch === "W"){that.forward = false;}
    if(ch === "A"){that.left = false;}
    if(ch === "S"){that.backward = false;}
    if(ch === "D"){that.right = false;}
>>>>>>> refs/remotes/origin/master

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
<<<<<<< HEAD
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
=======
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
>>>>>>> refs/remotes/origin/master
    }
};