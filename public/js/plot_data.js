/**
 * DataSource class
 */
function DataSource(){
	this.data = {
		time: [0, 10],
	};
	
	this.active = true;
}


/**
 * PlotParameters class
 */
function PlotParameters(title){
	this.parameters = {
		time: new this.Parameter('s', true),
	};
	
	this.size_primary = 1;
	this.size_secondary = 0;
	
	// default xvar
	this.xvar = 'time';
	
	this.title = title;
	this.hor_zoom = [0, 0];
	this.pri_vert_zoom = [0, 0];
	this.sec_vert_zoom = [0, 0];
}


/**
 * Parameter class, subclass of PlotParameters
 */
PlotParameters.prototype.Parameter = function(unit, is_primary){
	if (typeof unit != "string")
		throw "second parameter must be a string";
	if (typeof is_primary != "boolean")
		throw "third parameter must be a boolean";

	this.unit = unit;
	this.is_primary = is_primary;
};


/**
 * Append Parameter to the data array
 */
PlotParameters.prototype.addParameter = function(parameter_name, unit, is_primary){
	// add data
	if (!this.parameters.hasOwnProperty(parameter_name)){
		if (is_primary)
			this.size_primary++;
		else
			this.size_secondary++;
	}
	this.parameters[parameter_name] = new this.Parameter(data_array, unit, is_primary); 
	
	// rezoom
	this.setZoomOnData(parameter_name);
};


/**
 * Remove Parameter from the data array
 */
PlotParameters.prototype.removeParameter = function(parameter_name){
	if (!this.parameters.hasOwnProperty(parameter_name))
		return;
	
	// remove data
	if (this.parameters[parameter_name].is_primary)
		this.size_primary--;
	else
		this.size_secondary--;
	delete this.parameters[parameter_name];
};


/**
 * Set zoom levels
 */
PlotParameters.prototype.setHorizontalZoom = function(min, max){
	this.hor_zoom[0] = min;
	this.hor_zoom[1] = max;
};
PlotParameters.prototype.setPriVerticalZoom = function(min, max){
	this.pri_vert_zoom[0] = min;
	this.pri_vert_zoom[1] = max;
};
PlotParameters.prototype.setSecVerticalZoom = function(min, max){
	this.sec_vert_zoom[0] = min;
	this.sec_vert_zoom[1] = max;
};
PlotParameters.prototype.setZoomOnParameter = function(data_sources, parameter_name){
	if (parameter_name == this.xvar){
		// horizontal zoom
		for (source_name in data_sources){
			data_source = data_sources[source_name];
			
			if (this.hor_zoom[0] == this.hor_zoom[1]){
				this.setHorizontalZoom(getMinOfArray(data_source.data[parameter_name]), getMaxOfArray(data_source.data[parameter_name]));
			} else {
				this.setHorizontalZoom(Math.min(this.hor_zoom[0], getMinOfArray(data_source.data[parameter_name])), 
					Math.max(this.hor_zoom[1], getMaxOfArray(data_source.data[parameter_name])));
			}
		}
	} else if (this.parameters[parameter_name].is_primary) {
		// primary vertical zoom
		for (source_name in data_sources){
			data_source = data_sources[source_name];
			
			if (this.pri_vert_zoom[0] == this.pri_vert_zoom[1])
				this.setPriVerticalZoom(getMinOfArray(data_source.data[parameter_name]), getMaxOfArray(data_source.data[parameter_name]));
			else
				this.setPriVerticalZoom(Math.min(this.pri_vert_zoom[0],getMinOfArray(data_source.data[parameter_name])), 
					Math.max(this.pri_vert_zoom[1],getMaxOfArray(data_source.data[parameter_name])));
		}
		
	} else {
		// secondary vertical zoom
		for (source_name in data_sources){
			data_source = data_sources[source_name];
			
			if (this.sec_vert_zoom[0] == this.sec_vert_zoom[1])
				this.setSecVerticalZoom(getMinOfArray(data_source.data[parameter_name]), getMaxOfArray(data_source.data[parameter_name]));
			else
				this.setSecVerticalZoom(Math.min(this.sec_vert_zoom[0],getMinOfArray(data_source.data[parameter_name])), 
					Math.max(this.sec_vert_zoom[1],getMaxOfArray(data_source.data[parameter_name])));
		}
	}
}


/**
 * Revert zoom levels to the maximum bounds that data allow
 */
PlotParameters.prototype.revertZoom = function(data_sources){
	for (parameter_name in this.parameters){
		if (parameter_name != this.xvar)
			this.setZoomOnParameter(parameter_name);
	}
}