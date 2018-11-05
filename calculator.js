let idToVertex = new Map();
let graph;
	
class CalcEdge(){
	constructor(to_, active_, reactive_){
		this.to = to_;
		this.active = active_;
		this.reactive = reactive_;
		this.current = 0;
	}
	impedance(){
		return Math.sqrt(Math.pow(this.active_, 2) + Math.pow(this.reactive_, 2));
	}	
	update(reactive_){
		this.reactive = reactive_;
	}
}
	
function NetworkToGraph(NWork){
	idToVertex.clear();
	for(let i = 0; i < NWork.nodes.length; i++)
		idToVertex.set(NWork.nodes[i].id, i);
	/*graph.length = idToVertex.size;
	for(edge: NWork.edges){
		graph[]
	}*/

}