var LeaderBoard = function (game, firebase) { };
var btn_sack_race;
var tScore = 0;
LeaderBoard.prototype = {

	create: function () {
		this.db = firebase.firestore();
		this.initiate();

		this.data = [];

		this.game.stage.backgroundColor = 'ffe8a3';
		this.game.stage.backgroundColor = '000000';

		this.start = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

		game.add.button(this.game.world.width - 150, 30, 'btn_close', this.mainMenu, this, 0, 1, 2);

	},

	update: function () {
		if (this.start.isDown) {
			this.startGame();
		}
	},
 
	initiate: function () {

		this.db.collection("pm_user").orderBy("total", "desc").get().then((querySnapshot) => {
			let i = 1;
			querySnapshot.forEach((doc) => {
				this.data.push([i++, doc.data()['name'], doc.data()['total']]);
			});

			this.style = { font: "36px Mali", fill: "#fff", tabs: [150, 500, 80] };
			var headings = ['Rank', 'Name', 'Score'];

			var text = game.add.text(this.game.world.centerX / 2.5, 150, '', this.style);
			var text2 = game.add.text(this.game.world.centerX / 2.5, 200, '', this.style);

			text.parseList(headings);
			text2.parseList(this.data); 


		}).catch(err => {
			console.log(err);
			alert('Something seems off. Please reload.');
		});

	},

	mainMenu: () => this.game.state.start("MainMenu"),

}
