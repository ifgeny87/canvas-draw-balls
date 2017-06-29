const RoomController = {

	drawRequestId: null,    // номер подписки на эвент

	time: {
		start: performance.now(),   // время начала, мс
		last: null,         // предыдущая точка, мс
		now: null,          // текущее время обработки, мс
		length: .0,         // сколько всего прошло от начала, мс
		delta: .0           // дельта времени (now-last), мс
	},

	stats: {
		fps: .0,            // расчетная велинича fps
		delta10: .0         // fps будет считаться мягко - за 10 ходов
	},

	graph: {
		canvas: null,       // ссылка на канвас
		ctx: null           // ссылка на графический контекст
	},

	gameObjects: {
		images: {},         // в списке буду хранить картинки
		balls: []           // список мячей
	},

	ballCount: 5000,         // сколько мячей буду рисовать

	/**
	 * Инициализация контроллера
	 */
	init: function () {
		// запоминаю канву и контекст
		this.graph.canvas = document.getElementById('canvas');
		this.graph.ctx = this.graph.canvas.getContext('2d');

		// загружаю картинки
		let fish = new Image();
		fish.src = 'images/fish.jpg';
		this.gameObjects.images.fish = fish;

		let ball = new Image();
		ball.src = 'images/ball.png';
		this.gameObjects.images.ball = ball;

		// создаю объекты мячей
		for (let i = 0; i < this.ballCount; i++) {
			this.gameObjects.balls.push({
				x: Math.random() * this.graph.canvas.width,
				y: Math.random() * this.graph.canvas.height,
				speed: Math.random() / 20 + .05,
				size: Math.random() * 20 + 10
			});
		}

		this.nextstep();
	},

	/**
	 * Выполняется обновление комнаты и перерисовка объектов
	 */
	nextstep: function () {
		// пересчет времени
		this.time.last = this.time.now;
		this.time.now = performance.now();
		this.time.length = this.time.now - this.time.start;
		this.time.delta = this.time.now - this.time.last;

		const delta = this.time.delta;   // мс

		// обновление комнаты
		this.update(delta);

		// перерисовка комнаты
		this.redraw(delta);

		// подпишусь на событие перерисовки браузера
		this.drawRequestId = requestAnimationFrame(() => this.nextstep());
	},

	/**
	 * Обновление комнаты
	 * @param delta
	 */
	update: function (delta) {
		let status = document.getElementById('status');

		this.stats.delta10 = this.stats.delta10 * .9 + delta;
		this.stats.fps = 1000 / this.stats.delta10 * 10;
		let fps_str = this.stats.fps.toFixed(1);

		status.innerText = `D: ${delta.toFixed(1)}ms. FPS: ${fps_str}. Length: ${(this.time.length / 1000).toFixed(1)}s`;

		// обновление мячей
		for (let i in this.gameObjects.balls) {
			let ball = this.gameObjects.balls[i];
			// увеличиваю позицию по y
			ball.y += delta * ball.speed;
			// если мяч упал ниже экрана, то бросаю его выше экрана
			while (ball.y > this.graph.canvas.height) {
				ball.y -= this.graph.canvas.height + ball.size;
			}
		}
	},

	/**
	 * Отрисовка объектов комнаты
	 * @param delta
	 */
	redraw: function (delta) {
		// разобрать способ
		// this.ctx.save();
		// this.ctx.fillStyle = '#ffffff';
		// this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		// this.ctx.restore();

		// очистка фона
		// this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const ctx = this.graph.ctx;

		// рисую фоновую картинку
		ctx.beginPath();
		ctx.drawImage(this.gameObjects.images.fish, 0, 0);

		// размер картинки мяча
		let bw = this.gameObjects.images.ball.width,
			bh = this.gameObjects.images.ball.height;

		for (let i in this.gameObjects.balls) {
			ctx.beginPath();
			let ball = this.gameObjects.balls[i];
			ctx.rect(ball.x, ball.y, ball.size, ball.size);
			ctx.fillStyle = 'rgba(255, 255, 0, .5)';
			ctx.fill();
			ctx.strokeStyle = '#00ffff';
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.drawImage(this.gameObjects.images.ball,
				0, 0, bw, bh,   // clip от кратинки
				ball.x + 3, ball.y + 3, ball.size - 6, ball.size - 6);
		}
	},
};

window.onload = () => {
	RoomController.init();
};