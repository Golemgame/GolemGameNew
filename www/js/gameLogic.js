/* global BABYLON, ground */

function executeAsync(obj1, obj2) {
    setInterval(function () {
        var g = getGround(obj2.position.x, obj2.position.z);
        var h = g.getHeightAtCoordinates(obj2.position.x, obj2.position.z);

        //flee(obj2, obj1, h, 5);
        //follow(obj2, obj1, h, 3);
        chase(obj2, obj1, h, 30);

    }, 200);
}

function flee(obj1, obj2, h, radius) {
    var distance = BABYLON.Vector3.Distance(obj1.position, obj2.position);
    if (distance < radius) {
        var diffX = parseFloat(obj1.position.x - obj2.position.x);
        var diffY = parseFloat(h - obj1.position.y);
        var diffZ = parseFloat(obj1.position.z - obj2.position.z);
        obj1.moveWithCollisions(new BABYLON.Vector3(diffX, diffY, diffZ).normalize());
    }
}	//allontana obj1 da obj2, collisions aware

function follow(obj1, obj2, h, radius) {
    var distance = BABYLON.Vector3.Distance(obj1.position, obj2.position);
    if (distance > radius) {
        var diffX = parseFloat(obj1.position.x - obj2.position.x);
        var diffY = parseFloat(h - obj1.position.y);
        var diffZ = parseFloat(obj1.position.z - obj2.position.z);
        obj1.moveWithCollisions(new BABYLON.Vector3(diffX, -diffY, diffZ).normalize().negate());
    }

}	//avvicina obj1 a obj2, collisions aware

function chase(obj1, obj2, h, radMAX) {
    var radMIN = 0;
    //var radMIN =    (Math.max(obj1.getBoundingInfo().boundingBox.maximum.x, obj1.getBoundingInfo().boundingBox.maximum.z) +
    //            Math.max(obj2.getBoundingInfo().boundingBox.maximum.x, obj2.getBoundingInfo().boundingBox.maximum.z))*1.9;
    var distance = BABYLON.Vector3.Distance(obj1.position, obj2.position);
    if (distance <= radMIN) {
        return;
    }
    if (distance < radMAX) {
        var diffX = parseFloat(obj1.position.x - obj2.position.x);
        var diffY = parseFloat(h - obj1.position.y);
        var diffZ = parseFloat(obj1.position.z - obj2.position.z);
        obj1.moveWithCollisions(new BABYLON.Vector3(diffX, -diffY, diffZ).normalize().negate().scale(1.5));
    }
}

function getGround(x, z) {
    //var tiles = ground.tiles;
    var tiles = ground.map.length,
            size = ground.tileSize,
            mapX,
            mapY;
    x += tiles / 2 * size;
    x -= signum(x);
    mapX = Math.floor(x / size);

    z -= tiles / 2 * size;
    z -= signum(z);
    mapY = Math.abs(Math.ceil(z / size)); //for negative numbers remember to invert .floor w/ .ceil and vice versa
    /*
     if(tiles%2===0){    //even
     if(x>0){
     mapX = tiles/2+Math.floor(x/100);
     }else if(x<0){
     mapX = tiles/2+Math.floor(x/100)-1;
     }
     if(z>0){
     mapY = tiles/2+Math.floor(z/100);
     }else if(x<0){
     mapY = tiles/2+Math.floor(z/100)-1;
     }
     }else if(tiles%2===1){  //odd
     x += tiles/2*size;
     x -= signum(x);
     mapX = Math.floor(x/size);
     
     z -= tiles/2*size;
     z += signum(z);
     mapY = Math.floor(z/size);
     }
     */
    var row = ground.map[mapX];
    return row[mapY];
}

function signum(n) {
    return (n / Math.abs(n));
}

function randomFloat(min, max) {
    if (min === max) {
        return min;
    } else {
        return (min + ((max - min) * Math.random()));
    }
}

function randomInt(min, max) {
    return Math.floor(randomFloat(min, max));
}