/**
 * Utility function: get the maximum element in an array
 */
Array.prototype.max = function() {
	return Math.max.apply(null, this);
}

/**
 * Utility function: get the minimum element in an array
 */
Array.prototype.min = function() {
	return Math.min.apply(null, this);
}

/**
 * Perform binary search on sorted array
 * Return: index of val if found, -1 if not
 */
Array.prototype.binarySearch = function(searchElement){
	var minIndex = 0;
    var maxIndex = this.length - 1;
    var currentIndex;
    var currentElement;
 
    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = this[currentIndex];
 
        if (currentElement < searchElement) {
            minIndex = currentIndex + 1;
        }
        else if (currentElement > searchElement) {
            maxIndex = currentIndex - 1;
        }
        else {
            return currentIndex;
        }
    }
 
    return -1;
}


/**
 * Check if String ends with pattern
 */
String.prototype.endsWith = function(pattern) {
	if (pattern instanceof Array){
		var str = this;
		
		return pattern.some(function(el){
			var d = str.length - el.length;
			return d >= 0 && str.lastIndexOf(el) === d;
		});
	} else {
		var d = this.length - pattern.length;
		return d >= 0 && this.lastIndexOf(pattern) === d;
	}
};

/**
 * Check if String starts with pattern
 */
String.prototype.startsWith = function(pattern) {
	if (pattern instanceof Array){
		var str = this;
		
		return pattern.some(function(el){
			return str.length>=el.length && str.indexOf(el) === 0;
		});
	} else
		return this.length>=pattern.length && this.indexOf(pattern) === 0;
};

/**
 * Replace all occurrences
 */
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};