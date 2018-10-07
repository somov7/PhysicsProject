function updateHTML() {
    let inCur = document.getElementById('inputCurrent');
    let inOption = inCur.options[inCur.selectedIndex].value;
    if (inOption === "direct")
        document.getElementById('inputFrequencyWrap').setAttribute("hidden", "hidden");
    else
        document.getElementById('inputFrequencyWrap').removeAttribute("hidden");
}

let canvasHover = false;

canv.onmouseover = function (e) {
    canvasHover = true;
};

canv.onmouseout = function (e) {
    canvasHover = false;
};

function createLBarElement(edge){
	let types = ["Empty", "Resistor", "Condensator", "Coil", "Switch", "Lamp"];
	let typesRu = ["Проводник", "Резистор", "Конденсатор", "Катушка", "Ключ", "Лампа"];
	let div = document.createElement("div");
	div.setAttribute("id", "elementSettings" + edge.id);
	div.setAttribute("style", "padding: 10px; border: 1px solid black; margin: 2px; padding-right: 30px");
	let text = document.createTextNode("Участок " + edge.startPoint.id + " <-> " + edge.endPoint.id);
	div.appendChild(text);
	div.appendChild(document.createElement("br"));
	
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
	
	/* Resistance attribute */
	
	let warp = document.createElement("label");
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
	res.setAttribute("value", "0");
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
	cap.setAttribute("value", "0");
	cap.addEventListener('change', function() {
		updateElementFromLBar(edge);
	});
	warp.appendChild(cap);
	text = document.createTextNode(" нФ");
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
	ind.setAttribute("value", "0");
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
	sta.setAttribute("checked", "checked");
	sta.addEventListener('change', function() {
		updateElementFromLBar(edge);
	});
	warp.appendChild(sta);
	warp.appendChild(document.createElement("br"));
	div.appendChild(warp);
	
	/* Final */
	
	document.getElementById("edgeSettings").appendChild(div);
	updateLBarElement(edge.id, typ.selectedIndex);
}

function updateElementFromLBar(edge){
	let t = document.getElementById("resistance" + edge.id).value;
	edge.resistance = parseFloat(t);
	t = document.getElementById("capacity" + edge.id).value;
	edge.capacity = parseFloat(t);
	t = document.getElementById("inductance" + edge.id).value;
	edge.inductance = parseFloat(t);
	t = document.getElementById("state" + edge.id).checked;
	edge.state = t;
}

function updateLBarElement(id, index){
	switch(index){
		case 0: //Empty
			document.getElementById("resistanceWarp" + id).setAttribute("hidden", "hidden");
			document.getElementById("capacityWarp" + id).setAttribute("hidden", "hidden");
			document.getElementById("inductanceWarp" + id).setAttribute("hidden", "hidden");
			document.getElementById("stateWarp" + id).setAttribute("hidden", "hidden");
			break;
		case 1: //Resistor
		case 5: //Lamp
			document.getElementById("resistanceWarp" + id).removeAttribute("hidden", "hidden");
			document.getElementById("capacityWarp" + id).setAttribute("hidden", "hidden");
			document.getElementById("inductanceWarp" + id).setAttribute("hidden", "hidden");
			document.getElementById("stateWarp" + id).setAttribute("hidden", "hidden");
			break;
		case 2: //Condensator
			document.getElementById("resistanceWarp" + id).removeAttribute("hidden", "hidden");
			document.getElementById("capacityWarp" + id).removeAttribute("hidden", "hidden");
			document.getElementById("inductanceWarp" + id).setAttribute("hidden", "hidden");
			document.getElementById("stateWarp" + id).setAttribute("hidden", "hidden");
			break;
		case 3: //Coil
			document.getElementById("resistanceWarp" + id).removeAttribute("hidden", "hidden");
			document.getElementById("capacityWarp" + id).setAttribute("hidden", "hidden");
			document.getElementById("inductanceWarp" + id).removeAttribute("hidden", "hidden");
			document.getElementById("stateWarp" + id).setAttribute("hidden", "hidden");
			break;
		case 4: //Switch
			document.getElementById("resistanceWarp" + id).setAttribute("hidden", "hidden");
			document.getElementById("capacityWarp" + id).setAttribute("hidden", "hidden");
			document.getElementById("inductanceWarp" + id).setAttribute("hidden", "hidden");
			document.getElementById("stateWarp" + id).removeAttribute("hidden", "hidden");
	}
}