let idToVertex = new Map();
let graph;
	
class CalcEdge(){
	// edge, to
	constructor(edge, to){
		this.edge = edge;
		this.to = to;
	}
}
	
function NetworkToGraph(NWork){
	idToVertex.clear();
	for(let i = 0; i < NWork.nodes.length; i++)
		idToVertex.set(NWork.nodes[i].id, i);
	graph.length = idToVertex.size;
	for(let i = 0; i < graph.length; i++)
		graph[i] = [];
	for(edge: NWork.edges){
		let s = idToVertex.get(edge.startPoint.id);
		let t = idToVertex.get(edge.endPoint.id);
		graph[s].push(CalcEdge(edge, t));
		graph[t].push(CalcEdge(edge, s));
	}
}