var Game2 = function (game, firebase) { };

var tries = 3;
var score = 0;


Game2.prototype = {

	create: function () {

		this.db = firebase.firestore();
		this.alive = true;
		this.perc = 1000;
		this.percx = 140;
		this.game.stage.backgroundColor = 'ffe8a3';
		this.game.add.image(0, 0, 'bg-aliya');
		tries = 3;
		score = 0;

		// Sound for the buttons
		this.click = game.add.audio('click');
		this.mark = game.add.audio('mark');
		this.bgm = game.add.audio('bgm');
		this.switch = game.add.audio('switch');
		this.whisile = game.add.audio('whisile');
		this.bgm.volume = 0.5;

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

		// this.blinder.play('blindIt');   
		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.addButtons();

		this.game.time.events.loop(10, this.decrementerScore, this);
		this.game.time.events.loop(38000, this.bgms, this);

		this.bgm.play();

	},
	addButtons: function () {

		game.add.button(20, 0, 'btn_home',
			() => {
				this.stopSounds(); this.click.play(); this.game.state.start('MainMenu');
			}, this, 1, 2);

		this.mute = game.add.button(20, 100, 'btn_mute', this.soundIt, this, 1, 0);
		this.mute.visible = false;

		this.sound = game.add.button(20, 100, 'btn_sound', this.muteIt, this, 1, 0);
	},

	bgms: function () {
		if (this.sound.visible)
			this.bgm.play();
		else
			this.bgm.pause();
	},
	soundIt: function () {
		this.mute.visible = false;
		this.sound.visible = true;
		this.click.play();
		this.bgm.play();
	},

	muteIt: function () {
		this.sound.visible = false;
		this.mute.visible = true;
		this.bgm.pause();
	},


	stopSounds: function () {
		this.click.pause();
		this.mark.pause();
		this.bgm.pause();
	},
	createBoard: function () {


		if (window.localStorage.getItem("uid") != null) {
			this.db.collection("pm_user").doc(window.localStorage.getItem('uid')).get().then(doc => {
				var _total = 0;
				if (doc.exists) {
					_total = (parseInt(doc.data()['games'][`g_1`]) + parseInt(doc.data()['games'][`g_2`]) + parseInt(doc.data()['games'][`g_3`]) + parseInt(score)) / 100;
				}

				this.board = game.add.sprite(Math.floor(Math.random() * (50 - 1 + 1) + 0), 200, 'board');
				this.board.scale.setTo(1.5);
 

				if (_total > 50000) {

					this.board.x = (this.game.world.width / Math.floor(Math.random() * (4 - 1 + 1) + 2));

					this.boardShake_x = game.add.tween(this.board).to(
						{ rotation: 0.05, x: (this.game.world.centerX / Math.floor(Math.random() * (8 - 1 + 1) + 2) * 2) }, Math.floor(Math.random() * (745 - 1 + 1) + 596), "Sine.easeInOut", true, 0, -1, true);
					this.boardShake_y = game.add.tween(this.board).to(
						{ rotation: 0.099, y: this.board.y + Math.floor(Math.random() * (20 - 1 + 1) + 10) }, Math.floor(Math.random() * (517 - 1 + 1) + 421), "Sine.easeInOut", true, 0, -1, true);

				} else {

					this.board.x = (this.game.world.width / 10);

					this.boardShake_x = game.add.tween(this.board).to({ x: (this.game.world.width / 6 * 2) }, 945, "Sine.easeInOut", true, 0, -1, true);

					this.boardShake_y = game.add.tween(this.board).to({ y: this.board.y + 30 }, 617, "Sine.easeInOut", true, 0, -1, true);
				}

				this.board.inputEnabled = true;
				this.board.input.pixelPerfectOver = true;
				this.board.input.useHandCursor = true;

				this.board.events.onInputDown.add(this.setEyeMark, this);

				this.createBlinder();
				this.blinder.play('initiate');
				this.whisile.play();



			}).catch(
				(err) => {
					console.log(err);
				}
			)
		} else {
			window.localStorage.clear();
			window.location.reload();
		}
	},

	setEyeMark: function (e) {


		const x = parseFloat(e.input._pointerData[0].x);
		const y = parseFloat(e.input._pointerData[0].y);

		const e_x_1 = (this.board.width / 4.3333);
		const e_x_2 = (this.board.width / 3.5777);
		const e_y_1 = (this.board.height / 3.5094);
		const e_y_2 = (this.board.height / 2.8181);

		if ((x > e_x_1 && x < e_x_2) && (y > e_y_1 && y < e_y_2) && this.alive) {
			this.mark.play();
			this.boardShake_y.pause();
			this.boardShake_x.pause();
			this.blinder.play('shrink');

			setTimeout(() => {
				this.blinder.visible = false;
				score = this.perc;
				this.gameOver();

			}, 200);

			this.add.tileSprite(e.position.x + e_x_1 + 5, e.position.y + e_y_1 + 10, 29, 17, "eye");

		}
		else {

			if (this.alive) {
				this.mark.play();
				this.boardShake_y.resume();
				this.boardShake_x.resume();
				cross = this.game.add.sprite((e.position.x + x) - 15, (e.position.y + y) - 15, 'cross');
				cross.scale.setTo(2);
				cross.animations.add('initiate', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 20, false);
				cross.play('initiate');
			}
			tries--;

			if (!(tries < 0) && this.alive)
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
		if (window.localStorage.getItem("uid") != null) {
			this.db.collection("pm_user").doc(window.localStorage.getItem('uid')).get().then(doc => {
				if (doc.exists) {
					const _total = parseInt(doc.data()['games'][`g_1`]) + parseInt(doc.data()['games'][`g_2`]) + parseInt(doc.data()['games'][`g_3`]) + parseInt(this.perc)
					window.localStorage.setItem(`overall_score`, _total);
					this.db.collection("pm_user").doc(localStorage.getItem('uid'))
						.update(
							{
								[`games.g_2`]: parseInt(score) + parseInt(doc.data()['games'][`g_2`]),
								total: _total
							}
						);

				}
			}).catch((err) => {
				console.log(err);
				alert("Something seems off. Please reload.");
				window.location.reload();

			});
		} else {
			window.location.reload();
		}
	}
}
