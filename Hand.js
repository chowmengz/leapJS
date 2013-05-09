
/**
*@constructor
**/
function Hand(scene)
{
	this.palm = new THREE.Mesh(new THREE.CubeGeometry(50,50,50),
		new THREE.MeshBasicMaterial({ color : new THREE.Color(0xFFFFFF) }));
	this.palm.material.color.setRGB(Math.random(), Math.random(), Math.random());
	this.palmNormal = new THREE.Vector3();
	this.side = null;
	this.fingers = {};
	this.palmRay = null;
	this.scene = scene;
	this.createRay();
	this.rotationProgress = 0.0;
	this.currentDirection = null;
	this.rayCaster = new THREE.Raycaster();
}

Hand.prototype.createRay = function()
{
	var palmProjection =  this.palmNormal.clone();
	  var material = new THREE.LineBasicMaterial({
        color: 0xFFFFFF
    });
      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(0,0,0));
      geometry.vertices.push(new THREE.Vector3(0,0,0));
      this.palmRay = new THREE.Line(geometry, material);
      //this.palmRay.rotation = new THREE.Vector3(45*Math.PI/180,0,0);
      this.scene.add(this.palmRay);
      

};

Hand.prototype.update = function(camera)
{
	var matrix = camera.matrix;
	//multiplies palm position by camera rotation matrix

	this.palm.position = matrix.multiplyVector3(this.palm.position);

	for(finger in this.fingers)
	{
		this.fingers[finger].position = matrix.multiplyVector3(this.fingers[finger].position);
	}

	//rotate raycaster
	

	//this.rayCaster.ray.direction = matrix.multiplyVector3(this.rayCaster.ray.direction);
	
	var vertices = this.palmRay.geometry.vertices;
	//vertices[0] = matrix.multiplyVector3(vertices[0]);
	//vertices[1] = matrix.multiplyVector3(vertices[1]);


};
var dg;
var sub;

Hand.prototype.updateRay = function(camera)
{
	
	var geo = this.palmRay.geometry;
	
	
	//var projection = new THREE.Vector3(projection2.x, -projection2.z, projection2.y);
	var addition = this.palm.position.clone();
	
	//geo.vertices[0] = this.palm.position;

	//addition.addSelf(projection.multiplyScalar(100));
	//geo.vertices[1] = THREE.Vector3(addition.x, addition.y, addition.z);
	
	
	
	if(this.currentDirection != null)
	{
		this.currentDirection = camera.matrix.multiplyVector3(this.currentDirection);
		var normalized = this.currentDirection.clone().normalize();
		var subtracted = this.currentDirection.clone().subSelf(this.palm.position);
		//subtracted = camera.matrix.multiplyVector3(subtracted);
		this.rayCaster.set(this.palm.position, subtracted.normalize());

		geo.vertices[0] = this.rayCaster.ray.origin;
		
		geo.vertices[1] = this.rayCaster.ray.origin.clone().addSelf(this.rayCaster.ray.direction.clone().multiplyScalar(1000));
	}	
	geo.verticesNeedUpdate = true;
};


Hand.prototype.checkCollisions = function(collidablesList)
{
	var collisionResults = this.rayCaster.intersectObjects( collidablesList );
	if(collisionResults.length > 0)
	{
		for(collidable in collisionResults)
		{
			//dg = collisionResults[collidable];
			collisionResults[collidable].object.material.color.setRGB(0,1,1);
		}
		//console.log("collided with a cube somewhere");
	}
};

Hand.prototype.setSide = function(side)
{
	this.side = side;
	//set to right side
	if(side == 1)
	{
		this.palm.material.color.setRGB(1, 0, 0);
	}
	if(side == 0)
	{
		this.palm.material.color.setRGB(0, 1, 0);
	}
};
/**
* Things to do when hand is removed from scene
**/
Hand.prototype.onRemove = function()
{

	//remove your fingers
	for(fingers in this.fingers)
	{
		this.scene.remove(this.fingers[fingers]);
	}

	//remove your hand
	this.scene.remove(this.palm);
	this.scene.remove(this.palmRay);
};

var fingerD;

Hand.prototype.updateFingers = function(fingerArray)
{
	var currentLongestMagntitude = -1;
	this.currentDirection = null;
	var currentFinger = null;
	for(fingerId in fingerArray)
	{
		var finger = new THREE.Mesh(new THREE.CubeGeometry(10,20,10),
			new THREE.MeshBasicMaterial({ color : new THREE.Color(0xFFFFFF) }));
		finger.material.color.setRGB(Math.random(), Math.random(), Math.random());
		if(this.fingers[fingerId] == undefined)
		{
			this.fingers[fingerId] = finger;
			scene.add(this.fingers[fingerId]);
		}
		var pointable = fingerArray[fingerId];
		var posX = (pointable.tipPosition[0]*3);
		var posY = (pointable.tipPosition[2]*3)-200;
		var posZ = (pointable.tipPosition[1]*3)-400;
		var dirX = -(pointable.direction[1]*90);
		var dirY = -(pointable.direction[2]*90);
		var dirZ = (pointable.direction[0]*90);

		var tempMag = Math.sqrt(Math.pow(this.palm.position.x - posX, 2) + Math.pow(this.palm.position.y - posY, 2) + Math.pow(this.palm.position.z - posZ, 2));
		if(tempMag > currentLongestMagntitude)
		{
			currentFinger = this.fingers[fingerId];
			//this.currentDirection = new THREE.Vector3(dirX, dirY, dirZ);
			this.currentDirection = new THREE.Vector3(posX, posZ, posY);
			currentLongestMagntitude = tempMag;
		}
		//console.log(posX, posY, posZ);

		this.fingers[fingerId].position = new THREE.Vector3(posX, posZ, posY);
		//console.log("id :: " + fingerId + " :: " + this.fingers[fingerId].position.x + " "  + this.fingers[fingerId].position.y + " " + this.fingers[fingerId].position.z);
	}

	if(Object.keys(this.fingers).length > 0 && currentFinger != null)
	{
		currentFinger.material.color.setRGB(1,1,1);
	}

	for(fingerId in this.fingers)
	{
		if(fingerArray[fingerId] == undefined)
		{
			scene.remove(this.fingers[fingerId]);
			delete this.fingers[fingerId];
		}
	}

};