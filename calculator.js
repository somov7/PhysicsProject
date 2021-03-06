let idToVertex = new Map();
let idToEdge = new Map();
let graph;
let Current;
let prevCurrent;
let Voltage;
let voltages;
let tree;
let log = true;
let time, deltaTime;
let dynamic;
let errNetwork;
let limit;
let allEdges;

class CalcEdge{
	// edge, from, to, id
	constructor(edge, from, to, id){
		this.edge = edge;
		this.from = from;
		this.to = to;
		this.id = id;
		this.voltage = 0; // capacitor only, for calc purposes
		this.lastCurrent = 0;
	}
}
	
function NetworkToGraph(){
	idToVertex.clear();
	graph = [];
	allEdges = [];
	freqs = 0;
	if(network.nodes.length == 0)
		return;
	for(let i = 0; i < network.nodes.length; i++)
		idToVertex.set(network.nodes[i].id, i);
	graph.length = idToVertex.size;
	for(let i = 0; i < graph.length; i++)
		graph[i] = [];
	voltages = new Array(network.edges.length);
	dynamic = false;
	for(let i = 0; i < network.edges.length; i++){
		edge = network.edges[i];
		voltages[i] = [];
		idToEdge.set(edge.id, i);
		if((edge.type == EdgeEnum.Source && edge.frequency > 0) || edge.type == EdgeEnum.Coil || edge.type == EdgeEnum.Condensator){
			dynamic = true;
		}
		let s = idToVertex.get(edge.startPoint.id);
		let t = idToVertex.get(edge.endPoint.id);
		graph[s].push(new CalcEdge(edge, s, t, i));
		graph[t].push(new CalcEdge(edge, t, s, i));
		allEdges.push(new CalcEdge(edge, s, t, i));
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

function dfsCheck(v){
	vis[v] = true;
	for(let i = 0; i < graph[v].length; i++){
		edge = graph[v][i];
		if(!vis[edge.to])
			dfsCheck(edge.to);
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
let Matrix, NumMatrix, MatrixRow, Column;

function dfs2(v, t){
	vis[v] = true;
	if(v == t){
		for(let i = 0; i < Cycle.length; i++){
			edge = Cycle[i];
			if(edge.edge.type == EdgeEnum.Source){
				/*let currentVoltage = edge.edge.voltage * Math.cos(edge.edge.frequency * time);
				if(edge.edge.smallerIdPlus == edge.from < edge.to)
					Column[Column.length - 1] += currentVoltage;
				else
					Column[Column.length - 1] -= currentVoltage;
				*/
				voltages[Matrix.length].push(edge);
			}
			else if(edge.edge.type == EdgeEnum.Resistor || edge.edge.type == EdgeEnum.Lamp){
				if(edge.from < edge.to)
					MatrixRow[edge.id] = -edge.edge.resistance;
				else
					MatrixRow[edge.id] = +edge.edge.resistance;	
			}
			else if(edge.edge.type == EdgeEnum.Switch){
				if(!edge.edge.state)
					MatrixRow[edge.id] = Infinity;	
				else
					MatrixRow[edge.id] = 0;
			}
			else if(edge.edge.type == EdgeEnum.Coil){
				if(edge.from < edge.to){
					MatrixRow[edge.id] = -edge.edge.inductance * 1e-6 / deltaTime;
					voltages[Matrix.length].push(edge);
				}
				else{
					MatrixRow[edge.id] = edge.edge.inductance * 1e-6 / deltaTime;
					voltages[Matrix.length].push(edge);
				}
			}
			else if(edge.edge.type == EdgeEnum.Condensator){
				if(edge.from < edge.to){
					MatrixRow[edge.id] = -1e9 * 0.5 * deltaTime / edge.edge.capacity;
					voltages[Matrix.length].push(edge);
				}
				else{
					MatrixRow[edge.id] = 1e9 * 0.5 * deltaTime / edge.edge.capacity;
					voltages[Matrix.length].push(edge);
				}
				
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
	//First Kirchoff's Law
	for(let i = 0; i < graph.length - 1; i++){
		MatrixRow = new Array(network.edges.length).fill(0);
		for(let j = 0; j < graph[i].length; j++){
			let edge = graph[i][j];
			if(i > edge.to)
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
		edge = nonTree[i];
		Cycle.push(edge);
		dfs2(edge.to, edge.from);
		Matrix.push(MatrixRow);
	}
}

function generateColumn(){
	Column = new Array(Matrix.length).fill(0);
	for(let i = 0; i < voltages.length; i++){
		for(let j = 0; j < voltages[i].length; j++){
			let edge = voltages[i][j];
			if(edge.edge.type == EdgeEnum.Source){
				let curVoltage = edge.edge.voltage * Math.cos(edge.edge.frequency * time);
				if((edge.from < edge.to) == edge.edge.smallerIdPlus)
					 curVoltage *= -1;
				Column[i] += curVoltage;
			}
			else if(edge.edge.type == EdgeEnum.Coil){
				if(edge.from < edge.to)
					Column[i] -= edge.edge.inductance * 1e-6 * Current[edge.id] / deltaTime;
				else
					Column[i] += edge.edge.inductance * 1e-6 * Current[edge.id] / deltaTime;
			}
			else if(edge.edge.type == EdgeEnum.Condensator){
				if(edge.from < edge.to)
					edge.voltage += Current[edge.id] * deltaTime * 1e9 * 0.5 / edge.edge.capacity;
				else
					edge.voltage -=	Current[edge.id] * deltaTime * 1e9 * 0.5 / edge.edge.capacity;		
				Column[i] = edge.voltage;
			}
		}
	}
}

function updateVoltages(){
	for(let i = 0; i < allEdges.length; i++){
		let edge = allEdges[i];
		if(edge.edge.type == EdgeEnum.Source){
			if((edge.from < edge.to) != edge.edge.smallerIdPlus)
				Voltage[i] = edge.edge.voltage * Math.cos(edge.edge.frequency * time);
			else
				Voltage[i] = -edge.edge.voltage * Math.cos(edge.edge.frequency * time);
		}
		else if(edge.edge.type == EdgeEnum.Resistor || edge.edge.type == EdgeEnum.Lamp){
			if(edge.from < edge.to)
				Voltage[i] = -Current[i] * edge.edge.resistance;
			else
				Voltage[i] = Current[i] * edge.edge.resistance;
		}
		else if(edge.edge.type == EdgeEnum.Condensator){
			if(edge.from < edge.to)
				Voltage[i] -= (Current[i] + prevCurrent[i]) * deltaTime * 1e9 * -0.5 / edge.edge.capacity;
			else 
				Voltage[i] += (Current[i] + prevCurrent[i]) * deltaTime * 1e9 * -0.5 / edge.edge.capacity;
			console.log(prevCurrent[i]);
		}
		else if(edge.edge.type == EdgeEnum.Coil){
			if(edge.from < edge.to)
				Voltage[i] = -edge.edge.inductance * 1e-6 * (Current[i] - prevCurrent[i]) / deltaTime;
			else
				Voltage[i] = edge.edge.inductance * 1e-6 * (Current[i] - prevCurrent[i]) / deltaTime;
		}	
	}
}

function checkGraph(){
	if(graph.length == 0){
		errNetwork = "Ошибка - нет электрической цепи";
		return false;
	}
	vis = new Array(graph.length).fill(false);
	dfsCheck(0);
	for(let i = 0; i < vis.length; i++)
		if(!vis[i]){
			errNetwork = "Ошибка - электрическая цепь разъединена";
			return false;
		}
	return true;
}

function calculate(){
	time = 0;
	errNetwork = "";
	NetworkToGraph();
	if(!checkGraph())
		return;
	GraphToMatrix();
	Current = new Array(graph.length).fill(0);
	prevCurrent = new Array(graph.length).fill(0);
	Voltage = new Array(graph.length).fill(0);
	if(Matrix.length == 0){
		errNetwork = "Ошибка - нет электрической цепи";
		return;
	}
	if(!dynamic)
		limit = deltaTime = 1;
	else{
		limit = Math.PI * 8;
		deltaTime = 0.00001 * limit;
	}
	watches.forEach(initWatch);
	while(time < limit){
		generateColumn();
		prevCurrent = Current.slice(0);
		try{
			Current = math.lusolve(Matrix, Column);
		}
		catch (err){
			errNetwork = "Ошибка - в цепи возник бесконечный ток";
			return; 
		}
		updateVoltages();
		watches.forEach(updateWatch);
		time += deltaTime;
	}
	watchesActual(true);
	watches.forEach(finalWatch);
	watches.forEach(updateGUI);
}