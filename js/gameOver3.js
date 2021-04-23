var GameOver3 = function (game) { };

GameOver3.prototype = {

	create: function () {

		this.game.stage.backgroundColor = '479cde';

		game.add.image(0, 0, "game-over");

		this.click = game.add.audio('click'); 

		this.showScore();
	},

	showScore: function () {

		game.add.button(game.world.centerX - 200, 560, 'btn_home', function () {
			this.click.play(); 
			this.game.state.start('MainMenu');
		}, this, 1, 0);
		game.add.button(game.world.centerX + 100, 560, 'btn_play', function () {
			this.click.play(); 
			this.restartGame();
		}, this, 1, 0);

		var scoreFont = "70px Mali";

		this.scoreLabel = this.game.add.text(830, 420, "0", { font: scoreFont, fill: "#332F26" });
		this.scoreLabel.anchor.setTo(0.5, 0.5);
		this.scoreLabel.align = 'left';
		this.game.world.bringToTop(this.scoreLabel);
		this.scoreLabel.text = (score);

		this.highScore = this.game.add.text(830, 515, "0", { font: scoreFont, fill: "#332F26" });
		this.highScore.anchor.setTo(0.5, 0.5);
		this.highScore.align = 'left';
		this.game.world.bringToTop(this.highScore);

		this.hs = window.localStorage.getItem("game_3");

		if (this.hs == null || this.hs == "Nan") {
			this.highScore.setText(score);
			window.localStorage.setItem("game_3", score)
		}
		else if (parseInt(this.hs) < score) {
			this.highScore.setText((score));
			window.localStorage.setItem("game_3", score)

		}
		else {
			this.highScore.setText(this.hs);
		}

	},

	restartGame: function () {
		this.game.state.start("Game3");
	}

}