TreeGenerator = function(ground, sg) {
    this.treeNumber = 70;
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

    

    var size,
        sizeTrunk, x, z, radius;

    for (var i = 0; i<this.treeNumber; i++) {
        size = this.randomNumber(this.minSizeBranch,this.maxSizeBranch);
        sizeTrunk = this.randomNumber(this.minSizeTrunk,this.maxSizeTrunk);
        radius = this.randomNumber(this.minRadius,this.maxRadius);

        var tree = new Tree(size, sizeTrunk, radius, scene, this.sg);
		this.checkHeight(tree, ground, sizeTrunk);
        this._trees.push(tree);
    }
};

TreeGenerator.prototype.clean = function() {
    this._trees.forEach(function(t) {
        t.dispose();
    });

    this._trees = [];
};

TreeGenerator.prototype.checkHeight = function(tree, ground, sT) {
	do{
			tree.position.x = this.randomNumber(-130, 130);
			tree.position.z = this.randomNumber(-130, 130);
			tree.position.y = ground.getHeightAtCoordinates(tree.position.x, tree.position.z);
	}while(tree.position.y<0);
	tree.position.y += sT-0.1;
};

TreeGenerator.prototype.randomNumber = function(min, max){
    if (min == max) {
    	return (min);
    }
    var random = Math.random();
	return ((random * (max - min)) + min);
};