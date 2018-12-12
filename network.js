class Node {
    //id, x, y;
    constructor(id, _x, _y) {
        this.x = _x;
        this.y = _y;
		this.id = id;
    }
}

var EdgeEnum = Object.freeze({"Empty":0, "Resistor":1, "Condensator":2, "Coil":3, "Switch":4, "Lamp":5, "Source":6});

class Edge {
    //Node startNode, endNode
    //Type: Empty, Resistor, Condensator, Coil, Switch, Lamp
	//Empty: none
    //Resistor: resistance
    //Condensator: capacity
    //Coil: inductance
	//Lamp: resistance, power
    //Switch: open
	//Source: voltage, frequency
    constructor(id, sNode, eNode, t, param, param2) {
		this.id = id;
        this.startPoint = sNode;
        this.endPoint = eNode;
        this.type = t;
		this.power = 60;
		this.resistance = 1000;
		this.capacity = 1;
		this.inductance = 100;
		this.state = true;
		this.voltage = 220;
		this.frequency = 0;
		this.smallerIdPlus = (sNode.id > eNode.id ? true : false);
        if(typeof param != 'undefined')
			switch (t) {
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
					break;
				case 6: //Source
					this.voltage = param;
			}
		if(typeof param2 != 'undefined')
			switch (t) {
				case 5: // Lamp
					this.power = param2;
					break;
				case 6: // Source
					this.frequency = param2;
			}	
    }
	flip(){
		let tNode = this.startPoint;
		this.startPoint = this.endPoint;
		this.endPoint = tNode;
	}
}

class Network {
    constructor() {
        this.nodes = [];
        this.edges = [];
		this.globalNodeID = 0;
		this.globalEdgeID = 0;
	}

    addNode(_x, _y) {
        this.nodes.push(new Node(this.globalNodeID, _x, _y));
		updateAddNewElementDroplists(this.globalNodeID);
		this.globalNodeID++;
    }

    addEdge(sNodeId, eNodeId, t, param, param2) {
		let sNode, eNode, node;
		for(let i = 0; i < this.nodes.length; i++){
			if(this.nodes[i].id == sNodeId)
				sNode = this.nodes[i];
			if(this.nodes[i].id == eNodeId)
				eNode = this.nodes[i];
		}
        let addedEdge = new Edge(this.globalEdgeID++, sNode, eNode, t, param, param2);
		this.edges.push(addedEdge);
		createLBarElement(addedEdge);
	}
	
	deleteEdge(id){
		for(let i = 0; i < this.edges.length; i++)
			if(this.edges[i].id == id){
				this.edges.splice(i, 1);
				deleteElementFromLBar(id);					
				return;
			}
	}
	
	deleteNode(id){
		for(let i = 0; i < this.edges.length; i++){
			if(this.edges[i].startPoint.id == id || this.edges[i].endPoint.id == id){
				this.deleteEdge(this.edges[i].id);
				i--;
			}
		}
		
		for(let i = 0; i < this.nodes.length; i++){
			if(this.nodes[i].id == id){
				this.nodes.splice(i, 1);
				return;
			}
		}
	}
}