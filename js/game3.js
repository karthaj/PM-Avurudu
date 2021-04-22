var Game3 = function (game, firebase) { };

var score = 0;

Game3.prototype = {


	create: function () {

		this.db = firebase.firestore();

		this.alive = true;

		this.obstacleVelocity = -500;
		this.rate = 1300;
		score = 0;

		// Sound for the buttons
		this.click = game.add.audio('click');
		this.slip = game.add.audio('slip');
		this.switch = game.add.audio('switch');
		this.cheer = game.add.audio('cheer');
		this.cheer.volume = 0.3; var whisile = game.add.audio('whisile');
		this.bgm = game.add.audio('bgm');
		this.bgm.volume = 0.5;

		var bg = game.add.image(0, -30, "bg-3");
		game.add.tween(bg).to(
			{ y: 0 }, 745, "Sine.easeInOut", true, 0, -1, true);

		this.pitWidth = this.game.cache.getImage('tree').width;
		this.pitHeight = 100;

		// Images
		this.game.stage.backgroundColor = 'ffe8a3';

		this.bg = this.add.tileSprite(this.game.world.centerX - (this.pitWidth / 2), 0, this.pitWidth, 10000, "tree");

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.floor = this.game.add.group();
		this.floor.enableBody = true;
		this.floor.createMultiple(Math.ceil(this.game.world.width / this.pitWidth), 'tree');

		this.grease = this.game.add.group();

		this.grease.enableBody = true;
		this.grease.createMultiple(20, 'grease-pit');
		this.game.world.bringToTop(this.floor);

		this.sccorePanel = this.add.sprite(0, 0, "top-score-panel");
		this.sccorePanel.x = 10;
		this.sccorePanel.y = 10;

		this.jumping = false;

		this.createScore();
		this.createPlayer();
		this.addButtons();
		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.obsPlacer = this.game.time.events.loop(this.rate, this.addObstacles, this);
		this.game.time.events.loop(100, this.incrementScore, this);
		this.game.time.events.loop(3700, this.cheers, this);
		this.game.time.events.loop(38000, this.bgms, this);

		whisile.play();

		this.cheers();
		this.bgms();
	},

	update: function () {

		this.game.physics.arcade.collide(this.player, this.floor);
		this.game.physics.arcade.collide(this.player, this.grease, this.gameOver, null, this);

		this.bg.autoScroll(0, -this.obstacleVelocity);

		this.obsPlacer.delay = Math.floor(Math.random() * (1300 - 1 + 1) + 700);

		// Right!
		if (this.cursors.right.isDown && this.player.body.offset.x != 105) {
			this.switch.play(); this.player.x = this.game.world.centerX - ((this.pitWidth / 2.5) * 3);
			this.player.play('climb-right');
			this.player.body.offset.x = 105;
		}
		// Left!
		if (this.cursors.left.isDown && this.player.body.offset.x != 50) {
			this.switch.play(); this.player.x = this.game.world.centerX - (this.pitWidth * 2);
			this.player.play('climb-left');
			this.player.body.offset.x = 50;
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
	addPit: function (x, y, frm) {

		var pit = this.grease.getFirstDead();

		pit.reset(x, y - 100);
		pit.body.velocity.y = -this.obstacleVelocity;
		pit.body.immovable = true;
		pit.checkWorldBounds = true;
		pit.outOfBoundsKill = true;
		pit.animations.add('wobble', frm, 10, true);
		pit.play('wobble');
		// pit.body.friction.x = 1000; 

	},

	addObstacles: function () {
		if ((Math.floor(Math.random() * (6 - 1 + 1) + 1) % 2) == 0) {
			this.addObstaclesRight();
		} else {
			this.addObstaclesLeft();
		}
	},

	addObstaclesLeft: function () {

		// 	var pitsNeeded = Math.floor( Math.random() * (2 - 0));
		// 	var gap = Math.floor( Math.random() * (pitsNeeded - 0));
		this.addPit(this.game.world.centerX - ((this.pitWidth / 3.5) * 4), -50, [0, 1, 7, 8, 9, 10, 11, 12, 13]);
		this.obstacleVelocity -= 17;
	},
	addObstaclesRight: function () {
		// 	var pitsNeeded = Math.floor( Math.random() * (2 - 0));
		// 	var gap = Math.floor( Math.random() * (pitsNeeded - 0));
		this.addPit(this.game.world.centerX, -50, [14, 15, 16, 17, 18, 23, 24, 25, 26, 27]);
		this.obstacleVelocity -= 17;
	},

	createPlayer: function () {

		this.player = this.game.add.sprite(this.game.world.centerX - ((this.pitWidth / 2.5) * 3), 0, 'player_climber');
		this.player.scale.setTo(1, 1);
		this.game.physics.arcade.enable(this.player);
		this.player.animations.add('climb-right', [0, 1, 2, 3, 4], 5, true);
		this.player.animations.add('climb-left', [5, 6, 7, 8, 9], 5, true);
		this.player.play('climb-right');
		this.player.body.setSize(50, 100);
		this.player.y = this.game.world.height - 320;
		this.player.body.offset.x = 105;
		this.player.body.offset.y = 70;

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
		this.alive = false;
		this.player.alpha = .7
		this.slip.play();
		this.postScore();

		setTimeout(() => {
			this.game.state.start('GameOver3');
		}, 200);
	},


	postScore: function () {
		if (window.localStorage.getItem("uid") != null) {
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
}
