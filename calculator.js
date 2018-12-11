let idToVertex = new Map();
let idToEdge = new Map();
let graph;
let Currency;
let tree;
let log = true;
let time;
	
class CalcEdge{
	// edge, from, to, id
	constructor(edge, from, to, id){
		this.edge = edge;
		this.from = from;
		this.to = to;
		this.id = id;
	}
}
	
function NetworkToGraph(NWork){
	idToVertex.clear();
	graph = [];
	for(let i = 0; i < NWork.nodes.length; i++)
		idToVertex.set(NWork.nodes[i].id, i);
	graph.length = idToVertex.size;
	for(let i = 0; i < graph.length; i++)
		graph[i] = [];
	for(let i = 0; i < NWork.edges.length; i++){
		edge = NWork.edges[i];
		idToEdge.set(edge.id, i);
		let s = idToVertex.get(edge.startPoint.id);
		let t = idToVertex.get(edge.endPoint.id);
		graph[s].push(new CalcEdge(edge, s, t, i));
		graph[t].push(new CalcEdge(edge, t, s, i));
	}
}

let vis;
let visedge;
let nonTree;
	
function dfs(v){
	vis[v] = true;
	for(let i = 0; i < graph[v].length; i++){
		edge = graph[v][i];
		if(!vis[edge.to]){
			tree[v].push(edge);
			tree[edge.to].push(new CalcEdge(edge.edge, edge.to, v, edge.id));
			visedge[edge.id] = true;
			dfs(edge.to);
		}
	}
}

function TreeBuild(){
	vis = new Array(graph.length).fill(false);
	visedge = [];
	tree = new Array(graph.length);
	for(let i = 0; i < tree.length; i++)
		tree[i] = [];
	dfs(0);
	nonTree = [];
	for(let i = 0; i < graph.length; i++)
		for(let j = 0; j < graph[i].length; j++){
			edge = graph[i][j];
			if(!visedge[edge.id] && edge.from < edge.to)
				nonTree.push(edge);
		}
}

let Cycle;
let flag;
let Matrix, MatrixRow, Column;

function dfs2(v, t){
	vis[v] = true;
	if(v == t){
		for(let i = 0; i < Cycle.length; i++){
			edge = Cycle[i];
			if(edge.edge.type == EdgeEnum.Source){
				let currentVoltage = edge.edge.voltage * Math.cos(edge.edge.frequency * time);
				if(edge.edge.smallerIdPlus == edge.from < edge.to)
					Column[Column.length - 1] += currentVoltage;
				else
					Column[Column.length - 1] -= currentVoltage;
			}
			else if(edge.edge.type == EdgeEnum.Resistor || edge.edge.type == EdgeEnum.Lamp){
				if(edge.from < edge.to)
					MatrixRow[edge.id] = -edge.edge.resistance;
				else
					MatrixRow[edge.id] = +edge.edge.resistance;	
			}
			else if(edge.edge.type == EdgeEnum.Switch){
				if(edge.edge.state)
					MatrixRow[edge.id] = Infinity;	
				else
					MatrixRow[edge.id] = 0;
			}
		}
		flag = true;
	}
	if(flag)
		return;
	for(let i = 0; i < tree[v].length; i++){
		edge = tree[v][i];
		if(!vis[edge.to]){
			Cycle.push(edge);
			dfs2(edge.to, t);
			Cycle.pop();
		}
	}
}

function GraphToMatrix(){
	Matrix = [];
	Column = [];
	//First Kirchoff's Law
	for(let i = 0; i < graph.length - 1; i++){
		MatrixRow = new Array(network.edges.length).fill(0);
		Column.push(0);
		for(let j = 0; j < graph[i].length; j++){
			let edge = graph[i][j];
			if(edge.to > i)
				MatrixRow[edge.id] = 1;
			else
				MatrixRow[edge.id] = -1;
		}
		Matrix.push(MatrixRow);
	}
	//Second Kirchoff Law
	TreeBuild();
	for(let i = 0; i < nonTree.length; i++){
		vis = new Array(graph.length).fill(false);
		MatrixRow = new Array(network.edges.length).fill(0);
		Cycle = [];// new Array(0);
		flag = false;
		Column.push(0);
		edge = nonTree[i];
		Cycle.push(edge);
		//console.log(edge);
		dfs2(edge.to, edge.from);
		Matrix.push(MatrixRow);
	}
}

function calculate(){
	time = 0;
	let deltaTime = 0.0001;
	NetworkToGraph(network);
	GraphToMatrix();
	for(let i = 0; i < 1; i++){
		Currency = math.lusolve(Matrix, Column);
		time += deltaTime;
	}
}