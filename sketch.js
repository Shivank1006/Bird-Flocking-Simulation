// Shivank Sharma
// Based on Boids Algorithm by Craig Reynolds.
// Implemented in p5.js


const flock = [];

let canvas, alignSlider, cohesionSlider, separationSlider;

function setup(){
	canvas = createCanvas(windowWidth * 0.8, windowHeight * 0.8);
	canvas.parent('#canvas');

	alignSlider = createSlider(0, 3, 1, 0.1);
	alignSlider.parent("#slider1");

	cohesionSlider = createSlider(0, 3, 1, 0.1);
	cohesionSlider.parent("#slider2");

	separationSlider = createSlider(0, 4, 1, 0.1);
	separationSlider.parent("#slider3");

	for(let i=0; i<100; i++){
		flock.push(new Boid());
	}
}

function draw(){
	background(130);
	for(let boid of flock){
		boid.flock(flock);
		boid.show();
	}

	for(let boid of flock){
		boid.update();
	}
}