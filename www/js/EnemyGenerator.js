/* global BABYLON, scene, ground */
EnemyGenerator = function (difficulty, mapSize) {
    this.diff = difficulty || 1;
    this.mapsize = mapSize || 100;
    this._enemies = [];
    this.maxSize = 7;
    this.quantity = this.diff * this.mapsize * 0.12;

    this.generate();
};

EnemyGenerator.prototype.randomNumber = function (min, max) {
    if (min === max) {return (min);}
    return Math.floor((Math.random() * (max - min)) + min);
};

EnemyGenerator.prototype.generate = function () {

    this.clean();
    
    var materials = [];
    for(var i=0; i<8; i++){
        var material = new BABYLON.StandardMaterial("skin", scene);
        var skinPath = "asset/enemy texture/" + i +".jpg";
        material.diffuseTexture = new BABYLON.Texture(skinPath, scene);
        materials.push(material);
    }
    
    var enemy;
    for(var i=0; i<this.quantity; i++){
        var enemySize = this.randomNumber(1, this.maxSize);
        enemy = BABYLON.Mesh.CreateBox("enemy", enemySize, scene);
        enemy.material = materials[this.randomNumber(0, materials.length-1)]; //random material
        enemy.position = this.getPosition(this.mapsize);
        enemy.position.y += enemySize*0.55;
        enemy.checkCollisions = true;
        enemy.showBoundingBox = true;
        //enemy.ellipsoid = new BABYLON.Vector3(enemySize*0.5,enemySize*0.5,enemySize*0.5);
        enemy.applyGravity = true;
        this._enemies.push(enemy);
    }
    
    
};

EnemyGenerator.prototype.clean = function () {
    this._enemies.forEach(function (t) {
        t.dispose();
    });
    this._enemies = [];
};

EnemyGenerator.prototype.getPosition = function (mapSize){
    var x,y,z,safeRadius = 15;
    var a = this.randomNumber(0, mapSize/2-safeRadius);
    if(a%2===1){x = safeRadius+a;}
    else if(a%2===0){x = -safeRadius-a;}
    a = this.randomNumber(0, mapSize/2-safeRadius); //new random number
    if(a%2===1){z = safeRadius+a;}
    else if(a%2===0){z = -safeRadius-a;}
    g = getGround(x,z);
    //y = ground.getHeightAtCoordinates(x,z);
    y= g.getHeightAtCoordinates(x,z);
    var v3 = new BABYLON.Vector3(x,y,z);
    return v3;
};