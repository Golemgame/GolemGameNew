/* global BABYLON, WaterMaterial */
MapGenerator = function (scene, tiles, tileSize) {
    this.tiles = tiles;
    this.tileSize = tileSize;
    this.sideLength = this.tiles*this.tileSize;
    this.readyGrounds = 0;
    this.materials = [];
    var materialNames = ["Rock","Sand","Snow","Grass"];
    this.map = [];
    
    //populate materials[]
    for(var i=0; i<materialNames.length; i++){
        var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        var matName = "asset/"+materialNames[i]+".png";
        groundMaterial.diffuseTexture = new BABYLON.Texture(matName, scene);
        groundMaterial.diffuseTexture.uScale = this.randomNumber(1, 10);
        groundMaterial.diffuseTexture.vScale = this.randomNumber(1, 10);
        this.materials.push(groundMaterial);
    }

    //populate map[]
    var rotation = [0, Math.PI*0.5, Math.PI, Math.PI*1.5];	//[0°, 90°, 180°, 270°]
    for (var x = 0; x < this.tiles; x++) {
        var rows = [];
        for (var y = 0; y < this.tiles; y++) {
            var image = "asset/heightmaps/" + this.randomNumber(0, 11) + ".bmp";
            var h = 13;//this.randomNumber(5, 37);
            var g = BABYLON.Mesh.CreateGroundFromHeightMap("ground", image, this.tileSize, this.tileSize, this.tileSize*0.33, -0.5, h, scene, false);
            g.backFaceCulling = false;
            //g.disableLighting = true;
            g.rotation = new BABYLON.Vector3(0, rotation[this.randomNumber(0, rotation.length - 1)], 0);	//choose a random rotation
            g.checkCollisions = true;
            g.position = this.givePosition(this.tiles, x, y);
            //g.material = materials[randomNumber(0,materials.length-1)];
            g.material = this.materials[3];
            g.receiveShadows = true;
            var that = this;
            g.onReady = function(){
                that.readyGrounds++;
                if(that.isReady()){
                    that.onReady();
                }
            };
            rows.push(g);
        }
        this.map.push(rows);
    }
};

MapGenerator.prototype.givePosition = function (tiles, x, y) {
    var pX, pZ;
    if (tiles % 2 === 1) {		//ODD
        pX = (x - Math.floor(tiles / 2)) * this.tileSize;
        pZ = (Math.floor(tiles / 2) - y) * this.tileSize;
        //  y refers to the position in the matrix but it affect
        //  the ground's Z-position in space, hence the name pZ
    } else if (tiles % 2 === 0) {	//EVEN
        pX = (x - ((tiles / 2) - 0.5)) * this.tileSize;
        pZ = (((tiles / 2) - 0.5) - y) * this.tileSize;
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
    return (this.readyGrounds === Math.pow(this.tiles,2));
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