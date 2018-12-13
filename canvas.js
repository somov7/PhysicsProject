let canv = document.getElementById("canvasNetwork");
let ctx = canv.getContext("2d");
const cellSize = 48;
const scaleFactor = 1.5;
let hoverNode;

function initialDraw() {
	canv.width = window.innerWidth - 300;
	canv.height = window.innerHeight - 35;
    ctx.scale(scaleFactor, scaleFactor);
	ctx.font = "small-caps 10px Serif";
	ctx.textAlign = "center";
	ctx.textBaseline= "middle";
    if (!grid)
        return;
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 0.5;
    ctx.lineDashOffset = 4;
    ctx.setLineDash([8, 8]);
    for (let i = 0; i <= canv.height; i += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canv.width, i);
        ctx.stroke();
    }
    for (let i = 0; i <= canv.width; i += cellSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canv.height);
        ctx.stroke();
    }
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
}

function drawNode(node) {
    if (grid) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(node.x * cellSize, node.y * cellSize, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "black";
		if((!clicked && hoverNode == node.id) || (clicked && startNode == node.id)){
			if(clicked && startNode == hoverNode)
				ctx.strokeStyle = ctx.fillStyle = "#ff6666";			
			else if(clicked && startNode != hoverNode)
				ctx.strokeStyle = ctx.fillStyle = "black";
			else
				ctx.strokeStyle = ctx.fillStyle = "red";	
		}
		else
			ctx.strokeStyle = ctx.fillStyle = "black";
        ctx.stroke();
		ctx.fillText("" + node.id, node.x * cellSize, node.y * cellSize);
    }
    else {
        ctx.beginPath();
        ctx.arc(node.x * cellSize, node.y * cellSize, 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function drawEdge(edge) {
    ctx.beginPath();
    ctx.moveTo(edge.startPoint.x * cellSize, edge.startPoint.y * cellSize);
    ctx.lineTo(edge.endPoint.x * cellSize, edge.endPoint.y * cellSize);	
	
	if(edge.id == hoverEdge && clicked)
		ctx.strokeStyle = "red";
	
	if(edge.id == highlightEdge){
		ctx.lineWidth = 2;
		//ctx.strokeStyle = "#00CC00";
	}

    ctx.stroke();
	
    let middleX = (edge.startPoint.x + edge.endPoint.x) * cellSize * 0.5;
    let middleY = (edge.startPoint.y + edge.endPoint.y) * cellSize * 0.5;
	
    ctx.fillStyle = "white";
    ctx.save();
    let angle = Math.atan2(edge.startPoint.y - edge.endPoint.y, edge.startPoint.x - edge.endPoint.x);
    if (Math.abs(angle) > Math.PI / 2 && edge.type != 6)
        angle += Math.PI;
    ctx.translate(middleX, middleY);
    ctx.rotate(angle);


    if (edge.type === 1) {
        ctx.beginPath();
        ctx.rect(-16, -8, 32, 16);
        ctx.fill();
        ctx.stroke();
    }
    else if (edge.type === 2) {
        ctx.beginPath();
        ctx.rect(-6, -12, 12, 24);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-6, -12);
        ctx.lineTo(-6, +12);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(6, -12);
        ctx.lineTo(6, 12);
        ctx.stroke();
    }
    else if (edge.type === 3) {
        ctx.translate(-8, -3);
        ctx.clearRect(-8, 0, 36, 4);
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            ctx.arc(-2, 0, 6, 0.8 * Math.PI, 0.2 * Math.PI);
            ctx.translate(8, 0);
        }
        ctx.stroke();
    }
    else if (edge.type === 4) {
        ctx.fillStyle = "black";
        if (!edge.state) {
            ctx.clearRect(-6, -1, 12, 2);
            ctx.beginPath();
            ctx.moveTo(-7, 0);
            ctx.lineTo(5, 5);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(-7, 0, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, 0, 2, 0, 2 * Math.PI);
        ctx.fill();
    }
    else if (edge.type === 5) {
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, 2 * Math.PI);
		let color;
		if(typeof idToEdge == 'undefined' || typeof idToEdge.get(edge.id) == 'undefined' || typeof Currency == 'undefined' || typeof Currency[idToEdge.get(edge.id)] == 'undefined')
			color = 255;
		else
			color = scale(Math.pow(Currency[idToEdge.get(edge.id)], 2) * edge.resistance, 0, edge.power, 255, 0);
		ctx.fillStyle = "rgb(255,255," + color + ")";
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-5, -5);
        ctx.lineTo(5, 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(5, -5);
        ctx.lineTo(-5, 5);
        ctx.stroke();
    }
	else if(edge.type == 6){
        ctx.beginPath();
        ctx.rect(-4, -16, 8, 32);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-4, -16);
        ctx.lineTo(-4, +16);
        ctx.stroke();
		ctx.lineWidth = 2;
		ctx.beginPath();
        ctx.moveTo(4, -9);
        ctx.lineTo(4, 9);
        ctx.stroke();
		ctx.font = "bold 18px Serif";
		ctx.fillStyle = "black";
		if(Math.abs(angle) > Math.PI / 2){
			ctx.fillText("+", -12, 10);
			ctx.fillText("-", 12, 6);
		}
		else{
			ctx.fillText("+", -12, -10);
			ctx.fillText("-", 12, -6);			
		}
		ctx.fill();
	}
	
    ctx.translate(-middleX, -middleY);
    ctx.restore();
	ctx.lineWidth = 1;
    ctx.fillStyle = "black";
	ctx.strokeStyle = "black";
}

function drawEdges() {
    for (let i = 0; i < network.edges.length; i++)
        drawEdge(network.edges[i]);
}

function drawNodes() {
    for (let i = 0; i < network.nodes.length; i++)
        drawNode(network.nodes[i]);
}

function drawNetwork() {
	ctx.strokeStyle = "#00CC00";
	if(grid && clicked){
		if(startX != hoverX || startY != hoverY){
			if(closeEnough){
				ctx.beginPath();
				ctx.moveTo(startX * cellSize, startY * cellSize);
				ctx.lineTo(hoverX * cellSize, hoverY * cellSize);	
				ctx.stroke();
			}
			else{
				ctx.strokeStyle = "#AAAA00";
				ctx.beginPath();
				ctx.moveTo(startX * cellSize, startY * cellSize);
				ctx.lineTo(trueHoverX / scaleFactor, trueHoverY / scaleFactor);	
				ctx.stroke();	
			}
		}
	}
	
	ctx.strokeStyle = "black";
    drawEdges();
    drawNodes();
	
	ctx.strokeStyle = "#00CC00";
	if(grid && hoverNode == -1 && closeEnough){
		ctx.beginPath();
        ctx.arc(hoverX * cellSize, hoverY * cellSize, 6, 0, 2 * Math.PI);
        ctx.stroke();
	}
	if(grid && clicked && startNode == -1){
		if(!closeEnough)
			ctx.strokeStyle = "#AAAA00";
		ctx.beginPath();
        ctx.arc(startX * cellSize, startY * cellSize, 6, 0, 2 * Math.PI);
        ctx.stroke();
	}
}