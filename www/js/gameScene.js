var golem;
var scene;
window.addEventListener('DOMContentLoaded', function(){
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {
        scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0, 1, 1);
        
        camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(2, -2, -10), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, false);
        camera.position = new BABYLON.Vector3(0,5,-10);

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 1;

        box = BABYLON.Mesh.CreateBox("box1", 2, scene);
        box.position.y = 1;
            
        golem = new Golem(2,scene);
        
        //ACTION**********
        box.actionManager = new BABYLON.ActionManager(scene);
        var trigger = {
            trigger : BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter : golem
        };
        var action = new BABYLON.SwitchBooleanAction(trigger, golem, 'dead');
        box.actionManager.registerAction(action);
        //END ACTION**********
        bbb
        var metal = new BABYLON.StandardMaterial("metal", scene);
	    metal.diffuseTexture = new BABYLON.Texture('asset/grunge-metal.jpg', scene);
        box.material = metal;
            
        var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);
        var grass = new BABYLON.StandardMaterial("grass", scene);
	    grass.diffuseTexture = new BABYLON.Texture('asset/grass.jpg', scene);
        ground.material = grass;

        return scene;
    };

    var scene = createScene();

    engine.runRenderLoop(function(){
        scene.render();
    });

    executeAsync(camera,box);

    window.addEventListener('resize', function(){
        engine.resize();
    });
});
