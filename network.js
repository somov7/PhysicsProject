class Node {
    //number, x, y;
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }
}

<<<<<<< HEAD

=======
>>>>>>> dc80fb5fcb48bfe4e63788e33ac58c4c70f3393f
class Edge {
    //Node startNode, endNode
    //Type: Empty, Resistor, Condensator, Coil, Switch, Lamp
    //Resistor: resistance
    //Condensator: capacity
    //Coil: inductance
    //Switch: open
<<<<<<< HEAD
    constructor(id, sNode, eNode, t, param = 0) {
		this.id = id;
=======
    constructor(sNode, eNode, t, param = 0) {
>>>>>>> dc80fb5fcb48bfe4e63788e33ac58c4c70f3393f
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
<<<<<<< HEAD
		this.globalID = 0;
	}
=======
    }
>>>>>>> dc80fb5fcb48bfe4e63788e33ac58c4c70f3393f

    addNode(_x, _y) {
        this.nodes.push(new Node(_x, _y));
    }

    addEdge(sNode, eNode, t, param = 0) {
<<<<<<< HEAD
        let addedEdge = new Edge(this.globalID++, this.nodes[sNode], this.nodes[eNode], t, param);
		this.edges.push(addedEdge);
		createLBarElement(addedEdge);
	}
=======
        this.edges.push(new Edge(this.nodes[sNode], this.nodes[eNode], t, param));
    }
>>>>>>> dc80fb5fcb48bfe4e63788e33ac58c4c70f3393f
}



