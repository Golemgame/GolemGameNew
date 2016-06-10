/* global BABYLON, WaterMaterial */
MapGenerator = function (scene, tiles, tileSize) {
    this.readyGrounds = 0;
    this.sideLength = tiles*tileSize;
    var materialNames = ["Rock","Sand","Snow","Grass"];
    this.materials = [];
    for(var i=0; i<4; i++){
        var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        var matName = "asset/"+materialNames[i]+".png";
        groundMaterial.diffuseTexture = new BABYLON.Texture(matName, scene);
        groundMaterial.diffuseTexture.uScale = this.randomNumber(1, 10);
        groundMaterial.diffuseTexture.vScale = this.randomNumber(1, 10);
        this.materials.push(groundMaterial);
    }

    this.map = [];
    var rotation = [0, Math.PI*0.5, Math.PI, Math.PI*1.5];	//(Math.PI/2)*(0 to 3)
    for (var x = 0; x < tiles; x++) {
        var rows = [];
        for (var y = 0; y < tiles; y++) {
            var image = "asset/heightmaps/" + this.randomNumber(0, 11) + ".png";
            var h = this.randomNumber(5, 37);
            var g = BABYLON.Mesh.CreateGroundFromHeightMap("ground", image, tileSize, tileSize, tileSize*0.33, 0.1, h, scene, false);
            g.backFaceCulling = false;
            g.rotation = new BABYLON.Vector3(0, rotation[this.randomNumber(0, rotation.length - 1)], 0);	//choose a random rotation from 0°, 90° 180° and 270°
            g.checkCollisions = true;
            g.position = this.givePosition(tiles, x, y);
            //g.material = materials[randomNumber(0,materials.length-1)];
            g.material = this.materials[1];
            g.receiveShadows = true;
            var that = this;
            g.onReady = function(){
                that.readyGrounds++;
                console.log("checking");
                if(that.isReady()){
                    that.onReady();
                    console.log("ground is ready !");
                }
            };
            rows.push(g);
            //map[x][y] = g;
        }
        this.map.push(rows);
    }
};

MapGenerator.prototype.givePosition = function (size, x, y) {
    var pX, pZ;
    if (size % 2 === 1) {			//odd
        pX = (x - Math.floor(size / 2)) * 100;
        pZ = (Math.floor(size / 2) - y) * 100;
        //  y refers to the position in the matrix but it affect
        //  the ground's Z-position in space, hence the name pZ
    } else if (size % 2 === 0) {	//even
        pX = (x - ((size / 2) - 0.5)) * 100;
        pZ = (((size / 2) - 0.5) - y) * 100;
    }
    return new BABYLON.Vector3(pX, 0, pZ);
};

MapGenerator.prototype.randomNumber = function (min, max) {
    if (min === max) {
        return min;
    } else {
        return Math.floor(min + ((max - min) * Math.random()));
    }
};

MapGenerator.prototype.isReady = function (){
    console.log(this.readyGrounds + "=" + Math.pow(this.map.length,2) + "?");
    console.log(this.readyGrounds === Math.pow(this.map.length,2));
    return (this.readyGrounds === Math.pow(this.map.length,2));
};

MapGenerator.prototype.unsortedMap = function(){
    var unsMap = [];
    for(var x=0; x<this.map.length; x++){
        var rows = this.map[x];
        for(var y=0; y<this.map.length; y++){
            unsMap.push(rows[y]);
        }
    }
    return unsMap;
};

MapGenerator.prototype.onReady = function (){};