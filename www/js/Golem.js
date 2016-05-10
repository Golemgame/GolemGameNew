var aKey = 65;
var sKey = 83;
var dKey = 68;
var wKey = 87;

Golem = function(size, scene){
    BABYLON.Mesh.call(this, 'golem', scene);
    var vd = BABYLON.VertexData.CreateBox(size);
    vd.applyToMesh(this, false);
    console.log('creazione');
    this.position.x = 5;
    this.position.y = 2;
    this.position.z = 1;
    this.checkCollisions = true;
    
    this.dead = false;
}

Golem.prototype = Object.create(BABYLON.Mesh.prototype);
Golem.prototype.constructor = Golem;

var onKeyDown = function(evt) {

	var h = parseFloat(ground.getHeightAtCoordinates(golem.position.x, golem.position.z) - golem.position.y);
    if (evt.keyCode == wKey) {
		golem.moveWithCollisions(new BABYLON.Vector3(0.0, h, 1.0));
    } else if (evt.keyCode == sKey) {
		golem.moveWithCollisions(new BABYLON.Vector3(0.0, h, -1.0));
    } else if (evt.keyCode == dKey) {
		golem.moveWithCollisions(new BABYLON.Vector3(1.0, h, 0.0));
    } else if (evt.keyCode == aKey) {
		golem.moveWithCollisions(new BABYLON.Vector3(-1.0, h, 0.0));
    }
};

BABYLON.Tools.RegisterTopRootEvents([{
    name: "keydown",
    handler: onKeyDown
}]);

