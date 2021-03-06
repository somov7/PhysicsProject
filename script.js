let network;

let types = ["Empty", "Resistor", "Condensator", "Coil", "Switch", "Lamp", "Source"];
let typesRu = ["Проводник", "Резистор", "Конденсатор", "Катушка", "Ключ", "Лампа", "Источник ЭДС"];

let ready;

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
		network.addEdge(first, second, typ);
	})
	let drop = document.getElementById("addNewElementType");
	for(let i = 0; i < types.length; i++){
		let opt = document.createElement("option");
		opt.value = types[i];
		opt.text = typesRu[i];
		drop.appendChild(opt);
	}
	$('#resetButton').click(function(){
		while(network.nodes.length > 0){ 
			network.deleteNode(network.nodes[0].id);
		}
		network.globalNodeID = network.globalEdgeID = 0;
	});
}

function cycle() {
    ctx.save();
    ctx.clearRect(0, 0, canv.width, canv.height);
    initialDraw();
    drawNetwork();
	ctx.restore();
	if(ready == 1){
		$('#progress').css({
			'display': 'flex',
			'visibility': 'visible'
		});
		ready = 2;
	}
	else if(ready == 2){		
		calculate();
		$('#progress').css({
			'display': 'none',
			'visibility': 'hidden'
		});
		if(errNetwork != ""){
			alert(errNetwork);
			errNetwork = "";
		}
		ready = 0;
	}
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
	network.addEdge(6, 0, 6);
}

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
	network.addEdge(1, 2, 4);
	network.addEdge(2, 3, 5, 1000, 1);
	network.addEdge(3, 0, 0);
	
}

function initSampleNetwork4(){
	
	network.addNode(-2, -2);
    network.addNode(0, -2);
    network.addNode(2, -2);
    network.addNode(2, 0);
    network.addNode(2, 2);
    network.addNode(-2, 2);
    network.addNode(0, 0);
	
	network.addEdge(0, 1, 6, 1, 0, true);
	network.addEdge(5, 6, 6, 2, 0, true);
	network.addEdge(3, 4, 6, 3);
	network.addEdge(1, 2, 1, 1);
	network.addEdge(2, 6, 1, 0.5);
	network.addEdge(2, 3, 1, 1.0/3);
	network.addEdge(0, 5, 1, 1.0);
	network.addEdge(4, 5, 1, 1.0/3);
	
}

function debug(){
	let watch = new Watcher(0, 1);
	console.log(watch.get());
}

initial();
initSampleNetwork4();
cycle();