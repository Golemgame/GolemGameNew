var canvas;
var engine;
var scene;
var camera = [];
var enemy;
var golem;
var ground;


var startingPoint = function(){
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);

	//Creazione SCENA ========================================================================
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 1, 1);
	scene.collisionsEnabled = true;
	scene.gravity = new BABYLON.Vector3(0, -0.5, 0);
	scene.attachControl();
	//========================================================================================
		
		
		
	//Creazione CAMERA =======================================================================
    camera[0] = new BABYLON.ArcRotateCamera("CameraBaseRotate", -Math.PI/2, Math.PI/2.2, 12, new BABYLON.Vector3(0, 4.8, 0), scene);
	//velocità zoom
	camera[0].wheelPrecision = 15;	
	// distanza min +zoom
	camera[0].lowerRadiusLimit = 0.0001;
	// distanza max -zoom
	camera[0].upperRadiusLimit = 22;
	scene.activeCamera = camera[0];
	camera[0].attachControl(canvas);
	//========================================================================================	
		
		
	//Creazione LUCE =========================================================================
	var sun = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(60, 100, 10), scene);
	var d1 = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, -1, -2), scene);
	d1.position = new BABYLON.Vector3(-300,300,600);
	var shadowGenerator = new BABYLON.ShadowGenerator(2048, d1);
	var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light1.intensity = 1;
	//========================================================================================
		
		
		
	//Creazione SKYBOX =======================================================================
	var skybox = BABYLON.Mesh.CreateBox("skyBox", 150, scene);
	var sky = new BABYLON.StandardMaterial("skyBox", scene);
	sky.backFaceCulling = false;
	sky.reflectionTexture = new BABYLON.CubeTexture("asset/skybox/skybox", scene);
	sky.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	sky.diffuseColor = new BABYLON.Color3(0, 0, 0);
	sky.specularColor = new BABYLON.Color3(0, 0, 0);
	sky.disableLighting = true;
	skybox.material = sky;
	skybox.infiniteDistance = true;
	//========================================================================================
		
		
		
	//Creazione GROUND =======================================================================
	// Seafloor
	var extraGround = BABYLON.Mesh.CreateGround("extraGround", 300, 300, 1, scene, false);
	var extraGroundMaterial = new BABYLON.StandardMaterial("extraGround", scene);
	extraGroundMaterial.diffuseTexture = new BABYLON.Texture("shader/Ground/Sand.jpg", scene);
	extraGroundMaterial.diffuseTexture.uScale = 60;
	extraGroundMaterial.diffuseTexture.vScale = 60;
	extraGround.position.y = -1.05;
	extraGround.material = extraGroundMaterial;
	extraGround	.checkCollisions = true;
				
	// Shore
	ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "asset/HeightMap.png", 100, 100, 300, 0, 6, scene, false);
	var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
	groundMaterial.diffuseTexture = new BABYLON.Texture("shader/Ground/Rock.jpg", scene);
	groundMaterial.diffuseTexture.uScale = 6;
	groundMaterial.diffuseTexture.vScale = 6;
	groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	ground.position.y = -1.0;
	ground.material = groundMaterial;
	ground.checkCollisions = true;
	ground.receiveShadows = true;
	//========================================================================================
	
		
		
	//Creazione BOSCO ========================================================================
	var tg;
	ground.onReady = function(){
		tg = new TreeGenerator(ground, shadowGenerator);
	}
	//========================================================================================
	
		
	//Creazione BORDI ========================================================================
	var border1;
	border1 = BABYLON.Mesh.CreateBox("border0", 1, scene);
	border1.scaling = new BABYLON.Vector3(1, 300, 300);
	border1.position.x = -500;
	border1.checkCollisions = true;
	border1.isVisible = false;

	var border2;
	border2 = BABYLON.Mesh.CreateBox("border1", 1, scene);
	border2.scaling = new BABYLON.Vector3(1, 300, 300);
	border2.position.x = 500;
	border2.checkCollisions = true;
	border2.isVisible = false;

	var border3;
	border3 = BABYLON.Mesh.CreateBox("border2", 1, scene);
	border3.scaling = new BABYLON.Vector3(300, 300, 1);
	border3.position.z = 500;
	border3.checkCollisions = true;
	border3.isVisible = false;

	var border4;
	border4 = BABYLON.Mesh.CreateBox("border3", 1, scene);
	border4.scaling = new BABYLON.Vector3(300, 300, 1);
	border4.position.z = -500;
	border4.checkCollisions = true;
	border4.isVisible = false;
	//========================================================================================
		
		
	//Creazione ENEMY ========================================================================
	enemy = BABYLON.Mesh.CreateBox("enemy1", 2, scene);
	enemy.position.y = ground.getHeightAtCoordinates(enemy.position.x, enemy.position.z) + 2;
	var metal = new BABYLON.StandardMaterial("metal", scene);
	metal.diffuseTexture = new BABYLON.Texture('asset/grunge-metal.jpg', scene);
	enemy.material = metal;
	enemy.checkCollisions = true;
	enemy.applyGravity = true;
	//========================================================================================
		
		
	//Creazione GOLEM ========================================================================
	//golem = new Golem(1,scene);
	golem = new Golem(1,ground);
    //========================================================================================
	
	//Creazione ACQUA=========================================================================
	// Sea
	BABYLON.Engine.ShadersRepository = "";
	var water = BABYLON.Mesh.CreateGround("water", 120, 120, 1, scene, false);
	var waterMaterial = new WaterMaterial("water", scene, sun);
	waterMaterial.refractionTexture.renderList.push(extraGround);
	waterMaterial.refractionTexture.renderList.push(ground);
	waterMaterial.refractionTexture.renderList.push(golem);
	waterMaterial.refractionTexture.renderList.push(enemy);
	waterMaterial.reflectionTexture.renderList.push(ground);
	waterMaterial.reflectionTexture.renderList.push(skybox);
	water.material = waterMaterial;
	//========================================================================================
		
	// INTERACTION ===========================================================================
	enemy.actionManager = new BABYLON.ActionManager(scene);
	var trigger = {
		
			trigger : BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter : golem
        };
	var action = new BABYLON.SwitchBooleanAction(trigger, golem, 'dead');
	enemy.actionManager.registerAction(action);
	//========================================================================================
	
	
	var CameraFollowActor = function(){
		golem.rotation.y =  -4.69 - camera[0].alpha;
		camera[0].target.x = parseFloat(golem.position.x);
		camera[0].target.z = parseFloat(golem.position.z);
	};

    engine.runRenderLoop(function(){
        scene.render();
		if(scene.isReady && golem){
			CameraFollowActor();
            golem.move();
		}
    });
	
    executeAsync(golem , enemy, ground);

    window.addEventListener('resize', function(){
        engine.resize();
    });
};
