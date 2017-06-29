const RoomController = {
	goalUps: 50.0,			// как часто будет вызываться update
	
	realFps: .0,			// реальный ups
	
	timer: null,			// данные таймера
	
	timerId: null,
	
	drawRequestId: null,
	
	draws: 0,
	
	time: {
		start: +Date.now(),	// врем€ старта
		now: +Date.now(),	// последн€€ точка времени
		length: .0,			// врем€ жизни
		last: +Date.now(),	// текущее врем€
		delta: .0			// дельта с последнего вызова
	},
	
	stateLength: +Date.now(),
	
	paused: false,
	
	size: null,
	
	canvas: null,
	
	ctx: null,
	
	quadCount: 150,
	
	quads: [],
	
	fish: null,
	
	ball: null,
	
	init: function() {
		this.canvas = document.getElementById('canvas');
		this.ctx = this.canvas.getContext('2d');
		
		this.timer = {
			id: null,
			timePerFrame: 1000 / this.goalFps
		};
		
		this.fish = new Image();
		this.fish.src = 'images/fish.jpg';
		
		this.ball = new Image();
		this.ball.src = 'images/ball.png';
		
		for(let i = 0; i < this.quadCount; i++) {
			this.quads.push({
				x: Math.random() * this.canvas.width,
				y: Math.random() * this.canvas.height,
				speed: Math.random() + .5,
				size: Math.random() * 20 + 10
			});
		}
		
		this.nextstep();
		
		this.redraw();
	},
	
	nextstep: function() {
		this.time.last = this.time.now;
		this.time.now = +Date.now();
		this.time.length = this.time.now - this.time.start;
		this.time.delta = this.time.now - this.time.last;
		
		this.update(this.paused ? .0 : this.time.delta / 1000);
		
		this.realFps = 1000 / this.time.delta;
		
		this.timer.id = setTimeout(this.nextstep.bind(this), this.timer.timePerFrame);
	},
	
	update: function(delta) {
		var status = document.getElementById('status');
		var fps = this.draws / this.time.length * 1000;
		status.innerText = `D: ${delta}ms. FPS: ${this.realFps.toString().substr(0, 5)}. Draws: ${this.draws}. FPS draws: ${fps.toString().substr(0, 5)}. Length: ${(this.time.length / 1000).toString().substr(0, 6)}s`;
		
		for(let i in this.quads) {
			let quad = this.quads[i];
			quad.y += delta * 100 * quad.speed;
			while(quad.y > this.canvas.height) {
				quad.y -= this.canvas.height;
			}
		}
	},
	
	redraw: function() {
		// отрисовка
		this.draws++;
		
		//this.ctx.save();
		//this.ctx.fillStyle = '#ffffff';
		//this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		//this.ctx.restore();
		
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.ctx.beginPath();
		this.ctx.drawImage(this.fish, 0, 0);
		
		let bw = this.ball.width,
			bh = this.ball.height;
		
		for(let i in this.quads) {
			this.ctx.beginPath();
			let quad = this.quads[i];
			this.ctx.rect(quad.x, quad.y, quad.size, quad.size);
			this.ctx.fillStyle = 'rgba(255, 255, 0, .5)';
			this.ctx.fill();
			this.ctx.strokeStyle = '#00ffff';
			this.ctx.lineWidth = 2;
			this.ctx.stroke();
			
			this.ctx.drawImage(this.ball, 0, 0, bw, bh, quad.x+3, quad.y+3, quad.size-6, quad.size-6);
		}
		
		// после перерисовки вызываетс€ запрос на перерисовку
		this.drawRequestId = requestAnimationFrame(this.redraw.bind(this));
	},
	
	animate: function(callback, duration) {
		var start = performance.now();
		
		
	},
};

window.onload = () => {RoomController.init();}