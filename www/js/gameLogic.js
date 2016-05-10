function executeAsync(obj1, obj2, ground) {
    
    setInterval(function(){
        //Enemy si allontana da Golem =================================================
        var distance = calculateDistance(obj1, obj2);
        var dangerRadius = 4;
        if(distance < dangerRadius){
			var h = ground.getHeightAtCoordinates(enemy.position.x, enemy.position.z);
            moveAway(obj2, obj1, h);
        }
		//=============================================================================
		
    }, 300);
}

function calculateDistance(obj1, obj2){
    return Math.sqrt(
                    Math.pow((obj1.position.x - obj2.position.x),2) + 
                    Math.pow((obj1.position.y - obj2.position.y),2) + 
                    Math.pow((obj1.position.z - obj2.position.z),2)); 
}

function moveAway(obj1, obj2, h){
    var diffX=parseFloat(obj1.position.x - obj2.position.x);
	var diffY=parseFloat(h - obj1.position.y)
    var diffZ=parseFloat(obj1.position.z - obj2.position.z);
    obj1.moveWithCollisions(new BABYLON.Vector3(diffX, diffY, diffZ).normalize());
}