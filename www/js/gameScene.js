/* global BABYLON, document, window */
var canvas,
    engine,
    scene,
    camera  = [],
    enemy,
    golem,
    ground;


var startingPoint = function () {
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);
    scene = initScene(scene);
    camera = initCamera(camera);
    
    //Creazione LUCE =========================================================================
    var sun = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(60, 100, 10), scene);
    var d1 = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, -1, -2), scene);
    d1.position = new BABYLON.Vector3(-300, 300, 600);
    var shadowGenerator = new BABYLON.ShadowGenerator(2048, d1);
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light1.intensity = 0.8;
    //========================================================================================

    var skybox = initSkybox(skybox);

    //Creazione GROUND =======================================================================
    // Seafloor
    var extraGround = BABYLON.Mesh.CreateGround("extraGround", 300, 300, 1, scene, false);
    extraGround.backFaceCulling = false;
    var extraGroundMaterial = new BABYLON.StandardMaterial("extraGround", scene);
    extraGroundMaterial.diffuseTexture = new BABYLON.Texture("shader/Ground/Sand.jpg", scene);
    extraGroundMaterial.diffuseTexture.uScale = 60;
    extraGroundMaterial.diffuseTexture.vScale = 60;
    extraGround.position.y = -1.05;
    extraGround.material = extraGroundMaterial;
    extraGround.checkCollisions = true;

    // Shore
    ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "asset/HeightMap.png", 280, 280, 80, 0, 6, scene, false);
    ground.backFaceCulling = false;
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("asset/grass/Grass4.jpg", scene);
    groundMaterial.diffuseTexture.uScale = 6;
    groundMaterial.diffuseTexture.vScale = 6;
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    ground.position.y = -1.0;
    ground.material = groundMaterial;
    ground.checkCollisions = true;
    ground.receiveShadows = true;
    
    var tg;
    ground.onReady = function () {
        tg = new TreeGenerator(ground, shadowGenerator);
    };

    var borders = [];
    borders = initBorders(borders);
    
    golem = new Golem(1, ground);
    
    enemy = new EnemyGenerator(1,300);

    //Creazione ACQUA=========================================================================
    // Sea
    BABYLON.Engine.ShadersRepository = "";
    var water = BABYLON.Mesh.CreateGround("water", 300, 300, 1, scene, false);
    water.backFaceCulling = false;
    var waterMaterial = new WaterMaterial("water", scene, sun);
    waterMaterial.refractionTexture.renderList.push(extraGround);
    waterMaterial.refractionTexture.renderList.push(ground);
    waterMaterial.refractionTexture.renderList.push(golem);
    //waterMaterial.refractionTexture.renderList.push(enemy);

    waterMaterial.reflectionTexture.renderList.push(ground);
    waterMaterial.reflectionTexture.renderList.push(skybox);
    water.material = waterMaterial;
    
    interactions();

    

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
    camera[0].upperRadiusLimit = 22;
    scene.activeCamera = camera[0];
    camera[0].attachControl(canvas);
    return camera;
}
function initSkybox(skybox){
    skybox = BABYLON.Mesh.CreateBox("skyBox", 150, scene);
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
    var border;
    //left border
    border = BABYLON.Mesh.CreateBox("border0", 1, scene);
    border.scaling = new BABYLON.Vector3(1, 300, 300);
    border.position.x = -150;
    border.checkCollisions = true;
    border.isVisible = false;
    borders.push(border);
    
    //right border
    border = BABYLON.Mesh.CreateBox("border1", 1, scene);
    border.scaling = new BABYLON.Vector3(1, 300, 300);
    border.position.x = 150;
    border.checkCollisions = true;
    border.isVisible = false;
    borders.push(border);

    //front border
    border = BABYLON.Mesh.CreateBox("border2", 1, scene);
    border.scaling = new BABYLON.Vector3(300, 300, 1);
    border.position.z = 150;
    border.checkCollisions = true;
    border.isVisible = false;
    borders.push(border);
    
    //rear border
    border = BABYLON.Mesh.CreateBox("border3", 1, scene);
    border.scaling = new BABYLON.Vector3(300, 300, 1);
    border.position.z = -150;
    border.checkCollisions = true;
    border.isVisible = false;
    borders.push(border);
    
    return borders;
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
        executeAsync(golem, enemy._enemies[i], ground);
    }
}
function cameraFollow(){
    golem.rotation.y = -4.69 - camera[0].alpha;
    camera[0].target.x = parseFloat(golem.position.x);
    camera[0].target.z = parseFloat(golem.position.z);
}