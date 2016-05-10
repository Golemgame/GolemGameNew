function executeAsync(camera, box) {
    var wait = 500;
    setInterval(function(){
        //Calculate distance
        var d = calculateDistance(camera, box);
        var dangerRadius = 8;
        if(d < dangerRadius){
            box.position.x++;
        }
    }, wait);
}
aaa
function calculateDistance(obj1, obj2){
    return Math.sqrt(
                    Math.pow((obj1.position.x - obj2.position.x),2) + 
                    Math.pow((obj1.position.y - obj2.position.y),2) + 
                    Math.pow((obj1.position.z - obj2.position.z),2)); 
}