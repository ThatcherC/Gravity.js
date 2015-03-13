

//Simulates and draws Particles

//TODO: improve integration code. Why not add accelerations to both particles being compared?

var h = 1/200;
var context;
var particleList = new Array();
var context;
var frametime;
var starttime;
var width;
var height;
var startCoords = [-1,-1];
var endCoords = [-1,-1];
var newMass = 1000;
var onControlBox = false;

function init(){
	var canvas = document.getElementById("canvas");
	var div = document.getElementById("controlbox");
	canvas.width = window.innerWidth-30;
	canvas.height = window.innerHeight-20;
	width = canvas.width;
	height = canvas.height;
	context = canvas.getContext("2d");
	window.addEventListener('mousedown',mouseDownListener,false);
	div.onmouseover = function(){onControlBox=true;};
	div.onmouseout = function(){onControlBox=false;};
}

function main(){
	starttime = Date.now();
	integrate();
	draw();
	frametime = Date.now()-starttime;
}

function mouseDownListener(evt){
	if(!onControlBox){
		console.log("down");
		startCoords[0] = evt.clientX;
		startCoords[1] = evt.clientY;
		endCoords[0] = evt.clientX;
		endCoords[1] = evt.clientY
		window.addEventListener("mousemove", mouseMoveListener, false);
		window.addEventListener("mouseup", mouseUpListener, false);
	}
}

function mouseMoveListener(evt){
	endCoords[0] = evt.clientX;
	endCoords[1] = evt.clientY;
}

function mouseUpListener(evt){
	console.log("up");
	window.removeEventListener("mousemove", mouseMoveListener);
	window.removeEventListener("mouseup", mouseUpListener);
	var p = new Particle(newMass,startCoords[0],startCoords[1],(endCoords[0]-startCoords[0]),(endCoords[1]-startCoords[1]));
	particleList.push(p);
	startCoords = [-1,-1];
	endCoords = [-1,-1];
}

function setNewMass(m){
	console.log(m);
	newMass = m;
}

function integrate(){
	var newParticleList = new Array();
	for(var a = 0; a < particleList.length; a++){
		var particle = particleList[a];
		var sum_ax = 0;					//sum of x accelerations
		var sum_ay = 0;					//sum of y accelerations
		for(var b = 0; b < particleList.length; b++){
			otherParticle = particleList[b];
			if((particle != otherParticle) && !particle.collided && !otherParticle.collided){
				var dx = otherParticle.x - particle.x;
				var dy = otherParticle.y - particle.y;
				var displacementMagnitude = Math.sqrt(dx*dx + dy*dy);
				if(displacementMagnitude < particle.radius/1.5 + otherParticle.radius/1.5){
					particle.collided=true;
					otherParticle.collided=true;
					var totalMass = particle.mass+otherParticle.mass;
					var newParticle = new Particle(totalMass,
												   (particle.x*particle.mass + otherParticle.x*otherParticle.mass)/totalMass,
												   (particle.y*particle.mass + otherParticle.y*otherParticle.mass)/totalMass,
												   (particle.vx*particle.mass + otherParticle.vx*otherParticle.mass)/totalMass,
												   (particle.vy*particle.mass + otherParticle.vy*otherParticle.mass)/totalMass);
					newParticleList.push(newParticle);
				}
				var acceleration = otherParticle.mass/(displacementMagnitude*displacementMagnitude);
				sum_ax += acceleration*dx/displacementMagnitude;
				sum_ay += acceleration*dy/displacementMagnitude;
			}
		}
		particle.ax = sum_ax;
		particle.ay = sum_ay;
	}
	for(var i = 0; i < particleList.length; i++){
		particleList[i].vx += particleList[i].ax*h;
		particleList[i].vy += particleList[i].ay*h;
		particleList[i].x += particleList[i].vx*h;
		particleList[i].y += particleList[i].vy*h;
		if(particleList[i].collided || particleList[i].x<-50 || particleList[i].y<-50
						|| particleList[i].x>width+50 || particleList[i].y>height+50){
			particleList.splice(i,1);
			i--;
		}
	}
	Array.prototype.push.apply(particleList,newParticleList);
	
}

function draw(){
	context.clearRect(0,0,width,height);
	context.beginPath();
	context.moveTo(startCoords[0],startCoords[1]);
	context.lineTo(endCoords[0],endCoords[1]);
	context.strokeStyle="blue";
	context.strokeWidth=2;
	context.stroke();
	for(var i = 0; i < particleList.length; i++){
		var p = particleList[i];
		context.beginPath();
		context.arc(p.x,p.y,p.radius,0,Math.PI*2);
		context.closePath();
		context.strokeStyle = "#"+Math.round(p.color).toString(16);
		context.fillStyle = "#"+Math.round(p.color).toString(16);
		context.stroke();
		context.fill();
	}
}

