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
    scene = new BABYLON.Scene(engine);

	initScene(scene);
		
	//ENEMY ==================================================================================
	enemy = BABYLON.Mesh.CreateBox("enemy1", 2, scene);
	enemy.position.y = ground.getHeightAtCoordinates(enemy.position.x, enemy.position.z) + 2;
	var metal = new BABYLON.StandardMaterial("metal", scene);
	metal.diffuseTexture = new BABYLON.Texture('asset/grunge-metal.jpg', scene);
	enemy.material = metal;
	enemy.checkCollisions = true;
	enemy.applyGravity = true;
    /*
    enemy = new Enemy(2,scene);
    enemy.position.y = ground.getHeightAtCoordinates(enemy.position.x, enemy.position.z) + 2;*/
	//========================================================================================
		
		
	//GOLEM ==================================================================================
	golem = new Golem(1,scene);
    golem.position.y = ground.getHeightAtCoordinates(golem.position.x, golem.position.z) + 4;
	
    //MiniMap ================================================================================
    mm = miniMap(mm,'miniMap',scene);
		
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
