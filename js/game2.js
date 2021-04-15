var Game2 = function (game, firebase) { };

var tries = 3;
var score = 0;
result_title = "Seconds to spot the eye : ";

Game2.prototype = {

	create: function () {

		this.db = firebase.firestore();

		this.game.stage.backgroundColor = 'ffe8a3';

		// Board 
		this.createBoard();
		this.createBlinder();


		this.blinder.play('initiate');
		// this.blinder.play('blindIt');   
		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.createScore();

		this.game.time.events.loop(100, this.incrementScore, this);

	},

	update: function () {

		if (this.cursors.right.isDown) {
			this.boardShake_x.pause();
			this.boardShake_y.pause();
		} else if (this.cursors.left.isDown) {
			this.boardShake_x.resume();
			this.boardShake_y.resume();
		}

	},

	render: function () {

	},

	createScore: function () {

		var scoreFont = "50px Mali";

		this.scoreLabel = this.game.add.text(400, 55, "0", { font: scoreFont, fill: "#000" });
		this.scoreLabel.anchor.setTo(0.5, 0.5);
		this.scoreLabel.align = 'center';
		this.game.world.bringToTop(this.scoreLabel);

		this.highScore = this.game.add.text(180, 55, "0", { font: scoreFont, fill: "#000" });
		this.highScore.anchor.setTo(0.5, 0.5);
		this.highScore.align = 'right';
		this.game.world.bringToTop(this.highScore);

		if (window.localStorage.getItem('HighScore') == null) {
			this.highScore.setText(0);
			window.localStorage.setItem('HighScore', 0);
		}
		else {
			this.highScore.setText(window.localStorage.getItem('HighScore'));
		}
		// this.scoreLabel.bringToTop()

	},

	createBoard: function () {
		this.board = game.add.sprite(0, (this.game.world.centerX / 4), 'board');

		this.board.scale.setTo(1.5);
		this.board.x = (this.game.world.width / 10);

		this.boardShake_x = game.add.tween(this.board).to(
			{ x: (this.game.world.width / 6 * 2) }, 1450, "Sine.easeInOut", true, 0, -1, true);
		this.boardShake_y = game.add.tween(this.board).to(
			{ y: this.board.y + 30 }, 750, "Sine.easeInOut", true, 0, -1, true);

		this.board.inputEnabled = true;
		this.board.input.pixelPerfectOver = true;
		this.board.input.useHandCursor = true;

		this.board.events.onInputDown.add(this.setEyeMark, this);
	},

	setEyeMark: function (e) {
		const x = parseFloat(e.input._pointerData[0].x);
		const y = parseFloat(e.input._pointerData[0].y);

		const e_x_1 = (this.board.width / 4.3333);
		const e_x_2 = (this.board.width / 3.5777);
		const e_y_1 = (this.board.height / 3.5094);
		const e_y_2 = (this.board.height / 2.8181);


		if ((x > e_x_1 && x < e_x_2) && (y > e_y_1 && y < e_y_2)) {

			this.boardShake_y.pause();
			this.boardShake_x.pause();
			this.blinder.play('shrink');

			setTimeout(() => {
				this.blinder.visible = false;
			}, 200);

			this.add.tileSprite(e.position.x + e_x_1 + 5, e.position.y + e_y_1 + 10, 29, 17, "eye");

		}
		else {
			this.boardShake_y.resume();
			this.boardShake_x.resume();

			this.cross = this.game.add.sprite((e.position.x + x) - 15, (e.position.y + y) - 15, 'cross');
			this.cross.scale.setTo(2);
			this.cross.animations.add('initiate', [0, 1, 2, 3, 4], 20, false);
			this.cross.play('initiate');
			tries--;
			if (tries == 0) {
				this.blinder.play('shrink');

				setTimeout(() => {
					this.blinder.visible = false;
					this.gameOver()
				}, 240);
			}
		}
	},

	createBlinder: function () {

		this.blinder = this.game.add.sprite(-(this.game.world.centerX / 5), this.game.world.centerY / 2, 'blind_fold');

		this.blinder.scale.setTo(1.9, 2);

		this.blinder.animations.add('initiate', [0, 1, 2, 3, 4, 5, 6], 19, false);
		this.blinder.animations.add('shrink', [6, 5, 4, 3, 2, 1, 0], 26, false);

	},

	incrementScore: function () {
		if (this.alive) {
			score += 1;
			this.scoreLabel.setText(score);
			this.game.world.bringToTop(this.scoreLabel);
			this.highScore.setText("HS: " + window.localStorage.getItem('HighScore'));
			this.game.world.bringToTop(this.highScore);
		}
	},

	gameOver: function () {

		this.alive = false;
		this.postScore();

		setTimeout(() => {
			this.game.state.start('GameOver');
		}, 400);
	},

	postScore: function () {
		this.db.collection("pm_user").doc(localStorage.getItem('uid'))
			.update({ [`games.g_2`]: score });
	}

};
