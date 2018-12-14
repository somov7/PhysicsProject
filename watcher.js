class Watcher{
	constructor(t, param, param2){
		this.type = t;
		switch(t){
			case 0: // Current
				this.current = param;
			case 1: // Voltage
				this.voltageFirst = param;
				this.voltageSecond = param2;
			case 2: // Power
				this.power = param;
		}
	}
	get(){
		if(!actual)
			return 0;
		if(this.t == 0)
			return accumulator[this.current];
	}
}

