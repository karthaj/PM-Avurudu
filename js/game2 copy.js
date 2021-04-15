var Game2 = function (game) { };


Game2.prototype = {

	create: function () { 

		this.game.stage.backgroundColor = 'ffe8a3';
this.createBlinder();

		// Board 
		this.createBoard();
		
		this.blinder.play('initiate');   
		// this.blinder.play('blindIt');   
	},

	update: function () {
		// this.indicator_speed.delay -= 10;
		// box.rotation += 0.04;  
	},

	render: function () {
		// game.debug.spriteInfo(box, 32, 32);
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
		this.board = game.add.sprite(0, (this.game.world.centerX / 3), 'board');
		this.board.scale.setTo(0.6);
		this.board.x =  (this.game.world.width / 7) ;

		this.indicator_speed = game.add.tween(this.board).to(
			{ x: (this.game.world.width / 4 *2) }, 1300, "Sine.easeInOut", true, 0, -1, true);
		this.indicator_speed = game.add.tween(this.board).to(
			{ y: this.game.world.centerY/2.3 }, 1000, "Sine.easeInOut", true, 0, -1, true);
	},
	
	createBlinder: function () {

		this.blinder = this.game.add.sprite( 0  ,this.game.world.centerY/2.5, 'blind_fold');
		 this.blinder.scale.setTo(1.1,1.1);
	 
		this.blinder.animations.add('initiate', [0, 1, 2, 3,4,5,6], 18, false);
		// this.blinder.animations.add('blindIt', [3,4,5,6,7,8], 5, true);
		
	},

	incrementScore: function () {
		score += 1;
		this.scoreLabel.setText(score);
		this.game.world.bringToTop(this.scoreLabel);
		this.highScore.setText("HS: " + window.localStorage.getItem('HighScore'));
		this.game.world.bringToTop(this.highScore);
	},

	gameOver: function () {
		this.game.state.start('GameOver');
	}

};
