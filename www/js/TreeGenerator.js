TreeGenerator = function(ground, sg) {
    this.treeNumber = 10;
    this._trees = [];
    this.scene = ground.getScene();
	
	//dimensioni chioma
    this.minSizeBranch = 5;
    this.maxSizeBranch = 10;
	
	//altezza tronco
    this.minSizeTrunk = 20;
    this.maxSizeTrunk = 35;
	
	//diametro tronco
    this.minRadius = 1;
    this.maxRadius = 5;

    this.sg = sg;	//Shadow Generator

    this.generate();
};

TreeGenerator.prototype.generate = function() {

    this.clean();

    var randomNumber = function (min, max) {
        if (min == max) {
            return (min);
        }
        var random = Math.random();
        return ((random * (max - min)) + min);
    };

    var size,
        sizeTrunk, x, z, radius;

    for (var i = 0; i<this.treeNumber; i++) {
        size = randomNumber(this.minSizeBranch,this.maxSizeBranch);
        sizeTrunk = randomNumber(this.minSizeTrunk,this.maxSizeTrunk);
        radius = randomNumber(this.minRadius,this.maxRadius);
		//area del bosco
        x = randomNumber(-30, 30);
        z = randomNumber(-30, 30);

        var tree = new Tree(size, sizeTrunk, radius, scene, this.sg);
        tree.position.x = x;
        tree.position.z = z;
		tree.position.y = ground.getHeightAtCoordinates(x,z)+sizeTrunk;
        this._trees.push(tree);
		console.log("inserito albero numero: " + i);
    }
};

TreeGenerator.prototype.clean = function() {
    this._trees.forEach(function(t) {
        t.dispose();
    });

    this._trees = [];
};