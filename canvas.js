let canv = document.getElementById('canvasNetwork');
let ctx = canv.getContext("2d");
const cellSize = 48;

function initialDraw() {
	ctx.font = "small-caps 10px Serif";
	ctx.textAlign = "center";
	ctx.textBaseline= "middle";
    if (!canvasHover)
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
    if (canvasHover) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(node.x * cellSize, node.y * cellSize, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
		ctx.fillStyle = "black";
		ctx.fillText("" + node.id, node.x * cellSize, node.y * cellSize);
		ctx.strokeText("" + node.id, node.x * cellSize, node.y * cellSize);
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
    ctx.stroke();
    let middleX = (edge.startPoint.x + edge.endPoint.x) * cellSize * 0.5;
    let middleY = (edge.startPoint.y + edge.endPoint.y) * cellSize * 0.5;

    if (edge.type === 0)
        return;
	
    ctx.fillStyle = "white";
    ctx.save();
    let angle = Math.atan2(edge.startPoint.y - edge.endPoint.y, edge.startPoint.x - edge.endPoint.x);
    if (Math.abs(angle) > Math.PI / 2)
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
    ctx.translate(-middleX, -middleY);
    ctx.restore();
    ctx.fillStyle = "black";
}

function drawEdges(NWork) {
    for (let i = 0; i < NWork.edges.length; i++)
        drawEdge(NWork.edges[i]);
}

function drawNodes(NWork) {
    for (let i = 0; i < NWork.nodes.length; i++)
        drawNode(NWork.nodes[i]);
}

function drawNetwork(NWork) {
    drawEdges(NWork);
    drawNodes(NWork);
}