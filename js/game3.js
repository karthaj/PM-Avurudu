var Game3 = function (game, firebase) { };

var score = 0;
 
Game3.prototype = {


	create: function () {

		this.db = firebase.firestore();

		this.alive = true;

		this.obstacleVelocity = -500;
		this.rate = 1500;
		score = 0;

		// Sound for the buttons
		this.click = game.add.audio('click');
		this.slip = game.add.audio('slip');
		this.switch = game.add.audio('switch');
		this.cheer = game.add.audio('cheer');
		this.cheer.volume = 0.3; var whisile = game.add.audio('whisile');
		this.bgm = game.add.audio('bgm');
		this.bgm.volume = 0.5;
		game.sound.setDecodedCallback([this.click, this.slip, this.switch, this.cheer, this.whisile, this.bgm], this.addButtons, this);

		this.tileWidth = this.game.cache.getImage('tree').width; this.tileHeight = 100;
		this.boxHeight = this.game.cache.getImage('box').height;

		// Images
		this.game.stage.backgroundColor = 'ffe8a3';
		this.bg = this.add.tileSprite(this.game.world.centerX - (this.tileWidth / 2), 0, this.tileWidth, 10000, "tree");

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.floor = this.game.add.group();
		this.floor.enableBody = true;
		this.floor.createMultiple(Math.ceil(this.game.world.width / this.tileWidth), 'tree');

		this.boxes = this.game.add.group();

		this.boxes.enableBody = true;
		this.boxes.createMultiple(20, 'box');
		this.game.world.bringToTop(this.floor);

		this.sccorePanel = this.add.sprite(0, 0, "top-score-panel");
		this.sccorePanel.x = 10;
		this.sccorePanel.y = 10;

		this.jumping = false;

		this.createScore();
		this.createPlayer();
		this.addButtons();
		this.cursors = this.game.input.keyboard.createCursorKeys();

		var gapX = this.game.cache.getImage('popup').width;
		var popup = this.game.add.sprite(this.game.world.centerX - (gapX / 2), 0, "popup");


		this.obsPlacer = this.game.time.events.loop(this.rate, this.addObstacles, this);
		this.game.time.events.loop(100, this.incrementScore, this);
		this.game.time.events.loop(3700, this.cheers, this);
		this.game.time.events.loop(38000, this.bgms, this);


		this.game.input.keyboard.onPressCallback = function (aa) {
			if (aa === " " && game.paused) {
				popup.destroy();
				game.paused = false; whisile.play();
			}
			else if (aa === "esc" && game.paused) {
				this.stopSounds(); this.click.play(); this.game.state.start('MainMenu');
			}
		};
		this.game.paused = true;
		this.cheers();

	},

	update: function () {

		this.game.physics.arcade.collide(this.player, this.floor);
		this.game.physics.arcade.collide(this.player, this.boxes, this.gameOver, null, this);

		this.bg.autoScroll(0, -this.obstacleVelocity);
		1

		// Right!
		if (this.cursors.right.isDown && this.player.body.offset.x != 55) {
			this.switch.play(); this.player.x = this.game.world.centerX - ((this.tileWidth / 2.5) * 3);
			this.player.play('climb-right');
			this.player.body.offset.x = 55;

		}
		// Left!
		if (this.cursors.left.isDown && this.player.body.offset.x != 0) {
			this.switch.play(); this.player.x = this.game.world.centerX - (this.tileWidth * 2);
			this.player.play('climb-left');
			this.player.body.offset.x = 0;

		}

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
		this.bgm.pause();
		this.cheer.pause();

	},

	soundIt: function () {
		this.mute.visible = false;
		this.sound.visible = true;
		this.bgm.play();
		this.click.play();
	},

	bgms: function () {
		if (this.sound.visible)
			this.bgm.play()
		else
			this.bgm.pause()
	},

	cheers: function () {

		if (this.sound.visible && this.alive)
			this.cheer.play()
		else
			this.cheer.pause()
	},
	stopSounds: function () {
		this.click.pause();
		this.cheer.pause();
		this.bgm.pause();
	},
	addBox: function (x, y) {

		var tile = this.boxes.getFirstDead();

		tile.reset(x, y);
		tile.body.velocity.y = -this.obstacleVelocity;
		tile.body.immovable = true;
		tile.checkWorldBounds = true;
		tile.outOfBoundsKill = true;
		// tile.body.friction.x = 1000;

	},

	addObstacles: function () {
		if (Math.floor(Math.random() * (3 - 1 + 1) + 1) == 1) {
			this.addObstaclesRight();
		} else {
			this.addObstaclesLeft();
		}
	},

	addObstaclesLeft: function () {

		// 	var tilesNeeded = Math.floor( Math.random() * (2 - 0));
		// 	var gap = Math.floor( Math.random() * (tilesNeeded - 0));
		this.addBox(this.game.world.centerX - ((this.tileWidth / 2.6) * 4), -50);
		this.obstacleVelocity -= 17;
	},
	addObstaclesRight: function () {
		// 	var tilesNeeded = Math.floor( Math.random() * (2 - 0));
		// 	var gap = Math.floor( Math.random() * (tilesNeeded - 0));
		this.addBox(this.game.world.centerX + ((this.tileWidth / 2.35)), -50);
		this.obstacleVelocity -= 17;
	},

	createPlayer: function () {

		this.player = this.game.add.sprite(this.game.world.centerX - ((this.tileWidth / 2.5) * 3), this.game.world.height -
			(this.tileHeight * 2), 'player_climber');
		this.player.scale.setTo(2, 2);
		this.game.physics.arcade.enable(this.player);
		this.player.animations.add('climb-right', [0, 1, 2, 3, 4], 5, true);
		this.player.animations.add('climb-left', [5, 6, 7, 8, 9], 5, true);
		this.player.play('climb-right');
		this.player.body.setSize(50, 100);
		this.player.y = this.game.world.centerY + (this.tileWidth / 2);
		this.player.body.offset.x = 55;
		this.player.body.offset.y = 10;

		this.game.debug.body(this.player);

	},

	createScore: function () {


		var scoreFont = "50px Mali";

		this.scoreLabel = this.game.add.text(250, 55, "0", { font: scoreFont, fill: "#000" });
		this.scoreLabel.anchor.setTo(0.5, 0.5);
		this.scoreLabel.align = 'center';
		this.game.world.bringToTop(this.scoreLabel);

	},

	incrementScore: function () {
		if (this.alive) {
			score += 2;
			this.scoreLabel.setText(score);
			this.game.world.bringToTop(this.scoreLabel);
		}
	},

	gameOver: function () {
		this.stopSounds();
		this.alive = false;
		this.player.alpha = .7
		this.slip.play();
		this.postScore();

		setTimeout(() => {
			this.game.state.start('GameOver3');
		}, 200);
	},


	postScore: function () {
		this.db.collection("pm_user").doc(window.localStorage.getItem('uid')).get().then(doc => {
			if (doc.exists) {
				const _total = parseInt(doc.data()['games'][`g_1`]) + parseInt(doc.data()['games'][`g_2`]) + parseInt(doc.data()['games'][`g_3`]) + parseInt(score);
				this.db.collection("pm_user").doc(localStorage.getItem('uid'))
					.update(
						{
							[`games.g_3`]: parseInt(score) + parseInt(doc.data()['games'][`g_3`]),
							total: _total
						}
					);
			}
		});
	}
}
