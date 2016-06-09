/* global BABYLON, scene, ground */
EnemyGenerator = function (difficulty, mapSize) {
    this.diff = difficulty^2 || 1;
    this.ms = mapSize || 100;
    this._enemies = [];
    this.maxSize = difficulty;
    this.quantity = difficulty * mapSize / 2;

    this.generate();
};

EnemyGenerator.prototype.randomNumber = function (min, max) {
    if (min === max) {
        return (min);
    }
    var random = Math.random();
    return Math.floor((random * (max - min)) + min);
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
        enemy.material = materials[this.randomNumber(0, materials.lenght-1)]; //random material
        enemy.position = this.getPosition(this.ms);
        enemy.position.y += enemySize;
        enemy.checkCollisions = true;
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
    var x,y,z;
    var a = this.randomNumber(0, mapSize-21);
    if(a%2===1){x = 20+a;}
    else if(a%2===0){x = -20-a;}
    a = this.randomNumber(0, mapSize-21); //new random number
    if(a%2===1){z = 20+a;}
    else if(a%2===0){z = -20-a;}
    //g = getGround(x,z);
    g = ground;
    y = g.getHeightAtCoordinates(x,z);
    var v3 = new BABYLON.Vector3(x,y,z);
    return v3;
};