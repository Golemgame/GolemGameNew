Enemy = function(size,scene){
    
    BABYLON.Mesh.call(this, 'enemy', scene);
    var vd = BABYLON.VertexData.CreateBox(size);
    vd.applyToMesh(this, false);
        
    var metal = new BABYLON.StandardMaterial("metal", scene);
	metal.diffuseTexture = new BABYLON.Texture('asset/grunge-metal.jpg', scene);
	this.material = metal;
	this.checkCollisions = true;
	this.applyGravity = true;  
    
    this.dead = false;
}
