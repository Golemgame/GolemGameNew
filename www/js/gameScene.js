var canvas;
var engine;
var scene;
var enemy;
var golem;


var startingPoint = function(){
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);

	//Creazione SCENA ========================================================================
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 1, 1);
	scene.collisionsEnabled = true;
	scene.gravity = new BABYLON.Vector3(0, -0.5, 0);
	//========================================================================================
		
		
		
	//Creazione CAMERA =======================================================================
	var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -7), scene);
	camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, false);
	camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
	camera.checkCollisions = true;
	//camera.applyGravity = true;
	//========================================================================================
		
		
		
	//Creazione LUCE =========================================================================
	var sun = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(60, 100, 10), scene);
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
	var extraGround = BABYLON.Mesh.CreateGround("extraGround", 1000, 1000, 1, scene, false);
	var extraGroundMaterial = new BABYLON.StandardMaterial("extraGround", scene);
	extraGroundMaterial.diffuseTexture = new BABYLON.Texture("shader/Ground/Sand.jpg", scene);
	extraGroundMaterial.diffuseTexture.uScale = 60;
	extraGroundMaterial.diffuseTexture.vScale = 60;
	extraGround.position.y = -2.05;
	extraGround.material = extraGroundMaterial;
	extraGround	.checkCollisions = true;
				
	// Shore
	var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "asset/HeightMap.png", 100, 100, 300, 0, 5, scene, false);
	var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
	groundMaterial.diffuseTexture = new BABYLON.Texture("shader/Ground/Rock.jpg", scene);
	groundMaterial.diffuseTexture.uScale = 6;
	groundMaterial.diffuseTexture.vScale = 6;
	groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	ground.position.y = -2.0;
	ground.material = groundMaterial;
	ground.checkCollisions = true;
	//========================================================================================
		
		
	//Creazione ACQUA=========================================================================
	// Sea
	BABYLON.Engine.ShadersRepository = "";
	var water = BABYLON.Mesh.CreateGround("water", 1000, 1000, 1, scene, false);
	var waterMaterial = new WaterMaterial("water", scene, sun);
	waterMaterial.refractionTexture.renderList.push(extraGround);
	waterMaterial.refractionTexture.renderList.push(ground);
	waterMaterial.reflectionTexture.renderList.push(ground);
	waterMaterial.reflectionTexture.renderList.push(skybox);
	water.material = waterMaterial;
	//========================================================================================
		
		
	//Creazione BOSCO ========================================================================
	var spriteManagerTrees;
	ground.onReady = function(){
		ground.optimize(100);
        spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "asset/palm.png", 200, 800, scene);
        var range = 100;     // diametro del "bosco" che vogliamo creare
        var count = 150;     // numero di alberi da replicare
        for (var i = 0; i < count; i++) {
            var tree = new BABYLON.Sprite("tree", spriteManagerTrees);
			tree.size = 6;
            tree.position.x = range / 2 - Math.random() * range;
            tree.position.z = range / 2 - Math.random() * range;
            tree.position.y = ground.getHeightAtCoordinates(tree.position.x, tree.position.z) + 3;
        }
	};
	//========================================================================================
		
		
	//Creazione BORDI ========================================================================
	var border1;
	border1 = BABYLON.Mesh.CreateBox("border0", 1, scene);
	border1.scaling = new BABYLON.Vector3(1, 1000, 1000);
	border1.position.x = -500;
	border1.checkCollisions = true;
	border1.isVisible = false;

	var border2;
	border2 = BABYLON.Mesh.CreateBox("border1", 1, scene);
	border2.scaling = new BABYLON.Vector3(1, 1000, 1000);
	border2.position.x = 500;
	border2.checkCollisions = true;
	border2.isVisible = false;

	var border3;
	border3 = BABYLON.Mesh.CreateBox("border2", 1, scene);
	border3.scaling = new BABYLON.Vector3(1000, 1000, 1);
	border3.position.z = 500;
	border3.checkCollisions = true;
	border3.isVisible = false;

	var border4;
	border4 = BABYLON.Mesh.CreateBox("border3", 1, scene);
	border4.scaling = new BABYLON.Vector3(1000, 1000, 1);
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
	golem = new Golem(2,scene);
	golem.position.y = ground.getHeightAtCoordinates(golem.position.x, golem.position.z) + 2;
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


    engine.runRenderLoop(function(){
        scene.render();
    });
	
    executeAsync(golem, enemy, ground);

    window.addEventListener('resize', function(){
        engine.resize();
    });
};
