let canv = document.getElementById('canvasNetwork');
let ctx = canv.getContext("2d");

initialDraw();
drawSampleNetwork();

function initialDraw() {
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 0.5;
    ctx.lineDashOffset = 4;
    ctx.setLineDash([8, 8]);
    const cellSize = 48;
    for (i = 0; i <= canv.height; i += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canv.width, i);
        ctx.stroke();
    }
    for (i = 0; i <= canv.width; i += cellSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canv.height);
        ctx.stroke();
    }
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
}

function drawSampleNetwork() {
    ctx.save();
    ctx.lineWidth = 0.02;
    ctx.transform(48, 0, 0, 48, 0, 0);
    ctx.translate(4, -4);
    ctx.beginPath();
    ctx.moveTo(5, 5);
    ctx.lineTo(4, 5);
    ctx.lineTo(4, 7);
    ctx.lineTo(7, 7);
    ctx.lineTo(7, 5);
    ctx.lineTo(6, 5);
    ctx.stroke();
    ctx.restore();
}