/* global BABYLON, ground, enemy, enemyMotion, engine, golem */

function moveEnemy(obj1, obj2) {
    var interval = setInterval(function () {
        var g = getGround(obj2.position.x, obj2.position.z);
        var h = g.getHeightAtCoordinates(obj2.position.x, obj2.position.z);

        //flee(obj2, obj1, h, 5);
        //follow(obj2, obj1, h, 3);
        chase(obj2, obj1, h, 30);
        checkDead();
    }, 200);
    return interval;
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
    var distance = BABYLON.Vector3.Distance(obj1.position, obj2.position);
    if (distance <= radMIN) {
        return;
    }
    if (distance < radMAX) {
        var diffX = parseFloat(obj1.position.x - obj2.position.x);
        var diffY = parseFloat(obj1.position.y - h);
        var diffZ = parseFloat(obj1.position.z - obj2.position.z);
        obj1.moveWithCollisions(new BABYLON.Vector3(diffX, diffY, diffZ).normalize().negate().scale(1.5));
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
    var row = ground.map[mapX];
    return row[mapY];
}

function checkDead(){
    if(golem.dead){
        stopGame("lose");
    }
}

function stopEnemies(){
    for (var i = 0; i < enemy._enemies.length; i++) {
        enemy._enemies[i].actionManager = null;
        clearInterval(enemyMotion[i]);
    }
}

function stopGame(why){
    stopEnemies();
    engine.stopRenderLoop();
    $("#renderCanvas").css("visibility", "hidden");
    $("#clock").css("visibility", "hidden");
    $("#gameOver").css("visibility", "visible");
    
    switch (why){
        case "win":
            $("#gameOver").addClass("win");
            break;
        case "timeOut":
            $("#gameOver").addClass("timeOut");
            break;
        case "lose":
            $("#gameOver").addClass("lose");
            break;
    }
    
    $("#gameOver").addClass("bounceInUp animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
            function () {
                $(this).removeClass("bounceInUp animated");
            });
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