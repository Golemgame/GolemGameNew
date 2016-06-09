/* global BABYLON, WaterMaterial */
function mapGen(scene, size) {
    var rockM = new BABYLON.StandardMaterial("rock", scene),
            sandM = new BABYLON.StandardMaterial("sand", scene),
            snowM = new BABYLON.StandardMaterial("snow", scene),
            grassM = new BABYLON.StandardMaterial("snow", scene);
    rockM.diffuseTexture = new BABYLON.Texture("asset/Rock.png", scene);
    rockM.diffuseTexture.uScale = randomNumber(1, 10);
    rockM.diffuseTexture.vScale = randomNumber(1, 10);
    sandM.diffuseTexture = new BABYLON.Texture("asset/Sand.png", scene);
    sandM.diffuseTexture.uScale = randomNumber(1, 10);
    sandM.diffuseTexture.vScale = randomNumber(1, 10);
    snowM.diffuseTexture = new BABYLON.Texture("asset/Snow.png", scene);
    snowM.diffuseTexture.uScale = randomNumber(1, 10);
    snowM.diffuseTexture.vScale = randomNumber(1, 10);
    grassM.diffuseTexture = new BABYLON.Texture("asset/Grass.png", scene);
    grassM.diffuseTexture.uScale = randomNumber(1, 10);
    grassM.diffuseTexture.vScale = randomNumber(1, 10);

    var materials = [];
    materials.push(rockM);
    materials.push(sandM);
    materials.push(snowM);
    materials.push(grassM);

    var map = [];
    //var images = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
    var rotation = [Math.PI, Math.PI / 2, Math.PI * 1.5, 0];	//(Math.PI/2)*(0 to 3)

    for (var x = 0; x < size; x++) {
        var rows = [];
        for (var y = 0; y < size; y++) {
            var image = "asset/heightmaps/" + randomNumber(0, 11) + ".png";
            var h = randomNumber(5, 37);
            var g = BABYLON.Mesh.CreateGroundFromHeightMap("ground", image, 100, 100, 30, -1, h, scene, false);
            g.rotation = new BABYLON.Vector3(0, rotation[randomNumber(0, rotation.length - 1)], 0);	//choose a random rotation from 0°, 90° 180° and 270°
            g.checkCollisions = true;
            g.position = givePosition(size, x, y);
            //g.material = materials[randomNumber(0,materials.length-1)];
            g.material = materials[1];
            rows.push(g);
            //map[x][y] = g;
        }
        map.push(rows);
    }
    return map;
}

function givePosition(size, x, y) {
    var pX, pZ;
    if (size % 2 === 1) {			//odd
        pX = (x - Math.floor(size / 2)) * 100;
        pZ = (Math.floor(size / 2) - y) * 100;
        /*y refers to the position in the matrix but it affect
         the ground's Z-position in space, hence the name pZ */
    } else if (size % 2 === 0) {	//even
        pX = (x - ((size / 2) - 0.5)) * 100;
        pZ = (((size / 2) - 0.5) - y) * 100;
    }
    return new BABYLON.Vector3(pX, 0, pZ);
}

function randomNumber(min, max) {
    if (min === max) {
        return min;
    } else {
        return Math.floor(min + ((max - min) * Math.random()));
    }
}