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
 * Check if String ends with pattern
 */
String.prototype.endsWith = function(pattern) {
    var d = this.length - pattern.length;
    return d >= 0 && this.lastIndexOf(pattern) === d;
};

/**
 * Check if String starts with pattern
 */
String.prototype.startsWith = function(pattern) {
    return this.length>=pattern.length && this.indexOf(pattern) === 0;
};

/**
 * Replace all occurrences
 */
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};