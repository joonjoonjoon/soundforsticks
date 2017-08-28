var waveform = require('waveform-node');
var ffmpegBinaries = require("ffmpeg-binaries")
var ffmpegPath = ffmpegBinaries.ffmpegPath() // Path to ffmpeg binary
var args = require('minimist')(process.argv.slice(2));
console.dir(args);

var file = __dirname + './hello.mp3'; 	// default use the test file
var peak = 1;
var segments = 24;
var decimals = 3;
var delimiter = ';';
// parse args
if(args.f) file = args.f;
else { 
	console.log("usage: node soundforsticks.js -f [mp3 file path] -p [peak]  -s [segments] -d [decimals] -del [delimiter]" + '\n' +
		"example: node soundforsticks.js -f myfile.mp3 -p 1.5 -s 64 -d 3 -del ,");
}
var fs = require('fs');
if (fs.existsSync(file)) {
    Error("File not found: " + file);
}

// parse peak
if(args.p) peak = parseFloat(args.p);

// parse segments
if(args.s) segments = parseInt(args.s);

// parse decimals
if(args.d) decimals = parseInt(args.d);

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
	for (var index = 0; index < 10; index++) {
		var line ="";
		for (var index2 = 0; index2 < peaks.length; index2++) {
			if(peaks[index2] > 1-(index / 10))
				line += "■";
			else	
				line += "_";
		}
		console.log(line);
	}

	// export data for spreadshset
	console.log("");
	console.log("Spreadsheet export:")
	console.log("-------------------");
	for (var index = 0; index < peaks.length; index++) {
		var val = peaks[index] * peak;
		console.log("["+(index+1)+"] "+'\t'+val.toFixed(decimals));
	}

	// export data as CSV
	console.log("");
	console.log("CSV:")
	console.log("-------------------");
	var result ="";
	for (var index = 0; index < peaks.length; index++) {
		var val = peaks[index] * peak;
		result += val.toFixed(decimals);
		if(index < peaks.length - 1) result += delimiter;
	}
	console.log(result);
});

