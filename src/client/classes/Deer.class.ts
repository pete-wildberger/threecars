// chest
function CustomSinCurve(scale) {
	THREE.Curve.call(this);

	this.scale = scale === undefined ? 1 : scale;
}

CustomSinCurve.prototype = Object.create(THREE.Curve.prototype);
CustomSinCurve.prototype.constructor = CustomSinCurve;

CustomSinCurve.prototype.getPoint = function(t) {
	var tx = t * t;
	var ty = Math.sin((Math.PI / 2) * t);
	var tz = 0;

	return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
};

var path = new CustomSinCurve(1);
var geometry = new THREE.TubeGeometry(path, 20, 1, 8, false);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var mesh = new THREE.Mesh(geometry, material);
