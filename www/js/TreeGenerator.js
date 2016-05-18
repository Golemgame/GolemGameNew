TreeGenerator = function(ground, sg) {
    this.treeNumber = 20;
    this._trees = [];
    this.scene = ground.getScene();
	
	//dimensioni chioma
    this.minSizeBranch = 3.5;
    this.maxSizeBranch = 5;
	
	//altezza tronco
    this.minSizeTrunk = 7;
    this.maxSizeTrunk = 12;
	
	//diametro tronco
    this.minRadius = 0.5;
    this.maxRadius = 2;

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
        x = randomNumber(-90, 90);
        z = randomNumber(-90, 90);

        var tree = new Tree(size, sizeTrunk, radius, scene, this.sg);
        tree.position.x = x;
        tree.position.z = z;
		tree.position.y = ground.getHeightAtCoordinates(x,z)+sizeTrunk-2;
        this._trees.push(tree);
    }
};

TreeGenerator.prototype.clean = function() {
    this._trees.forEach(function(t) {
        t.dispose();
    });

    this._trees = [];
};