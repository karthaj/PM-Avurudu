var MainMenu = function (game, firebase) { };
var btn_sack_race;
const NAME = localStorage.getItem('name');
MainMenu.prototype = {

	create: function () {


		this.db = firebase.firestore();

		this.game.stage.backgroundColor = 'ffe8a3';
		this.game.stage.backgroundColor = '000000';

		this.start = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		this.showMenu();

	},

	update: function () {

		if (this.start.isDown) {
			this.startGame();
		}

	},

	showMenu: function () {

		var scoreFont = "50px Mali";

		this.scoreLabel = this.game.add.text(this.game.world.centerX, this.game.world.height / 5, "0", { font: scoreFont, fill: "#fff" });
		this.scoreLabel.anchor.setTo(0.5, 0.5);
		this.scoreLabel.align = 'center';
		this.game.world.bringToTop(this.scoreLabel);


		this.greetText = this.game.add.text(this.game.world.centerX, this.game.world.height / 11, "0", { font: scoreFont, fill: "#fff" });
		this.greetText.anchor.setTo(0.5, 0.5);
		this.greetText.align = 'center';
		this.game.world.bringToTop(this.greetText);

		this.greetText.text = "Happy new year " + NAME;
		this.scoreLabel.text = "Your score is " + (score);

		game.add.button(game.world.centerX - 95, this.game.world.height / 4 + 100, 'btn_sack_race', this.startGame1, this, 2, 1, 0);
		game.add.button(game.world.centerX - 95, this.game.world.height / 4 + 200, 'btn_sack_race', this.startGame2, this, 1, 0, 2);
		game.add.button(game.world.centerX - 95, this.game.world.height / 4 + 300, 'btn_sack_race', this.startGame3, this, 0, 2, 1);

		this.scoreLabel.bringToTop();

		this.total();

	},

	total: function () {



		this.db.collection("pm_user").where("uid", "==", localStorage.getItem('uid')).get().then(querySnapshot => {


			if (querySnapshot.size == 1) {
				


			} else {

				var userDate = { 
					name: localStorage.getItem('name'),
					dateExample: firebase.firestore.Timestamp.fromDate(new Date("December 10, 1815")),
					games: {
						g_1: {
							score: 0
						},
						g_2: {
							score: 0
						},
						g_3: {
							score: 0
						},
					}
				};

				firebase.firestore().collection("pm_user").doc(localStorage.getItem('uid')).set(userDate).then(() => {
					console.log("Profile generated");
				});
			}

		});

	},


	startGame1: () => this.game.state.start("Game1"),
	startGame2: () => this.game.state.start("Game2"),
	startGame3: () => this.game.state.start("Game3"),

}