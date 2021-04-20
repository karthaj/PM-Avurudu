var Game1 = function (game, firebase) { };

var score = 0;
result_title = "Your total meters : ";
g_name = 'game_1';

Game1.prototype = {

	create: function () {

		this.db = firebase.firestore();

		this.alive = true;
		this.obstacleVelocity = -700;
		this.rate = 1500;
		score = 0;

		// Sound for the buttons
		this.click = game.add.audio('click');
		this.jump = game.add.audio('jump');
		this.hurt = game.add.audio('hurt');
		this.cheer = game.add.audio('cheer');
		var whisile = game.add.audio('whisile');
		this.cheer.volume = 0.2;
		this.jump.volume = 0.6;
		this.bgm = game.add.audio('bgm');
		this.bgm.volume = 0.5;
		game.sound.setDecodedCallback([this.click, this.jump, this.hurt, this.cheer, this.whisile, this.bgm], this.addButtons, this);

		this.tileWidth = this.game.cache.getImage('tile').width;
		this.tileHeight = 100;
		this.boxHeight = this.game.cache.getImage('box').height;

		// Images
		this.game.stage.backgroundColor = 'ffe8a3';
		this.bg = this.add.tileSprite(0, this.game.world.height - 250, 2000, 0, "bg-track");
		this.sccorePanel = this.add.sprite(0, 0, "top-score-panel");
		this.sccorePanel.x = 10;
		this.sccorePanel.y = 10;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.floor = this.game.add.group();
		this.floor.enableBody = true;
		this.floor.createMultiple(Math.ceil(this.game.world.width / this.tileWidth));

		this.boxes = this.game.add.group();

		this.boxes.enableBody = true;
		this.boxes.createMultiple(20, 'box');
		this.game.world.bringToTop(this.floor);


		this.jumping = false;

		this.addBase();
		this.createScore();
		this.createPlayer();
		this.addButtons();
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.obsPlacer = this.game.time.events.loop(this.rate, this.addObstacles, this);
		this.game.time.events.loop(100, this.incrementScore, this);
		this.game.time.events.loop(3700, this.cheers, this);
		this.game.time.events.loop(38000, this.bgm.play(), this);

		var popup = this.game.add.sprite(0, 0, "popup");

		this.game.input.keyboard.onPressCallback = function (e) {
			if (game.paused) {
				popup.destroy();
				game.paused = false;
				whisile.play();
			}
		};

		this.game.paused = true;

		this.cheers();
	},

	update: function () {


		this.game.physics.arcade.collide(this.player, this.floor);

		this.game.physics.arcade.collide(this.player, this.boxes, this.gameOver, null, this);

		// If the player is only touching the ground let him jump
		var onTheGround = this.player.body.touching.down;
		this.bg.autoScroll(this.obstacleVelocity, 0)

		if (onTheGround && this.cursors.up.isDown && this.alive) {
			this.jump.play();
			this.player.body.velocity.y = -1650;
			this.player.play('jump');
		}
		// Crouch!
		else if (!onTheGround && this.cursors.down.isDown && this.alive) {
			this.player.body.velocity.y = 1200;
			this.click.play();

		}
		else if (onTheGround && this.alive) {

			this.player.play('jog');

		}

		if (score > 50 && score < 100) {
			this.obsPlacer.delay = Math.floor(Math.random() * (1000 - 700)) + 700;
		}
		else if (score > 200 && score < 300) {
			this.obsPlacer.delay = Math.floor(Math.random() * (1000 - 850)) + 850;
		}
		else if (score > 300 && score < 400) {
			this.obsPlacer.delay = Math.floor(Math.random() * (1000 - 800)) + 800;
		}
		else if (score > 500) {
			this.obsPlacer.delay = Math.floor(Math.random() * (1000 - 900)) + 900;
		}



	},

	addButtons: function () {


		game.add.button(this.game.world.width - 120, 30, 'btn_home',
			() => {
				this.bgm.pause(); this.click.play(); this.game.state.start('MainMenu')
			}, this, 1, 2);

		this.mute = game.add.button(this.game.world.width - 120, 120, 'btn_mute', this.soundIt, this, 1, 2);
		this.mute.visible = false;

		this.sound = game.add.button(this.game.world.width - 120, 120, 'btn_sound', this.muteIt, this, 1, 2);

	},

	soundIt: function () {
		this.sound.visible = true;
		this.mute.visible = false;
		this.click.play();
		this.bgm.play();
	},

	muteIt: function () {
		this.mute.visible = true;
		this.sound.visible = false;
		this.bgm.pause();
		this.cheer.pause();
	},

	cheers: function () {
		this.cheer.play()

	}

	,

	addObstacles: function () {
		// 	var tilesNeeded = Math.floor( Math.random() * (2 - 0));
		// 	var gap = Math.floor( Math.random() * (tilesNeeded - 0));
		this.addBox(this.game.world.width, (this.game.world.height - this.tileHeight) - this.boxHeight);
		this.obstacleVelocity -= 17;

	},

	addBox: function (x, y) {

		var tile = this.boxes.getFirstDead();

		tile.reset(x, y);
		tile.body.velocity.x = this.obstacleVelocity;
		tile.body.immovable = true;
		tile.checkWorldBounds = true;
		tile.outOfBoundsKill = true;
		// tile.body.friction.x = 1000;

	},

	addTile: function (x, y) {

		var tile = this.floor.getFirstDead();

		tile.reset(x, y);
		// tile.body.velocity.y = me.vel;
		tile.body.immovable = true;
		tile.checkWorldBounds = true;
		tile.outOfBoundsKill = true;
		// tile.body.friction.x = 1000;
	},

	addBase: function () {
		var tilesNeeded = Math.ceil(this.game.world.width / this.tileWidth);
		var y = (this.game.world.height - this.tileHeight);

		for (var i = 0; i < tilesNeeded; i++) {

			this.addTile(i * this.tileWidth, y);

		}
	},



	createPlayer: function () {

		this.player = this.game.add.sprite(this.game.world.width / 5.5, this.game.world.height -
			this.tileHeight, 'iman');
		this.player.scale.setTo(1);
		this.player.anchor.setTo(0.5, 1.0);
		this.game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 8200;
		this.player.body.collideWorldBounds = true;
		this.player.body.bounce.y = 0.1;
		this.player.body.width = 30;

		this.player.animations.add('jog', [5, 4, 3, 2, 1, 0], 10, true);
		this.player.animations.add('jump', [6, 7, 8, 9, 10, 11], 10, true);
		this.player.animations.add('hurt', [12, 13, 14, 15, 16, 17], 10, true);


		this.player.play('hurt');


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

		if (window.localStorage.getItem('game_1') == null) {
			this.highScore.setText(0);
			window.localStorage.setItem('game_1', 0);
		}
		else {
			this.highScore.setText(window.localStorage.getItem('game_1'));
		}
		// this.scoreLabel.bringToTop()

	},

	incrementScore: function () {
		if (this.alive) {
			score += 2;
			this.scoreLabel.setText(score);
			this.game.world.bringToTop(this.scoreLabel);
			// this.highScore.setText("HS: " + window.localStorage.getItem('game_1'));
			this.game.world.bringToTop(this.highScore);
		}
	},

	gameOver: function () {
		this.cheer.pause()
		this.bgm.pause()

		if (this.alive) {

			this.hurt.play();
			this.alive = false;
			this.postScore();
			this.game.state.start('GameOver1');

		}
	},

	postScore: function () {
		this.db.collection("pm_user").doc(window.localStorage.getItem('uid')).get().then(doc => {
			if (doc.exists) {
				const _total = parseInt(doc.data()['games'][`g_1`]) + parseInt(doc.data()['games'][`g_2`]) + parseInt(doc.data()['games'][`g_3`]) + parseInt(score);
				this.db.collection("pm_user").doc(localStorage.getItem('uid'))
					.update(
						{
							[`games.g_1`]: parseInt(score) + parseInt(doc.data()['games'][`g_1`]),
							total: _total
						}
					);
			}
		});
	}
};
