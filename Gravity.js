

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

function init(){
	//particleList[0] = new Particle(1000000,200,300,0,0);
	//particleList[1] = new Particle(10000,20,20,50,20);
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth-10;
	canvas.height = window.innerHeight *.9 -10;
	width = canvas.width;
	height = canvas.height;
	context = canvas.getContext("2d");
}

function main(){
	starttime = Date.now();
	integrate();
	draw();
	frametime = Date.now()-starttime;
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
		if(particleList[i].collided || particleList[i].x < -100 || particleList[i].y < -100){
			particleList.splice(i,1);
			i--;
		}
	}
	Array.prototype.push.apply(particleList,newParticleList);
	
}

function draw(){
	context.clearRect(0,0,width,height);
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

function clear(){
	particleList = new Array();
}
