class Boid{

	// Assigning parameters to each boid
	constructor(){
		this.position = createVector(width/2, height/2);
		this.velocity = p5.Vector.random2D();
		this.velocity.setMag(random(3, 5));
		this.acceleration = createVector();
		this.maxForce = 0.04;
		this.maxSpeed = 4;
		this.col = color(random(255), random(255), random(255), 200);
	}

	// Alignment steering behaviour
	// Steering towards the average heading 
	// of local flockmates.
	align(boids){
		let perceptionRadius = 150;
		let total = 0;
		let steering = createVector();
		for(let other of boids){
			let d = dist(
				this.position.x, 
				this.position.y, 
				other.position.x, 
				other.position.y
			);
			if(other!== this && d < perceptionRadius){
				steering.add(other.velocity);
				total++;
			}
		}
		if(total > 0){
			steering.div(total);
			steering.setMag(this.maxSpeed);
			steering.sub(this.velocity);
			steering.limit(this.maxForce);
		}
		return steering;
	}

	// Cohesion steering behaviour
	// Steer to move toward the average 
	// position of local flockmates.
	cohesion(boids){
		let perceptionRadius = 100;
		let total = 0;
		let steering = createVector();
		for(let other of boids){
				let d = dist(
					this.position.x, 
					this.position.y, 
					other.position.x, 
					other.position.y
				);
				if(other!== this && d < perceptionRadius){
					steering.add(other.position);
					total++;
				}
		}
		if(total > 0){
			steering.div(total);
			steering.sub(this.position);
			steering.setMag(this.maxSpeed);
			steering.sub(this.velocity);
			steering.limit(this.maxForce);
		}
		return steering;
	}

	// Separation steering behaviour
	// Steering to avoid crowding local flockmates
	separation(boids){
		let perceptionRadius = 100;
		let total = 0;
		let steering = createVector();
		for(let other of boids){
				let d = dist(
					this.position.x, 
					this.position.y, 
					other.position.x, 
					other.position.y
				);
				if(other!== this && d>0 && d < perceptionRadius){
					let diff = p5.Vector.sub(this.position, other.position);
					diff.div(d)
					steering.add(diff);
					total++;
				}
		}
		if(total > 0){
			steering.div(total);
			steering.setMag(this.maxSpeed);
			steering.sub(this.velocity);
			steering.limit(this.maxForce);
		}
		return steering;
	}

	// Calculatig the steering for three behaviours
	// and adding it to the acceleartion
	flock(boids){
		let alignment = this.align(boids);
		let cohesion = this.cohesion(boids);
		let separation = this.separation(boids);

		alignment.mult(alignSlider.value());
		cohesion.mult(cohesionSlider.value());
		separation.mult(separationSlider.value());

		this.acceleration = alignment;
		this.acceleration.add(cohesion);
		this.acceleration.add(separation);

		// Avoiding the walls by adding a force
		// towards the center if a boid crosses the border
		let border = 100;
		if(this.position.x < border || this.position.x > width-border || this.position.y < border || this.position.y > height-border){
			let center = createVector(random(width/4, 3*(width/4)), random(height/4, 3*(height/4)));
			center.sub(this.position);
			center.setMag(this.maxSpeed * 5);
			center.limit(this.maxForce * 5);
			this.acceleration.add(center);
		}
	}

	// Updating parameters of each boid
	update(){
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
	}

	// Showing each boid
	show(){
		push();
		translate(this.position.x, this.position.y);
		rotate(this.velocity.heading());
		noStroke();
		fill(this.col);
		triangle(8, 0, -7, 5, -7, -5);
		pop();
	}
}