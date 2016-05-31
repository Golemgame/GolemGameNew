var miniMap = function(mm, name, scene){

    mm = new BABYLON.FreeCamera(name, new BABYLON.Vector3(0,10,0), scene);
    mm.layerMask = 1;
    mm.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    
    mm.orthoLeft = -20;
    mm.orthoRight = 20;
    mm.orthoTop = 20;
    mm.orthoBottom = -20;

    mm.rotation.x = Math.PI/2;

    var xstart = 0.8,
        ystart = 0.75;
    var width = 0.99-xstart,
        height = 1-ystart;

    mm.viewport = new BABYLON.Viewport(
        xstart,
        ystart,
        width,
        height
    );
    
    scene.activeCameras.push(mm);
    return mm;
}