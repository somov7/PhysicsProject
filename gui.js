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
	div.setAttribute("id", "elementSettings" + edge.id)
	let typ = document.createElement("select");
	typ.setAttribute("name", "type");
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
	})
	div.appendChild(typ);
	
	/*
	let res = document.createElement("input");
	let cap = document.createElement("input");
	let ind = document.createElement("input");
	let sta = document.createElement("input");
	*/
	document.getElementById("edgeSettings").appendChild(div);
}

function updateLBarElement(edge){
	let div = document.getElementById("elementSettings" + edge.id);
	let typ = div.getElementsByTagName("select")[0]; // Рот ебал
	alert(typ);
	//alert(typ.getAttribute("selectedIndex"));
	//edge.type = typ.getAttribute("selectedIndex");	
}