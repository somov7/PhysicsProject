let grid = true;
let canvasHover;
let hoverX;
let hoverY;
let trueHoverX;
let trueHoverY;
let closeEnough;
let dist2;
let closeThreshold = Math.pow(scaleFactor * cellSize * 0.4, 2);
let startX, startY, startNode;
let hoverEdge, highlightEdge;
let clicked = false;

$(document).ready(function() {
	$('#showGridCheckbox').is('checked');
	$('#showGridCheckbox').change(function() {
        grid = !grid;
    });
	$('#canvasNetwork')
		.mousemove( function(event){	
			if(!grid)
				return;
			let jcanv = $('#canvasNetwork');
			canvasHover = true;
			trueHoverX = event.pageX - jcanv.position().left - parseInt(jcanv.css('marginLeft'), 10);
			trueHoverY = event.pageY - jcanv.position().top - parseInt(jcanv.css('marginTop'), 10);
			hoverX = Math.round(trueHoverX / (scaleFactor * cellSize));
			hoverY = Math.round(trueHoverY / (scaleFactor * cellSize));
			dist2 = Math.pow((trueHoverX - hoverX * scaleFactor * cellSize), 2) + Math.pow((trueHoverY - hoverY * scaleFactor * cellSize), 2);
			closeEnough = dist2 < closeThreshold && hoverX > 0 && hoverY > 0;			
			hoverNode = -1;
			if(closeEnough){
				for(let i = 0; i < network.nodes.length; i++){
					let node = network.nodes[i];
					if(node.x == hoverX && node.y == hoverY){
						hoverNode = node.id;
						break;
					}
				}
			}
			if(clicked){
				hoverEdge = -1;
				for(let i = 0; i < network.edges.length; i++){
					let edge = network.edges[i];
					if((edge.startPoint.id == startNode && edge.endPoint.id == hoverNode) || 
						(edge.startPoint.id == hoverNode && edge.endPoint.id == startNode)){
						hoverEdge = edge.id;
						break;
					}
				}
			}
		})
		.mousedown( function(){
			startX = startY = -1;
			startNode = -1;
			if(!grid || !closeEnough)
				return;
			clicked = true;
			if(hoverNode > -1){
				startNode = hoverNode;
			}
			startX = hoverX;
			startY = hoverY;
		})
		.mouseup( function(){
			if(!clicked)
				return;
			clicked = false;
			if(!grid || !closeEnough)
				return;
			if(startNode > -1){
				if(hoverNode == startNode){
					network.deleteNode(hoverNode);
					hoverNode = -1;
				}
				else if(hoverNode > -1){
					if(hoverEdge == -1){
						network.addEdge(startNode, hoverNode, 0);
					}
					else{
						network.deleteEdge(hoverEdge);	
					}
				}
				else{
					network.addNode(hoverX, hoverY);
					hoverNode = network.globalNodeID - 1;
					network.addEdge(startNode, network.globalNodeID - 1, 0);
				}
			}
			else{
				if(hoverNode == -1){
					if(startX == hoverX && startY == hoverY){
						network.addNode(startX, startY);
						hoverNode = network.globalNodeID - 1;
					}
					else{
						network.addNode(startX, startY);
						network.addNode(hoverX, hoverY);
						network.addEdge(network.globalNodeID - 2, network.globalNodeID - 1, 0);
					}
				}
				else if(hoverNode > -1){
					network.addNode(startX, startY);
					network.addEdge(hoverNode, network.globalNodeID - 1, 0);
				}
			}
		});
		$("#calcButton").click( function(){
			calculate();
			if(errNetwork != ""){
				alert(errNetwork);
				return;
			}
			let message = "";
			for(let i = 0; i < network.edges.length; i++){
				edge = network.edges[i];
				message += edge.startPoint.id + "<->" + edge.endPoint.id + ": " + math.round(accumulator[idToEdge.get(edge.id)], 5) + "\n";
			}
			alert(message);
		});
});

function createLBarElement(edge){
	let div = document.createElement("div");
	div.setAttribute("id", "elementSettings" + edge.id);
	div.setAttribute("style", "padding: 10px; border: 1px solid black; margin: 2px; padding-right: 30px; position: relative");
	
	let text = document.createTextNode("Участок " + edge.startPoint.id + " <-> " + edge.endPoint.id);
	div.appendChild(text);
	div.appendChild(document.createElement("br"));
	let warp;
	
	
	div.addEventListener('mouseover', function(){
		highlightEdge = edge.id;
	});
	
	div.addEventListener('mouseout', function(){
		highlightEdge = -1;
	});
	
	/* Type attribute */
	
	let typ = document.createElement("select");
	typ.setAttribute("name", "type");
	typ.style.width = "130px";
	for(let i = 0; i < types.length; i++){
		let opt = document.createElement("option");
		opt.value = types[i];
		opt.text = typesRu[i];
		if(i == edge.type)
			opt.setAttribute("selected", "selected");
		typ.appendChild(opt);
	}
	typ.addEventListener('change', function() {
		let index = typ.selectedIndex;
		edge.type = index;
		updateElementFromLBar(edge);
		updateLBarElement(edge.id, index);
	});
	div.appendChild(typ);
	div.appendChild(document.createElement("br"));
	
	/* Voltage attribute */
	
	warp = document.createElement("label");
	let volt = document.createElement("input");
	text = document.createTextNode("Напряжение: ");
	warp.setAttribute("name", "voltageWarp");
	warp.setAttribute("id", "voltageWarp" + edge.id);
	warp.appendChild(text);
	warp.appendChild(document.createElement("br"));
	volt.setAttribute("type", "number");
	volt.style.width = "100px";
	volt.setAttribute("name", "voltage");
	volt.setAttribute("id", "voltage" + edge.id);
	volt.setAttribute("min", "0");
	volt.setAttribute("step", "0.1");
	volt.setAttribute("value", edge.voltage);
	volt.addEventListener('change', function() {
		updateElementFromLBar(edge);
	});
	warp.appendChild(volt);
	text = document.createTextNode(" В");
	warp.appendChild(text);	
	warp.appendChild(document.createElement("br"));
	div.appendChild(warp);
	
	/* Frequency attribute */
	
	warp = document.createElement("label");
	let freq = document.createElement("input");
	text = document.createTextNode("Частота: ");
	warp.setAttribute("name", "frequencyWarp");
	warp.setAttribute("id", "frequencyWarp" + edge.id);
	warp.appendChild(text);
	warp.appendChild(document.createElement("br"));
	freq.setAttribute("type", "number");
	freq.style.width = "100px";
	freq.setAttribute("name", "frequency");
	freq.setAttribute("id", "frequency" + edge.id);
	freq.setAttribute("min", "0");
	freq.setAttribute("step", "1");
	freq.setAttribute("value", edge.frequency);
	freq.addEventListener('change', function() {
		updateElementFromLBar(edge);
	});
	warp.appendChild(freq);
	text = document.createTextNode(" Гц");
	warp.appendChild(text);	
	warp.appendChild(document.createElement("br"));
	div.appendChild(warp);
	
	/* Resistance attribute */
	
	warp = document.createElement("label");
	let res = document.createElement("input");
	text = document.createTextNode("Сопротивление: ");
	warp.setAttribute("name", "resistanceWarp");
	warp.setAttribute("id", "resistanceWarp" + edge.id);
	warp.appendChild(text);
	warp.appendChild(document.createElement("br"));
	res.setAttribute("type", "number");
	res.style.width = "100px";
	res.setAttribute("name", "resistance");
	res.setAttribute("id", "resistance" + edge.id);
	res.setAttribute("min", "0");
	res.setAttribute("step", "0.1");
	res.setAttribute("value", edge.resistance);
	res.addEventListener('change', function() {
		updateElementFromLBar(edge);
	});
	warp.appendChild(res);
	text = document.createTextNode(" Ом");
	warp.appendChild(text);	
	warp.appendChild(document.createElement("br"));
	div.appendChild(warp);
	
	/* Capacity attribute */
	
	warp = document.createElement("label");
	let cap = document.createElement("input");
	text = document.createTextNode("Ёмкость: ");
	warp.setAttribute("name", "capacityWarp");
	warp.setAttribute("id", "capacityWarp" + edge.id);
	warp.appendChild(text);	
	warp.appendChild(document.createElement("br"));
	cap.setAttribute("type", "number");
	cap.style.width = "100px";
	cap.setAttribute("name", "capacity");
	cap.setAttribute("id", "capacity" + edge.id); 
	cap.setAttribute("min", "0");
	cap.setAttribute("step", "1");
	cap.setAttribute("value", edge.capacity);
	cap.addEventListener('change', function() {
		updateElementFromLBar(edge);
	});
	warp.appendChild(cap);
	text = document.createTextNode(" нФ");
	warp.appendChild(text);
	warp.appendChild(document.createElement("br"));
	div.appendChild(warp);
	 
	/* Power attributes */
	
	warp = document.createElement("label");
	let power = document.createElement("input");
	text = document.createTextNode("Рабочая мощность: ");
	warp.setAttribute("name", "powerWarp");
	warp.setAttribute("id", "powerWarp" + edge.id);
	warp.appendChild(text);	
	warp.appendChild(document.createElement("br"));
	power.setAttribute("type", "number");
	power.style.width = "100px";
	power.setAttribute("name", "power");
	power.setAttribute("id", "power" + edge.id); 
	power.setAttribute("min", "0");
	power.setAttribute("step", "0.001");
	power.setAttribute("value", edge.power);
	power.addEventListener('change', function() {
		updateElementFromLBar(edge);
	});
	warp.appendChild(power);
	text = document.createTextNode(" Вт");
	warp.appendChild(text);
	warp.appendChild(document.createElement("br"));
	div.appendChild(warp);
	
	/* Induction attributes */
	
	warp = document.createElement("label");
	let ind = document.createElement("input");
	text = document.createTextNode("Индуктивность: ");
	warp.setAttribute("name", "inductanceWarp");
	warp.setAttribute("id", "inductanceWarp" + edge.id);
	warp.appendChild(text);	
	warp.appendChild(document.createElement("br"));
	ind.setAttribute("type", "number");
	ind.style.width = "100px";
	ind.setAttribute("name", "inductance");
	ind.setAttribute("id", "inductance" + edge.id);
	ind.setAttribute("min", "0");
	ind.setAttribute("step", "1");
	ind.setAttribute("value", edge.inductance);
	ind.addEventListener('change', function() {
		updateElementFromLBar(edge);
	});
	warp.appendChild(ind);
	text = document.createTextNode(" мкГн");
	warp.appendChild(text);
	warp.appendChild(document.createElement("br"));
	div.appendChild(warp);
	
	/* State attributes */
	
	warp = document.createElement("label");
	let sta = document.createElement("input");
	text = document.createTextNode("Замкнут: ");
	warp.setAttribute("name", "stateWarp");
	warp.setAttribute("id", "stateWarp" + edge.id);
	warp.appendChild(text);	
	sta.setAttribute("type", "checkbox");
	sta.setAttribute("name", "state");
	sta.setAttribute("id", "state" + edge.id);
	if(edge.state)
		sta.checked = true;
	else
		sta.checked = false;	
	sta.addEventListener('change', function() {
		updateElementFromLBar(edge);
	});
	warp.appendChild(sta);
	warp.appendChild(document.createElement("br"));
	div.appendChild(warp);
	
	/* Delete button */
	
	let del = document.createElement("input");
	del.setAttribute("type", "button");
	del.setAttribute("value", "Удалить");
	del.style.top = "10px";
	del.style.right = "10px";
	del.style.position = "absolute";
	del.style.zIndex = "1";
	del.addEventListener("click", function(){
		network.deleteEdge(edge.id);
	}); 
	div.appendChild(del);
	
	/* Flip button */
	
	let flip = document.createElement("input");
	flip.setAttribute("type", "button");
	flip.setAttribute("id", "flipButton" + edge.id);
	flip.setAttribute("value", "Полюса");
	flip.style.top = "40px";
	flip.style.right = "10px";
	flip.style.position = "absolute";
	flip.style.zIndex = "1";
	flip.addEventListener("click", function(){
		edge.flip();
	}); 
	div.appendChild(flip);
	
	/* Final */
	
	document.getElementById("edgeSettings").appendChild(div);
	updateLBarElement(edge.id, typ.selectedIndex);
}

function updateElementFromLBar(edge){
	let t = document.getElementById("resistance" + edge.id).value;
	edge.resistance = parseFloat(t);
	t = document.getElementById("voltage" + edge.id).value;
	edge.voltage = parseFloat(t);
	t = document.getElementById("frequency" + edge.id).value;
	edge.frequency = parseFloat(t);
	t = document.getElementById("capacity" + edge.id).value;
	edge.capacity = parseFloat(t);
	t = document.getElementById("inductance" + edge.id).value;
	edge.inductance = parseFloat(t);
	t = document.getElementById("power" + edge.id).value;
	edge.power = parseFloat(t);
	t = document.getElementById("state" + edge.id).checked;
	edge.state = t;
}

function updateLBarElement(id, index){
	document.getElementById("resistanceWarp" + id).setAttribute("hidden", "hidden");
	document.getElementById("capacityWarp" + id).setAttribute("hidden", "hidden");
	document.getElementById("inductanceWarp" + id).setAttribute("hidden", "hidden");
	document.getElementById("stateWarp" + id).setAttribute("hidden", "hidden");
	document.getElementById("voltageWarp" + id).setAttribute("hidden", "hidden");
	document.getElementById("frequencyWarp" + id).setAttribute("hidden", "hidden");
	document.getElementById("flipButton" + id).setAttribute("hidden", "hidden");
	document.getElementById("powerWarp" + id).setAttribute("hidden", "hidden");
	switch(index){
		case 0: //Empty
			break;
		case 1: //Resistor
			document.getElementById("resistanceWarp" + id).removeAttribute("hidden", "hidden");
			break;
		case 2: //Condensator
			document.getElementById("capacityWarp" + id).removeAttribute("hidden", "hidden");
			break;
		case 3: //Coil
			document.getElementById("inductanceWarp" + id).removeAttribute("hidden", "hidden");
			break;
		case 4: //Switch
			document.getElementById("stateWarp" + id).removeAttribute("hidden", "hidden");
			break;
		case 5: //Lamp
			document.getElementById("resistanceWarp" + id).removeAttribute("hidden", "hidden");
			document.getElementById("powerWarp" + id).removeAttribute("hidden", "hidden");
			break;
		case 6: //Source
			document.getElementById("voltageWarp" + id).removeAttribute("hidden", "hidden");
			document.getElementById("frequencyWarp" + id).removeAttribute("hidden", "hidden");
			document.getElementById("flipButton" + id).removeAttribute("hidden", "hidden");
	}
}

function deleteElementFromLBar(id){
	document.getElementById("edgeSettings").removeChild(document.getElementById("elementSettings" + id));
}

function updateAddNewElementDroplists(id){
	let first = document.getElementById("addNewElementFirstNode");
	let second = document.getElementById("addNewElementSecondNode");
	let opt = document.createElement("option");
	opt.innerHTML = id;
	first.appendChild(opt);
	opt = document.createElement("option");
	opt.innerHTML = id;
	second.appendChild(opt);	
}

function updateDeleteElementDroplists(id){
	$('#addNewElementFirstNode option').each(function () {
		if($(this).html() == id)
			this.remove();
	});
	$('#addNewElementSecondNode option').each(function () {
		if($(this).html() == id)
			this.remove();
	});
	
}