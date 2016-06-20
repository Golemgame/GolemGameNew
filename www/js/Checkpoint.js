/* global BABYLON, ground, golem, scene */
Checkpoint = function(time, countdown){
    this.time = time | 180;
    this.counter = countdown?-1:1;  //if(countdown){this.counter=-1;}else{this.counter=1;}
    this.status = "stop";
    this.position = new BABYLON.Vector3(13,13,13);//this.setPosition(140);
    this.prepareMesh();
};

Checkpoint.prototype.setPosition    = function(radius){
    var     max = ground.sideLength/2,
            pX = randomInt(-max,max),
            min = Math.sqrt(Math.pow(radius,2)-Math.pow(pX,2)),
            range = max-min,
            pZ = randomInt(0,range);
    pZ = pZ%2===1? -max+pZ : max-pZ;   //if(pZ%2===1){pZ = -max+pZ}else{pZ = max-pZ};
    var g = getGround(pX,pZ);
    pY = g.getHeightAtCoordinates(pX,pZ);
    var position = new BABYLON.Vector3(pX,pY,pZ);
    return position;
};

Checkpoint.prototype.prepareMesh    = function(){
    //rings creation
    this.mesh = [
        BABYLON.Mesh.CreateTorus("checkpoint",5,0.45,16,scene),
        BABYLON.Mesh.CreateTorus("checkpoint",6,0.45,16,scene),
        BABYLON.Mesh.CreateTorus("checkpoint",7,0.45,16,scene)
    ];
    this.mesh[1].rotation = new BABYLON.Vector3(Math.PI/2,0,0);
    this.mesh[2].rotation = new BABYLON.Vector3(0,0,Math.PI/2);
    this.mesh[0].position = this.position;
    this.mesh[1].position = this.position;
    this.mesh[2].position = this.position;
    
    //rings coloring
    var cpMaterial = new BABYLON.StandardMaterial("cpMaterial", scene);
    cpMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.45, 0);
    this.mesh[0].material = cpMaterial;
    this.mesh[1].material = cpMaterial;
    this.mesh[2].material = cpMaterial;
    
    //rings animation
    var     animationType = BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            animationLoop = BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE,
            animateRing = [
                new BABYLON.Animation("myAnimation", "rotation.x", 30, animationType, animationLoop ),
                new BABYLON.Animation("myAnimation", "rotation.y", 30, animationType, animationLoop ),
                new BABYLON.Animation("myAnimation", "rotation.z", 30, animationType, animationLoop )
            ],
            keys = [{frame: 0, value: 0.1}, {frame: 1, value: 0.2}];
    animateRing[0].setKeys(keys);
    animateRing[1].setKeys(keys);
    animateRing[2].setKeys(keys);
    this.mesh[0].animations.push(animateRing[0]);
    this.mesh[1].animations.push(animateRing[1]);
    this.mesh[2].animations.push(animateRing[2]);
    scene.beginAnimation(this.mesh[0], 0, 1, true);
    scene.beginAnimation(this.mesh[1], 0, 1, true);
    scene.beginAnimation(this.mesh[2], 0, 1, true);
};

Checkpoint.prototype.startCount     = function(){
    if (this.status === "counting"){
        return;
    }else if(this.status === "stop"){
        this.status = "counting";
        this.counter = setInterval(function() {
            this.time += this.counter;
            if (this.time === 0){
                this.stopCount();
                this.timeOut();
            }
        }, 1000);
    }
};

Checkpoint.prototype.stopCount      = function(){
    if (this.status === "stop"){
        return;
    }else if(this.status === "counting"){
        this.status = "stop";
        clearInterval(this.counter);
    }
};

Checkpoint.prototype.checkWin       = function(){
    var distance = BABYLON.Vector3.Distance(golem.position,this.position);
    if(distance<=5){
        this.stopCount();
        var timeLeft = this.time;
        console.log("HAI VINTO !");
        //you win !
        return true;
    }
    return false;
};

Checkpoint.prototype.timeOut        = function(){};