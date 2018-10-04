let network = new Network();

function cycle(){
	ctx.save();
	ctx.clearRect(0, 0, canv.width, canv.height);
	ctx.scale(1.5, 1.5);
	initialDraw();
	drawNetwork(network);
	updateHTML();
	ctx.restore();
	window.requestAnimationFrame(cycle);	
}

function initSampleNetwork(){
	
	network.addNode(8, 1);
	network.addNode(5, 1);
	network.addNode(5, 6);
	network.addNode(10, 6);
	network.addNode(14, 6);
	network.addNode(14, 1);
	network.addNode(11, 1);
	
	network.addEdge(0, 1, 0);
	network.addEdge(1, 2, 1);
	network.addEdge(2, 3, 2);
	network.addEdge(3, 4, 3);
	network.addEdge(4, 5, 4);
	network.addEdge(5, 6, 5);
}

initSampleNetwork();
cycle();