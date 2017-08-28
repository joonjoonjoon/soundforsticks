var waveform = require('waveform-node');
var ffmpegBinaries = require("ffmpeg-binaries")
var ffmpegPath = ffmpegBinaries.ffmpegPath() // Path to ffmpeg binary
var args = require('minimist')(process.argv.slice(2));
console.dir(args);

var file = __dirname + './hello.mp3'; 	// default use the test file
var peak = 1;
var segments = 24;
var decimals = 3;
var delimiter = ";";
// parse args
if(args.f) file = args.f;
else { 
	console.log("usage: node soundforsticks.js -f [mp3 file path] -p [peak]  -s [segments] -d [decimals] -x [delimiter]" + '\n' +
		"example: node soundforsticks.js -f myfile.mp3 -p 1.5 -s 64 -d 3 -x ,");
}
var fs = require('fs');
if (fs.existsSync(file)) {
    Error("File not found: " + file);
}

// parse peak
if(args.p !== null) peak = parseFloat(args.p);

// parse segments
if(args.s !== null) segments = parseInt(args.s);

// parse decimals
if(args.d !== null) decimals = parseInt(args.d);

// parse delimiter
if(args.x !== null) delimiter = args.x;
console.log(args);

var options = {"ffmpegPath": ffmpegPath, "numOfSample" : segments};
waveform.getWaveForm( file, options, function(error, peaks){
	if(error){
		console.log("ERROR:");
		console.log(error);
        return;
    }
	
	// crude visualizer
	console.log("");
	console.log("Crude visualizer:")
	console.log("-------------------");
	console.log("");
	for (var index = 0; index < Math.round(peak); index++) {
		var line ="";
		for (var index2 = 0; index2 < peaks.length; index2++) {
			if(peaks[index2] > 1-(index / Math.round(peak)))
				line += "■";
			else	
				line += "_";
		}
		console.log(line);
	}
	
	// make value strings nice (proper decimal count)
	for (var index = 0; index < peaks.length; index++) {
		var val = peaks[index] * peak;
		var valstring = val.toFixed(decimals);
		peaks[index] = valstring;
	};

	// export data for spreadsheet
	console.log("");
	console.log("Spreadsheet export:")
	console.log("-------------------");
	for (var index = 0; index < peaks.length; index++) {
		console.log("["+(index+1)+"] "+'\t'+peaks[index]);
	}

	// export data as CSV
	console.log("");
	console.log("CSV:")
	console.log("-------------------");
	var result ="";
	if(!delimiter) delimiter =";";		// weird hack not sure why I need this...
	for (var index = 0; index < peaks.length; index++) {
		result += peaks[index]
		if(index < peaks.length - 1) result += delimiter;
	}
	console.log(result);
	
	console.log("");
	console.log("JSON:")
	console.log("-----");
	console.log(JSON.stringify(peaks));
});

