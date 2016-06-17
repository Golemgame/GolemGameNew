/* global BABYLON, document, window */
var canvas,
    engine,
    scene,
    camera  = [],
    enemy,
    golem,
    ground,
    checkpoint;


var startingPoint = function () {
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);
    scene = initScene(scene);
    camera = initCamera(camera);
    
    var light = [];
    light = initLight();
    
    ground = new MapGenerator(scene, 3, 100);
    
    var tg=[], borders=[], water, skybox;
    ground.onReady = function () {
        skybox = initSkybox(skybox);
        borders = initBorders(borders);
        var tiles = ground.unsortedMap();
        for(var i=0; i<tiles.length; i++){
            tg[i] = new TreeGenerator(tiles[i], light[2]);
        }
        enemy = new EnemyGenerator(1,ground.sideLength);
        golem = new Golem(2);
        checkpoint = new Checkpoint();
        water = initWater(skybox, light[0]);
        interactions();
    };
    engine.runRenderLoop(function () {
        scene.render();
        if (scene.isReady && golem) {
            cameraFollow();
            golem.move();
        }
    });
    
    window.addEventListener('resize', function () {
        engine.resize();
    });
};

function initScene(scene){
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 1, 1);
    scene.workerCollisions = true;  //move the collisions processing into another thread
    scene.collisionsEnabled = true;
    scene.gravity = new BABYLON.Vector3(0, -0.5, 0);
    scene.attachControl(canvas);
    return scene;
}
function initCamera(camera){
    camera[0] = new BABYLON.ArcRotateCamera("CameraBaseRotate", -Math.PI / 2, Math.PI / 2.2, 12, new BABYLON.Vector3(0, 4.8, 0), scene);
    //velocità zoom
    camera[0].wheelPrecision = 15;
    // distanza min +zoom
    camera[0].lowerRadiusLimit = 0.0001;
    // distanza max -zoom
    camera[0].upperRadiusLimit = 50;
    camera[0].applyGravity = true;
    scene.activeCamera = camera[0];
    camera[0].attachControl(canvas);
    return camera;
}
function initSkybox(skybox){
    skybox = BABYLON.Mesh.CreateBox("skyBox", ground.sideLength, scene);
    var sky = new BABYLON.StandardMaterial("skyBox", scene);
    sky.backFaceCulling = false;
    sky.reflectionTexture = new BABYLON.CubeTexture("asset/skybox/skybox", scene);
    sky.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    sky.diffuseColor = new BABYLON.Color3(0, 0, 0);
    sky.specularColor = new BABYLON.Color3(0, 0, 0);
    sky.disableLighting = true;
    skybox.material = sky;
    skybox.infiniteDistance = true;
    return skybox;
}
function initBorders(borders){
    var border, sL = ground.sideLength;
    //left border
    border = BABYLON.Mesh.CreateBox("border0", 1, scene);
    border.scaling = new BABYLON.Vector3(1, sL, sL);
    border.position.x = -sL/2;
    border.checkCollisions = true;
    border.isVisible = false;
    borders.push(border);
    
    //right border
    border = BABYLON.Mesh.CreateBox("border1", 1, scene);
    border.scaling = new BABYLON.Vector3(1, sL, sL);
    border.position.x = sL/2;
    border.checkCollisions = true;
    border.isVisible = false;
    borders.push(border);

    //front border
    border = BABYLON.Mesh.CreateBox("border2", 1, scene);
    border.scaling = new BABYLON.Vector3(sL, sL, 1);
    border.position.z = sL/2;
    border.checkCollisions = true;
    border.isVisible = false;
    borders.push(border);
    
    //rear border
    border = BABYLON.Mesh.CreateBox("border3", 1, scene);
    border.scaling = new BABYLON.Vector3(sL, sL, 1);
    border.position.z = -sL/2;
    border.checkCollisions = true;
    border.isVisible = false;
    borders.push(border);
    
    return borders;
}
function initWater(skybox, sun){
    BABYLON.Engine.ShadersRepository = "";
    var water = BABYLON.Mesh.CreateGround("water", ground.sideLength, ground.sideLength, 1, scene, false);
    //water.position.y = -1;
    water.backFaceCulling = false;
    var waterMaterial = new WaterMaterial("water", scene, sun);
    //rifrazioni
    //var tiles = ground.unsortedMap();
    /*
    for(var i=0; i<tiles.length; i++){
        waterMaterial.refractionTexture.renderList.push(tiles[i]);
        waterMaterial.reflectionTexture.renderList.push(tiles[i]);
    }
    */
    waterMaterial.refractionTexture.renderList.push(golem);
    waterMaterial.reflectionTexture.renderList.push(skybox);
    water.material = waterMaterial;
    return water;
}
function initLight(){
    var l=[];
    var sun = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(60, 100, 10), scene);
    sun.intensity = 0.3;
    var d1 = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, -1, -2), scene);
    d1.position = new BABYLON.Vector3(-300, 300, 600);
    var sG = new BABYLON.ShadowGenerator(2048, d1);
    var hemi1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    hemi1.intensity = 0.3;
    l.push(sun);
    l.push(d1);
    l.push(sG);
    l.push(hemi1);
    return l;
}
function interactions(){
    var trigger = {
        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
        parameter: golem
    };
    var action = new BABYLON.SwitchBooleanAction(trigger, golem, 'dead');
    for(var i=0; i<enemy._enemies.length; i++){
        enemy._enemies[i].actionManager = new BABYLON.ActionManager(scene);
        enemy._enemies[i].actionManager.registerAction(action);
        executeAsync(golem, enemy._enemies[i]);
    }
    checkpoint.intervalCheckWin = setInterval(function(){
        if(checkpoint.checkWin()){
            clearInterval(checkpoint.intervalCheckWin);
            engine.stopRenderLoop();
        }
    }, 300);
}
function cameraFollow(){
    golem.rotation.y = -4.69 - camera[0].alpha;
    camera[0].target.x = parseFloat(golem.position.x);
    camera[0].target.z = parseFloat(golem.position.z);
    camera[0].target.y = parseFloat(golem.position.y);
}