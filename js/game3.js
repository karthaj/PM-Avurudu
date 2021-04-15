var Game3 = function (game, firebase) { };

var score = 0;
result_title = "Your total feet(s) : ";

Game3.prototype = {


	create: function () {

		this.db = firebase.firestore();

		this.alive = true;

		this.obstacleVelocity = -500;
		this.rate = 1500;
		score = 0;

		this.tileWidth = this.game.cache.getImage('tree').width;
		this.tileHeight = 100;
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
		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.obsPlacer = this.game.time.events.loop(this.rate, this.addObstacles, this);
		this.game.time.events.loop(100, this.incrementScore, this);
	},

	update: function () {

		this.game.physics.arcade.collide(this.player, this.floor);
		this.game.physics.arcade.collide(this.player, this.boxes, this.gameOver, null, this);

		this.bg.autoScroll(0, -this.obstacleVelocity);


		// Right!
		if (this.cursors.right.isDown) {
			this.player.x = this.game.world.centerX - ((this.tileWidth / 2.5) * 3);
			this.player.play('climb-right');
			this.player.body.offset.x = 55;
		}
		// Left!
		if (this.cursors.left.isDown) {
			this.player.x = this.game.world.centerX - (this.tileWidth * 2);
			this.player.play('climb-left');
			this.player.body.offset.x = 0;
		}

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

	incrementScore: function () {
		if (this.alive) {
			score += 2;
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
			.update({ [`games.g_3`]: score });
	}

};
