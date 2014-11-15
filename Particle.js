//A Javascript implementation of http://www.nowykurier.com/toys/gravity/src.zip - Particle.as
//This project aims to recreate nowykurier's famous Gravity Toy, found here:
//http://www.nowykurier.com/toys/gravity/gravity.html


function Particle(mass, x, y, vx, vy){
	this.mass = mass;
	this.x = x;				//x coordinate
	this.y = y;				//y coordinate
	this.px = x;			//previous x coordinate	- used only with paths
	this.py = y;			//previous y coordinate - used only with paths
	this.vx = vx;			//x component of velocity
	this.vy = vy;			//y component of velocity
	this.ax = 0;			//x component of acceleration
	this.ay = 0;			//y component of acceleration
	this.collided = false;
	this.color = 0xFF0000;
	this.color += ((0x00FF00>>8)/(1+Math.pow(mass/100000, 1)))<<8;	//is pow necessary?
	this.color += 0x0000FF/(1+Math.pow(mass/10000, 1));				//is pow necessary?
	this.radius = Math.log(Math.E+mass/1000);
}
