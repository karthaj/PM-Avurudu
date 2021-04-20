var GameOver2 = function (game) { };

GameOver2.prototype = {

	create: function () {

		this.game.stage.backgroundColor = '479cde';

		game.add.image(0, 0, "game-over");

		this.click = game.add.audio('click');
		game.sound.setDecodedCallback([this.click], this.showScore, this);

		game.add.button(game.world.centerX - 200, 590, 'btn_home', function () {
			this.click.play();
			this.game.state.start('MainMenu');
		}, this, 1, 0);
		game.add.button(game.world.centerX + 100, 590, 'btn_play', function () {
			this.click.play();
			this.restartGame();
		}, this, 1, 0);
	this.showScore();

	},

	showScore: function () {

		var scoreFont = "70px Mali";

		this.scoreLabel = this.game.add.text(830, 450, "0", { font: scoreFont, fill: "#332F26" });
		this.scoreLabel.anchor.setTo(0.5, 0.5);
		this.scoreLabel.align = 'left';
		this.game.world.bringToTop(this.scoreLabel);
		this.scoreLabel.text = (score);

		this.highScore = this.game.add.text(830, 560, "0", { font: scoreFont, fill: "#332F26" });
		this.highScore.anchor.setTo(0.5, 0.5);
		this.highScore.align = 'left';
		this.game.world.bringToTop(this.highScore);

		this.hs = window.localStorage.getItem("game_2");

		if (this.hs == null || this.hs == "Nan") {
			this.highScore.setText(score);
			window.localStorage.setItem("game_2", score)
		}
		else if (parseInt(this.hs) < score) {
			this.highScore.setText((score));
			window.localStorage.setItem("game_2", score)

		}
		else {
			this.highScore.setText(this.hs);
		}

	},

	restartGame: function () {
		this.game.state.start("Game2");
	}

}