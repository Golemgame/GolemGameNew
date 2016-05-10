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
    
    
    this.dead = false;
}

Golem.prototype = Object.create(BABYLON.Mesh.prototype);
Golem.prototype.constructor = Golem;

var onKeyDown = function(evt) {

    if (evt.keyCode == wKey) {
        golem.position.z++;
    } else if (evt.keyCode == sKey) {
        golem.position.z--;
    } else if (evt.keyCode == dKey) {
        golem.position.x++;
    } else if (evt.keyCode == aKey) {
        golem.position.x--;
    }
};

BABYLON.Tools.RegisterTopRootEvents([{
    name: "keydown",
    handler: onKeyDown
}]);

