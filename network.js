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
    //Resistor: resistance
    //Condensator: capacity
    //Coil: inductance
    //Switch: open
    constructor(id, sNode, eNode, t, param = 0) {
		this.id = id;
        this.startPoint = sNode;
        this.endPoint = eNode;
        this.type = t;
        switch (t) {
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

class Network {
    constructor() {
        this.nodes = [];
        this.edges = [];
		this.globalNodeID = 0;
		this.globalEdgeID = 0;
	}

    addNode(_x, _y) {
        this.nodes.push(new Node(this.globalNodeID++, _x, _y));
    }

    addEdge(sNode, eNode, t, param = 0) {
        let addedEdge = new Edge(this.globalEdgeID++, this.nodes[sNode], this.nodes[eNode], t, param);
		this.edges.push(addedEdge);
		createLBarElement(addedEdge);
	}
}



