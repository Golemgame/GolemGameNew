var initScene = function(scene){
    
//SCENE ==================================================================================
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
}