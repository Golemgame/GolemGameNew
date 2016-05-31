var canvas;
var engine;
var scene;
var camera = [];
var enemy;
var golem;
var ground;
var mm;


var startingPoint = function(){
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);

	//SCENE ==================================================================================
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 1, 1);
	scene.collisionsEnabled = true;
	scene.gravity = new BABYLON.Vector3(0, -0.5, 0);
	scene.attachControl();
	//========================================================================================
		
	//CAMERA =================================================================================
    camera[0] = new BABYLON.ArcRotateCamera("CameraBaseRotate", -Math.PI/2, Math.PI/2.2, 12, new BABYLON.Vector3(0, 4.8, 0), scene);
	//velocità zoom
	camera[0].wheelPrecision = 15;	
	// distanza min +zoom
	camera[0].lowerRadiusLimit = 0.0001;
	// distanza max -zoom
	camera[0].upperRadiusLimit = 22;
	scene.activeCameras = camera;
	camera[0].attachControl(canvas);
	//========================================================================================	
    
	//LIGHT ==================================================================================
	var sun = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(60, 100, 10), scene);
	var d1 = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, -1, -2), scene);
	d1.position = new BABYLON.Vector3(-300,300,600);
	var shadowGenerator = new BABYLON.ShadowGenerator(2048, d1);
	var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light1.intensity = 1;
	//========================================================================================
		
	//SKYBOX =================================================================================
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
    skybox.layerMask = 2;
	//========================================================================================
		
		
	//GROUND =================================================================================
	// Seafloor
	var extraGround = BABYLON.Mesh.CreateGround("extraGround", 300, 300, 1, scene, false);
	var extraGroundMaterial = new BABYLON.StandardMaterial("extraGround", scene);
	extraGroundMaterial.diffuseTexture = new BABYLON.Texture("shader/Ground/Sand.jpg", scene);
	extraGroundMaterial.diffuseTexture.uScale = 60;
	extraGroundMaterial.diffuseTexture.vScale = 60;
	extraGround.position.y = -1.05;
	extraGround.material = extraGroundMaterial;
	extraGround.checkCollisions = true;
				
	// Shore
	ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "asset/HeightMap.png", 100, 100, 40, 0, 6, scene, false);
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
	
		
	//WOOD ==================================================================================
	var tg;
	ground.onReady = function(){
		tg = new TreeGenerator(ground, shadowGenerator);
	}
	//========================================================================================
	
		
	//BORDERS ================================================================================
    var borders = [];
    
    for(i = 0; i < 4; i++){
        borders[i] = BABYLON.Mesh.CreateBox("border"+i, 1, scene);
        borders[i].checkCollisions = true;
        borders[i].isVisible = false;
        
        if(i<2){
            borders[i].scaling = new BABYLON.Vector3(1, 300, 300);
        } else {
            borders[i].scaling = new BABYLON.Vector3(300, 300, 1);
        }
    }
    
	borders[0].position.x = -500;
	borders[1].position.x = 500;
	borders[2].position.z = 500;
	borders[3].position.z = -500;
	//========================================================================================
		
		
	//ENEMY ==================================================================================
	enemy = BABYLON.Mesh.CreateBox("enemy1", 2, scene);
	enemy.position.y = ground.getHeightAtCoordinates(enemy.position.x, enemy.position.z) + 2;
	var metal = new BABYLON.StandardMaterial("metal", scene);
	metal.diffuseTexture = new BABYLON.Texture('asset/grunge-metal.jpg', scene);
	enemy.material = metal;
	enemy.checkCollisions = true;
	enemy.applyGravity = true;
	//========================================================================================
		
		
	//GOLEM ==================================================================================
	golem = new Golem(1,ground);
    //========================================================================================
	
    //MiniMap ================================================================================
    mm = new BABYLON.FreeCamera("minimap", new BABYLON.Vector3(0,10,0), scene);
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
    //========================================================================================
    
	//SEA ====================================================================================
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
		
	//INTERACTION ============================================================================
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
    
    var miniMapFollowActor = function(){
		mm.setTarget(golem.position);
        mm.position.x = golem.position.x;
        mm.position.z = golem.position.z;
	};

    engine.runRenderLoop(function(){
        scene.render();
		if(scene.isReady && golem){
			CameraFollowActor();
			miniMapFollowActor();
            golem.move();
		}
    });
	
    executeAsync(golem , enemy, ground);

    window.addEventListener('resize', function(){
        engine.resize();
    });
};
