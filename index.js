// var server = require('http').Server(app);
var mongo = require('mongoskin');
var poleCam = require('camPiper');

var db = mongo.db("mongodb://localhost:27017/images", {native_parser:true});
var poleCamImages = db.collection('poleCam', {strict: false});

var server = require('http').createServer(httpConnection);
server.listen(1338);


var httpConnection = function(req,res){
	console.log('A new connction has been made');
	res.end();
};


var saveImage = function(imageObject){
	var getDate = new Date();
	poleCamImages.insert({captureDate: getDate.getTime(),imgData:imageObject.imgData}, {w:1}, function(err,results){
		if (err){
			console.log('Error inserting image:',err);
		} else {
			console.log(getDate,' - Image Stored!');
		}
	});
};

// Set up an instance of CamPiper to rebroadcast the mjpeg stream to anyone who wants it.
poleCam.name = 'chickenCam';
poleCam.requestURL = 'http://70.113.19.166/image?speed=5';
poleCam.start();

console.log('server is running');

var imageReceiver = require('imageReceiver')(server,'chickenCam','http://localhost:1339',null);

var imageSocket = require('socket.io-client')('http://localhost:1338');
	imageSocket.on('connect', function(){
		console.log('\n\n','Connected over sockets!!!','\n\n');

		// imageSocket.on('speedTest',console.log);
		imageSocket.on('newImage',saveImage);

		imageSocket.on('disconnect', function(){
			console.log('Disconnected! at',(new Date()))
		});
});




