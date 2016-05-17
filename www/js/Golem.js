

Golem = function(size, scene){
    
    
    BABYLON.Mesh.call(this, 'golem', scene);
    var vd = BABYLON.VertexData.CreateBox(size);
    vd.applyToMesh(this, false);
    console.log('creazione');
    this.position.x = 5;
    this.scaling = new BABYLON.Vector3(1,3,1);
    this.position.z = 1;
	this.position.y = ground.getHeightAtCoordinates(this.position.x, this.position.z) + 2;
	this.ellipsoid = new BABYLON.Vector3(0.1,1,0.1);
    this.checkCollisions = true;
    this.applyGravity = true;
    this._initMovement();
    this.dead = false;
    //movimenti
    this.left = false;
    this.right = false;
    this.forward = false;
    this.backward = false;
    
}

Golem.prototype = Object.create(BABYLON.Mesh.prototype);
Golem.prototype.constructor = Golem;

Golem.prototype._initMovement = function(){
    
    var onKeyDown = function(evt){
    var tasti = evt.keyCode;
    var ch  = String.fromCharCode(tasti);
    
    if(ch === "W"){golem.forward = true};
    if(ch === "A"){golem.left = true};
    if(ch === "S"){golem.backward = true};
    if(ch === "D"){golem.right = true};
};
    
    var onKeyUp = function(evt){
    var tasti = evt.keyCode;
    var ch = String.fromCharCode(tasti);
    
    if(ch === "W"){golem.forward = false};
    if(ch === "A"){golem.left = false};
    if(ch === "S"){golem.backward = false};
    if(ch === "D"){golem.right = false};
    
};
    
    BABYLON.Tools.RegisterTopRootEvents([{
        name: "keydown",
        handler: onKeyDown
    },{
        name: "keyup",
        handler: onKeyUp
    }]);  
};

Golem.prototype.move = function(){
    var speedCharacter = 8;
var gravity =0.5;
    if(golem.forward === true){
        var forwards = new BABYLON.Vector3(parseFloat(Math.sin(golem.rotation.y)) / speedCharacter, gravity, parseFloat(Math.cos(golem.rotation.y)) / speedCharacter);
            forwards = forwards.negate();
            golem.moveWithCollisions(forwards);	
    }
    else if (golem.backward === true){
        var backwards = new BABYLON.Vector3(parseFloat(Math.sin(golem.rotation.y)) / speedCharacter, -gravity, parseFloat(Math.cos(golem.rotation.y)) / speedCharacter);
            golem.moveWithCollisions(backwards);      
    }
    else if(golem.left === true){ 
       var backwards = new BABYLON.Vector3(parseFloat(Math.cos(golem.rotation.y)) / speedCharacter, -gravity, parseFloat(Math.sin(-golem.rotation.y)) / speedCharacter);
        golem.moveWithCollisions(backwards);   
    }
    else if(golem.right === true){
       var backwards = new BABYLON.Vector3(-parseFloat(Math.cos(golem.rotation.y)) / speedCharacter,-gravity, parseFloat(Math.sin(golem.rotation.y)) / speedCharacter);
     golem.moveWithCollisions(backwards);
    }
};




