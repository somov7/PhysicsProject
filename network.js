class Node {
    //id, x, y;
    constructor(id, _x, _y) {
        this.x = _x;
        this.y = _y;
		this.id = id;
    }
}


class Edge {
    //Node startNode, endNode
    //Type: Empty, Resistor, Condensator, Coil, Switch, Lamp
	//Empty: length
    //Resistor: resistance
    //Condensator: capacity
    //Coil: inductance
    //Switch: open
	//Source: voltage, frequency, inner resistance
    constructor(id, sNode, eNode, t, param = 0, param2 = 0, param3 = 0) {
		this.id = id;
        this.startPoint = sNode;
        this.endPoint = eNode;
        this.type = t;
        switch (t) {
            case 0: //Empty
				//this.length = param;
                break;
            case 1: //Resistor
            case 5: //Lamp
                this.resistance = param;
                break;
            case 2: //Condensator
                this.capacity = param;
                this.resistance = param2;
				break;
            case 3: //Coil
                this.inductance = param;
                this.resistance = param2;
                break;
            case 4: //Switch
                this.state = param;
				break;
			case 6: 
				this.voltage = param;
				this.frequency = param2;
                this.resistance = param3;
				this.smallerIdPlus = (sNode.id > eNode.id ? true : false); // Чисто костыль
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

    addEdge(sNodeId, eNodeId, t, param = 0) {
		let sNode, eNode, node;
		for(let i = 0; i < this.nodes.length; i++){
			if(this.nodes[i].id == sNodeId)
				sNode = this.nodes[i];
			if(this.nodes[i].id == eNodeId)
				eNode = this.nodes[i];
		}
        let addedEdge = new Edge(this.globalEdgeID++, sNode, eNode, t, param);
		this.edges.push(addedEdge);
		createLBarElement(addedEdge);
	}
	
	deleteEdge(edge){
		for(let i = 0; i < this.edges.length; i++)
			if(this.edges[i].id == edge.id){
				this.edges.splice(i, 1);
				deleteElementFromLBar(edge.id);					
				return;
			}
	}
}



