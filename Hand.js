
/**
*@constructor
**/
function Hand()
{
	this.palm = new THREE.Mesh(new THREE.CubeGeometry(50,50,50),
		new THREE.MeshBasicMaterial({ color : new THREE.Color(0xFFFFFF) }));
	this.palm.material.color.setRGB(Math.random(), Math.random(), Math.random());
	this.side = null;
	this.fingers = {};
}

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
		scene.remove(this.fingers[fingers]);
	}

	//remove your hand
	scene.remove(this.palm);
};

var fingerD;

Hand.prototype.updateFingers = function(fingerArray)
{
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
		//console.log(posX, posY, posZ);

		this.fingers[fingerId].position = new THREE.Vector3(posX, posZ, posY);
		//console.log("id :: " + fingerId + " :: " + this.fingers[fingerId].position.x + " "  + this.fingers[fingerId].position.y + " " + this.fingers[fingerId].position.z);
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