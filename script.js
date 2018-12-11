let network;

let types = ["Empty", "Resistor", "Condensator", "Coil", "Switch", "Lamp", "Source"];
let typesRu = ["Проводник", "Резистор", "Конденсатор", "Катушка", "Ключ", "Лампа", "Источник ЭДС"];

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function initial(){
	network = new Network();
	let but = document.getElementById("addNewElementButton");
	but.addEventListener('click', function(){
		let first = document.getElementById("addNewElementFirstNode").value;
		let second = document.getElementById("addNewElementSecondNode").value;
		let typ = document.getElementById("addNewElementType").selectedIndex;
		if(first == second){
			alert("Нельзя соединить элемент с самим собой");
			return;
		}
		for(let i = 0; i < network.edges.length; i++){
			let edge = network.edges[i];
			if((edge.startPoint.id == first && edge.endPoint.id == second) || (edge.endPoint.id == first && edge.startPoint.id == second)){
				alert("Нельзя создать второй элемент с теми же узлами");
				return;
			}
		}
		network.addEdge(first, second, typ);
	})
	let drop = document.getElementById("addNewElementType");
	for(let i = 0; i < types.length; i++){
		let opt = document.createElement("option");
		opt.value = types[i];
		opt.text = typesRu[i];
		drop.appendChild(opt);
	}
}

function cycle() {
    ctx.save();
    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.scale(1.5, 1.5);
    initialDraw();
    drawNetwork(network);
	//updateLBar(network);
	//NetworkToGraph(network);
	//GraphToMatrix();
	ctx.restore();
    window.requestAnimationFrame(cycle);
}
/*
function initSampleNetwork() {

    network.addNode(8, 1);
    network.addNode(5, 3);
    network.addNode(7, 7);
    network.addNode(10, 9);
    network.addNode(14, 6);
    network.addNode(15, 3);
    network.addNode(11, 1);

    network.addEdge(0, 1, 0);
    network.addEdge(1, 2, 1);
    network.addEdge(2, 3, 2);
    network.addEdge(3, 4, 3);
    network.addEdge(4, 5, 4, true);
    network.addEdge(5, 6, 5);
	network.addEdge(6, 0, 6);
}
*/
function initSampleNetwork2() {

    network.addNode(3, 1);
    network.addNode(15, 1);
    network.addNode(3, 7);
    network.addNode(15, 7);
    network.addNode(5, 7);
    network.addNode(13, 7);
	network.addNode(5, 4);
    network.addNode(13, 4);
	network.addNode(5, 10);
    network.addNode(13, 10);
    network.addNode(9, 4);
    network.addNode(9, 10);
	
	network.addEdge(0, 1, 6, 220, 0);
	network.addEdge(0, 2, 0);
	network.addEdge(1, 3, 0);
	network.addEdge(2, 4, 0);
	network.addEdge(3, 5, 0);
	network.addEdge(4, 6, 0);
	network.addEdge(5, 7, 0);
	network.addEdge(4, 8, 0);
	network.addEdge(5, 9, 0);
	network.addEdge(6, 10, 1, 10);
	network.addEdge(7, 10, 1, 5);
	network.addEdge(8, 11, 1, 15);
	network.addEdge(9, 11, 1, 20);
	network.addEdge(10, 11, 1, 50);
	
}

function initSampleNetwork3() {

    network.addNode(1, 1);
    network.addNode(1, 3);
    network.addNode(3, 3);
    network.addNode(3, 1);

	network.addEdge(0, 1, 6, 3);
	network.addEdge(1, 2, 0);
	network.addEdge(2, 3, 5, 1000);
	network.addEdge(3, 0, 0);
	
}

function debug(){
	for(let i = 0; i < Matrix.length; i++){
		console.log("Vertex " + i + " : ");
		console.log(Matrix[i]);
	}
	console.log(Column);
}

initial();
initSampleNetwork3();
cycle();