/* global BABYLON */

AbstractGolem = function(scene) {
    BABYLON.Mesh.call(this, "golem", scene);
    this.isVisible = false;
    this._children = [];
};

AbstractGolem.prototype = Object.create(BABYLON.Mesh.prototype);
AbstractGolem.prototype.constructor = AbstractGolem;

/**
 * Compute the world matrix of this game object and all its children
 */
AbstractGolem.prototype.setReady = function() {
    this.computeWorldMatrix(true);
    this._children.forEach(function(child) {
        child.computeWorldMatrix(true);
    });
};

AbstractGolem.prototype.addChildren = function(child) {
    child.parent = this;
    this._children.push(child);
};