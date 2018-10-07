let network;

function initial(){
	network = new Network();
	let but = document.getElementById("addNewElementButton");
	but.addEventListener('click', function(){
		let first = document.getElementById("addNewElementFirstNode").value;
		let second = document.getElementById("addNewElementSecondNode").value;
		let typ = document.getElementById("addNewElementType");
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
}

function cycle() {
    ctx.save();
    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.scale(1.5, 1.5);
    initialDraw();
    drawNetwork(network);
    updateHTML();
	//updateLBar(network);
	ctx.restore();
    window.requestAnimationFrame(cycle);
}

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
}

initial();
initSampleNetwork();
cycle();