var Game2 = function (game, firebase) { };

var tries = 3;
var score = 0;
result_title = "Seconds to spot the eye : ";
g_name = 'game_2';


Game2.prototype = {

	create: function () {

		this.db = firebase.firestore();
		this.alive = true;
		this.perc = 1000;
		this.percx = 140;
		this.game.stage.backgroundColor = 'ffe8a3';

		// Sound for the buttons
		this.click = game.add.audio('click');
		this.mark = game.add.audio('mark');
		this.bgm = game.add.audio('bgm');
		this.switch = game.add.audio('switch');
		this.bgm.volume = 0.5;
		game.sound.setDecodedCallback([this.click, this.mark, this.bgm, this.switch], this.addButtons, this);


		var bg_t = game.add.image(0, 0, "timeline-bg");
		this.progress = game.add.image(0, 0, "timeline");
		this.progress.x = (this.game.world.width - bg_t.width) / 2;
		bg_t.x = (this.game.world.width - bg_t.width) / 2;
		bg_t.y = 35;
		this.progress.y = 35;

		this.chalks = this.game.add.group();
		this.chalks.createMultiple(3, 'chalk');

		this.chalks.children[0].reset(this.game.world.centerX - 100, bg_t.position.y + 50);
		this.chalks.children[1].reset(this.game.world.centerX, bg_t.position.y + 50);
		this.chalks.children[2].reset(this.game.world.centerX + 100, bg_t.position.y + 50);

		// Board 
		this.createBoard();
		this.createBlinder();

		this.blinder.play('initiate');
		// this.blinder.play('blindIt');   
		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.addButtons();

		this.game.time.events.loop(10, this.decrementerScore, this);
		this.game.time.events.loop(38000, this.bgm.play(), this);

		var popup = this.game.add.sprite(0, 0, "popup");

		this.game.input.keyboard.onPressCallback = function (aa) {

			if (aa === " " && game.paused) {
				popup.destroy();
				game.paused = false;
				whisile.play();
			}

			else if (aa === "esc" && game.paused) {
				this.stopSounds(); this.click.play(); this.game.state.start('MainMenu');
			}

		};

		this.game.paused = true;


	},
	addButtons: function () {

		game.add.button(20, 100, 'btn_home',
			() => {
				this.stopSounds(); this.click.play(); this.game.state.start('MainMenu');
			}, this, 1, 2);

		this.mute = game.add.button(20, 200, 'btn_mute', this.soundIt, this, 1, 0);
		this.mute.visible = false;

		this.sound = game.add.button(20, 200, 'btn_sound', this.muteIt, this, 1, 0);
	},

	muteIt: function () {
		this.sound.visible = false;
		this.mute.visible = true;
		this.click.play();
		this.bgm.pause();
	},

	soundIt: function () {
		this.mute.visible = false;
		this.sound.visible = true;
		this.click.play();
		this.bgm.play();
	},
	stopSounds: function () {
		this.click.pause();
		this.mark.pause();
		this.bgm.pause();
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
		if (this.alive)
			this.mark.play();

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
				this.gameOver();

			}, 200);

			this.add.tileSprite(e.position.x + e_x_1 + 5, e.position.y + e_y_1 + 10, 29, 17, "eye");

		}
		else {
 
			if (this.alive) {
				this.boardShake_y.resume();
				this.boardShake_x.resume();
				cross = this.game.add.sprite((e.position.x + x) - 15, (e.position.y + y) - 15, 'cross');
				cross.scale.setTo(2);
				cross.animations.add('initiate', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 20, false);
				cross.play('initiate');
			}
			tries--;

			if (!(tries < 0))
				this.chalks.children[tries].alpha = .40;

			if (tries == 0) {
				this.alive = false;
				this.blinder.play('shrink');
				this.boardShake_x.pause();
				this.boardShake_y.pause();
				setTimeout(() => {
					this.blinder.visible = false;
					this.gameOver();
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

	decrementerScore: function () {
		if (this.alive) {
			this.perc -= 2;
			this.percx += 0.03
			this.progress.width = this.perc;
			this.progress.x = this.percx;

			if (this.perc <= 0) {
				this.gameOver();
			}
		}
	},

	gameOver: function () {

		this.alive = false;
		this.postScore();
		this.stopSounds();

		setTimeout(() => {
			this.game.state.start('GameOver2');
		}, 1500);

	},

	postScore: function () {
		this.db.collection("pm_user").doc(window.localStorage.getItem('uid')).get().then(doc => {
			if (doc.exists) {
				const _total = parseInt(doc.data()['games'][`g_1`]) + parseInt(doc.data()['games'][`g_2`]) + parseInt(doc.data()['games'][`g_3`]) + parseInt(this.perc)
				this.db.collection("pm_user").doc(localStorage.getItem('uid'))
					.update(
						{
							[`games.g_2`]: parseInt(score) + parseInt(doc.data()['games'][`g_2`]),
							total: _total
						}
					);
			}
		});
	}
}
