/**
 * PlotData class
 */
function PlotData(title){

	// the primary data
	// each property is a UnitData object
	this.data = {
		time: new this.UnitData([0, 0], 's', true),
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
 * data_unit class, subclass of PlotData
 */
PlotData.prototype.UnitData = function(data_array, unit, is_primary){
	if (!Array.isArray(data_array))
		throw "first parameter must be an array";
	if (typeof unit != "string")
		throw "second parameter must be a string";
	if (typeof is_primary != "boolean")
		throw "third parameter must be a boolean";

	this.data = data_array;
	this.unit = unit;
	this.is_primary = is_primary;
};


/**
 * Append unit_data to the data array
 */
PlotData.prototype.addData = function(data_name, data_array, unit, is_primary){
	if (data_name != this.xvar && data_array.length != this.data[this.xvar].data.length)
		throw "dimensions mismatch";

	// add data
	if (!this.data.hasOwnProperty(data_name)){
		if (is_primary)
			this.size_primary++;
		else
			this.size_secondary++;
	}
	this.data[data_name] = new this.UnitData(data_array, unit, is_primary); 
	
	// rezoom
	this.setZoomOnData(data_name);
};


/**
 * Remove unit_data from the data array
 */
PlotData.prototype.removeData = function(data_name){
	if (!this.data.hasOwnProperty(data_name))
		return;
	
	// remove data
	if (this.data[data_name].is_primary)
		this.size_primary--;
	else
		this.size_secondary--;
	delete this.data[data_name];
};


/**
 * Fetch and parse data from the specified file 
 */
PlotData.prototype.fetch = function(file_path){
	this.revertZoom();
};


/**
 * Set zoom levels
 */
PlotData.prototype.setHorizontalZoom = function(min, max){
	this.hor_zoom[0] = min;
	this.hor_zoom[1] = max;
};
PlotData.prototype.setPriVerticalZoom = function(min, max){
	this.pri_vert_zoom[0] = min;
	this.pri_vert_zoom[1] = max;
};
PlotData.prototype.setSecVerticalZoom = function(min, max){
	this.sec_vert_zoom[0] = min;
	this.sec_vert_zoom[1] = max;
};
PlotData.prototype.setZoomOnData = function(data_name){
	if (data_name == this.xvar){
		// horizontal zoom
		this.setHorizontalZoom(getMinOfArray(this.data[data_name].data), getMaxOfArray(this.data[data_name].data));
	} else if (this.data[data_name].is_primary) {
		// primary vertical zoom
		if (this.pri_vert_zoom[0] == this.pri_vert_zoom[1])
			this.setPriVerticalZoom(getMinOfArray(this.data[data_name].data), getMaxOfArray(this.data[data_name].data));
		else
			this.setPriVerticalZoom(Math.min(this.pri_vert_zoom[0],getMinOfArray(this.data[data_name].data)), 
				Math.max(this.pri_vert_zoom[1],getMaxOfArray(this.data[data_name].data)));
	} else {
		// secondary vertical zoom
		if (this.sec_vert_zoom[0] == this.sec_vert_zoom[1])
			this.setSecVerticalZoom(getMinOfArray(this.data[data_name].data), getMaxOfArray(this.data[data_name].data));
		else
			this.setSecVerticalZoom(Math.min(this.sec_vert_zoom[0],getMinOfArray(this.data[data_name].data)), 
				Math.max(this.sec_vert_zoom[1],getMaxOfArray(this.data[data_name].data)));
	}
}


/**
 * Revert zoom levels to the maximum bounds that data allow
 */
PlotData.prototype.revertZoom = function(){
	for (data_name in this.data){
		if (data_name != this.xvar)
			this.setZoomOnData(data_name);
	}
}