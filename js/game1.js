var Game1 = function (game, firebase) { };

var score = 0;

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
		this.bgm = game.add.audio('bgm');
		this.cheer.volume = 0.2;
		this.jump.volume = 0.6;
		this.bgm.volume = 0.5;
		this.tileWidth = 1;
		this.tileHeight = 150;
		this.boxHeight = this.game.cache.getImage('rock-1').height;

		// Images

		this.game.stage.backgroundColor = 'ffe8a3';
		this.bg = this.add.tileSprite(0, this.game.world.height - 250, 2000, 0, "bg-track");
		var _ = game.add.image(0, 0, "bg-1");

		game.add.tween(_).to(
			{ y: 3, x: 3 }, 945, "Sine.easeInOut", true, 0, -1, true);

		this.sccorePanel = this.add.sprite(0, 0, "top-score-panel");
		this.sccorePanel.x = 10;
		this.sccorePanel.y = 10;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.floor = this.game.add.group();
		this.floor.enableBody = true;
		this.floor.createMultiple(Math.ceil(this.game.world.width / this.tileWidth));

		this.boxes = this.game.add.group();
		this.boxes.enableBody = true;
		this.boxes.createMultiple(20, 'rock-2');
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
		this.game.time.events.loop(38000, this.bgms, this);

		game.add.sprite(0, this.game.world.height - 204, "bg-1-1");

		whisile.play();

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
			this.player.body.velocity.y = -2050;
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
		game.debug.body(this.boxes)

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
		this.cheer.pause();
	},

	bgms: function () {
		if (this.sound.visible)
			this.bgm.play()
		else
			this.bgm.pause()
	},

	stopSounds: function () {
		this.click.pause();
		this.cheer.pause();
		this.bgm.pause();
	},

	cheers: function () {
		if (this.sound.visible && this.alive)
			this.cheer.play()
		else
			this.cheer.pause()
	},

	addObstacles: function () {
		// 	var tilesNeeded = Math.floor( Math.random() * (2 - 0));
		// 	var gap = Math.floor( Math.random() * (tilesNeeded - 0));
		this.addBox(this.game.world.width, (this.game.world.height - this.tileHeight) - this.boxHeight);
		this.obstacleVelocity -= 10;

	},

	addBox: function (x, y) {

		var tile = this.boxes.getFirstDead();

		tile.reset(x, y);
		tile.body.velocity.x = this.obstacleVelocity;
		tile.body.immovable = true;
		tile.checkWorldBounds = true;
		tile.outOfBoundsKill = true;
		tile.body.width = 100;
		tile.loadTexture(Math.floor(Math.random() * (2 - 1 + 1) + 1) == 1 ? 'rock-1' : 'rock-2');
		tile.body.setCircle(20);
	},

	addTile: function (x, y) {

		var tile = this.floor.getFirstDead();

		tile.reset(x, y);
		// tile.body.velocity.y = me.vel;
		tile.body.immovable = true;
		tile.checkWorldBounds = true;
		tile.outOfBoundsKill = true;


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
			this.tileHeight, 'imang-goni');
		this.player.scale.setTo(1.3, 1.2);
		this.player.anchor.setTo(0.5, 1.0);
		this.game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 8200;
		this.player.body.collideWorldBounds = true;
		this.player.body.bounce.y = 0.1;
		this.player.body.width = 60;
		this.player.body.offset.x = 25; 

		this.player.animations.add('jog', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 23, true);
		this.player.animations.add('jump', [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,], 18, true);
		this.player.animations.add('hurt', [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41], 30, true);

		this.player.play('hurt');
	},

	render:function(){
this.game.debug.body(this.player)
	},

	createScore: function () {

		var scoreFont = "50px Mali";

		this.scoreLabel = this.game.add.text(300, 55, "0", { font: scoreFont, fill: "#000" });
		this.game.add.text(150, 55, "ft", { font: scoreFont, fill: "#000" }).anchor.setTo(0.5, 0.5);
		this.scoreLabel.anchor.setTo(0.5, 0.5);
		this.scoreLabel.align = 'center';
		this.game.world.bringToTop(this.scoreLabel);

	},

	incrementScore: function () {
		if (this.alive) {
			score += 1;
			this.scoreLabel.setText(score);
			this.game.world.bringToTop(this.scoreLabel);
		}
	},

	gameOver: function () {
		this.stopSounds();

		if (this.alive) {

			this.hurt.play();
			this.alive = false;
			this.postScore();
			this.game.state.start('GameOver1');

		}
	},



	postScore: function () {
		if (window.localStorage.getItem("uid") != null) {
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
					window.localStorage.getItem('overall_score', _total)

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
};
