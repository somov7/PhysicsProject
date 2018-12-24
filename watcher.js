let watches = new Map();
let GlobalWatchID = 0;


class WatchCurrentGraph{
	constructor(id, output){
		this.edgeID = id;
		this.id = GlobalWatchID;
		this.output = output;
		this.output.imageSmoothingEnabled = true;
		this.startValue = 0;
		this.endValue = 1e5;
		this.currents = [];
	}
	init(){
		this.currents = [];
	}
	update(){
		this.currents.push(Current[idToEdge.get(this.edgeID)]);
	}
	final(){
		let mmax = -Infinity;
		let mmin = Infinity;
		let scaleMax = 0;
		for(let i = 0; i < this.currents.length; i++){
			scaleMax = Math.max(scaleMax, Math.abs(this.currents[i]));
		}
		for(let i = 0; i < this.currents.length; i++){
			this.currents[i] = scale(this.currents[i], -scaleMax, scaleMax, 10, 190);
		}
	}
	gui(){
		if(this.currents.length == 0 || !actualWatches){
			return;
		}
		this.output.fillStyle = 'white';
		this.output.fillRect(0, 0, 220, 200);
		this.output.strokeStyle = 'red';
		this.output.beginPath();
		this.output.moveTo(0, 100);
		this.output.lineTo(220, 100);
		this.output.stroke();
		this.output.strokeStyle = 'black';
		if(this.currents.length == 1){
			this.output.beginPath();
			this.output.moveTo(0, this.currents[0]);
			this.output.lineTo(220, this.currents[0]);
			this.output.stroke();		
			return;
		}
		this.output.beginPath();
		this.output.moveTo(0, this.currents[this.startValue]);
		for(let i = this.startValue + 1; i < this.endValue; i++){
			this.output.lineTo(scale(i, this.startValue, this.endValue, 0, 250), this.currents[i]);
		}
		this.output.stroke();
		this.output.strokeStyle = 'red';
		this.output.beginPath();
		this.output.moveTo(0, 100);
		this.output.lineTo(220, 100);
		this.output.stroke();
		this.output.strokeStyle = 'black';
	}
}

class WatchVoltageGraph{
	constructor(id, output){
		this.edgeID = id;
		this.id = GlobalWatchID;
		this.output = output;
		this.output.imageSmoothingEnabled = true;
		this.startValue = 0;
		this.endValue = 1e5;
		this.voltages = [];
	}
	init(){
		this.voltages = [];
	}
	update(){
		this.voltages.push(Voltage[idToEdge.get(this.edgeID)]);
	}
	final(){
		let mmax = -Infinity;
		let mmin = Infinity;
		let scaleMax = 0;
		for(let i = 0; i < this.voltages.length; i++){
			scaleMax = Math.max(scaleMax, Math.abs(this.voltages[i]));
		}
		for(let i = 0; i < this.voltages.length; i++){
			this.voltages[i] = scale(this.voltages[i], -scaleMax, scaleMax, 10, 190);
		}
	}
	gui(){
		if(this.voltages.length == 0 || !actualWatches){
			return;
		}
		this.output.fillStyle = 'white';
		this.output.fillRect(0, 0, 220, 200);
		this.output.strokeStyle = 'red';
		this.output.beginPath();
		this.output.moveTo(0, 100);
		this.output.lineTo(220, 100);
		this.output.stroke();
		this.output.strokeStyle = 'black';
		if(this.voltages.length == 1){
			this.output.beginPath();
			this.output.moveTo(0, this.voltages[0]);
			this.output.lineTo(220, this.voltages[0]);
			this.output.stroke();		
			return;
		}
		this.output.beginPath();
		this.output.moveTo(0, this.voltages[this.startValue]);
		for(let i = this.startValue + 1; i < this.endValue; i++){
			this.output.lineTo(scale(i, this.startValue, this.endValue, 0, 250), this.voltages[i]);
		}
		this.output.stroke();
		this.output.strokeStyle = 'red';
		this.output.beginPath();
		this.output.moveTo(0, 100);
		this.output.lineTo(220, 100);
		this.output.stroke();
		this.output.strokeStyle = 'black';
	}
}

class WatchCurrentRMS{
	constructor(id, output){
		this.current = 0;
		this.edgeID = id;
		this.id = GlobalWatchID;
		this.output = output;
	}
	init(){
		this.current = 0;
	}
	update(){
		this.current += Current[idToEdge.get(this.edgeID)] * Current[idToEdge.get(this.edgeID)] * deltaTime;
	}
	final(){
		this.current = Math.sqrt(this.current / limit);
	}
	gui(){
		this.output.html(math.round(this.current, 5));
	}
}

class WatchVoltageRMS{
	constructor(id, output){
		this.voltage = 0;
		this.edgeID = id;
		this.id = GlobalWatchID;
		this.output = output;
	}
	init(){
		this.voltage = 0;
	}
	update(){
		this.voltage += Voltage[idToEdge.get(this.edgeID)] * Voltage[idToEdge.get(this.edgeID)] * deltaTime;
	}
	final(){
		this.voltage = Math.sqrt(this.voltage / limit);
	}
	gui(){
		this.output.html(math.round(this.voltage, 6));
	}
}

function updateGUI(value, key, map){
	value.gui();
}

function updateWatch(value, key, map){
	value.update();
}

function finalWatch(value, key, map){
	value.final();
}

function initWatch(value, key, map){
	value.init();
}

let actualWatches = false;

function watchesActual(newValue){
	if(actualWatches && !newValue){
		$("#watchSettings").children('.barDiv').css('opacity', 0.5);
	}
	else if(!actualWatches && newValue){
		$("#watchSettings").children('.barDiv').css('opacity', 1);
	}
	actualWatches = newValue;
}

function deleteWatch(id){
	$('#' + id).remove();
	watches.delete(parseInt(id.substr(5)));
}