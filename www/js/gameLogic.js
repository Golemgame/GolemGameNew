function executeAsync(obj1, obj2, ground) {
    setInterval(function(){
		var h = ground.getHeightAtCoordinates(obj2.position.x, obj2.position.z);
		
		//flee(obj2, obj1, h, 5);
		//follow(obj2, obj1, h, 3);
		chase(obj2, obj1, h, 20, 3);
        
    }, 200);
}

function flee(obj1, obj2, h, radius){
	var distance = BABYLON.Vector3.Distance(obj1.position, obj2.position);
	if(distance < radius){
		var diffX=parseFloat(obj1.position.x - obj2.position.x);
		var diffY=parseFloat(h - obj1.position.y);
		var diffZ=parseFloat(obj1.position.z - obj2.position.z);
		obj1.moveWithCollisions(new BABYLON.Vector3(diffX, diffY, diffZ).normalize());
    }
}	//allontana obj1 da obj2, collisions aware

function follow(obj1, obj2, h, radius){
	var distance = BABYLON.Vector3.Distance(obj1.position, obj2.position);
	if(distance > radius){
		var diffX=parseFloat(obj1.position.x - obj2.position.x);
		var diffY=parseFloat(h - obj1.position.y);
    	var diffZ=parseFloat(obj1.position.z - obj2.position.z);
    	obj1.moveWithCollisions(new BABYLON.Vector3(diffX, -diffY, diffZ).normalize().negate());
	}
	
}	//avvicina obj1 a obj2, collisions aware

function chase(obj1, obj2, h, radMAX, radMIN){
	var distance = BABYLON.Vector3.Distance(obj1.position, obj2.position);
	if (distance <= radMIN){
		return
	}
	if(distance < radMAX){
		var diffX=parseFloat(obj1.position.x - obj2.position.x);
		var diffY=parseFloat(h - obj1.position.y);
    	var diffZ=parseFloat(obj1.position.z - obj2.position.z);
    	obj1.moveWithCollisions(new BABYLON.Vector3(diffX, -diffY, diffZ).normalize().negate());
	}
}