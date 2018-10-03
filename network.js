class Node{
	//number, x, y;
	constructor(_x, _y){
		this.x = _x;
		this.y = _y;
	}
}

class Edge{
	//Node startNode, endNode
	//Type: Empty, Resistor, Condensator, Coil, Switch, Lamp
	//Resistor: resistance
	//Condensator: capacity
	//Coil: inductance
	//Switch: open
	constructor(sNode, eNode, t, param = 0){
		this.startPoint = sNode;
		this.endPoint = eNode;
		this.type = t;
		switch(t){
			case 0: //Empty
				break;
			case 1: //Resistor
			case 5: //Lamp
				this.resistance = param;
				break;
			case 2: //Condensator
				this.capacity = param;
				break;
			case 3: //Coil
				this.inductance = param;
				break;
			case 4: //Switch
				this.state = param; 
		}
	}
}