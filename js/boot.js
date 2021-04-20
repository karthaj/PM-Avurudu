var Boot = function (game, firebase) {

};

Boot.prototype = {

	preload: function () {
		this.game.load.spritesheet('loading', '/assets/components/loading.png', 199, 199);
	
	},

	create: function () {



		this.loading = this.game.add.sprite((this.game.world.width / 2) - 100, (this.game.world.height / 2) - 200, 'loading');

		// this.loading.scale.setTo(1.9, 2);

		this.loading.animations.add('initiate', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 18, true);
		this.loading.play('initiate');

		this.scoreLabel = this.game.add.text(this.game.world.centerX, (this.game.world.height / 2) + 50, "", { font: '40px Mali', fill: "#fff" });
		this.scoreLabel.anchor.setTo(0.5, 0.5);
		this.scoreLabel.align = 'center';
		this.game.world.bringToTop(this.scoreLabel);
		this.scoreLabel.text = "Loading . . .";


		this.db = firebase.firestore();
		var tScore = 0;

		this.db.collection("pm_user").doc(window.localStorage.getItem('uid')).get().then(doc => {

			if (doc.exists) {
				this.scoreLabel.text = "Fetching your profile . . .";

				for (let i = 1; i < 4; i++) {
					const v = parseInt(doc.data()['games'][`g_${i}`]);
					tScore += v;
					window.localStorage.setItem(`game_${i}`, v);
				}

				window.localStorage.setItem(`overall_score`, tScore);


				this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
				this.game.state.start("Preload");


			} else {
				this.scoreLabel.text = "Creating your profile . . .";
				var userDate = {
					name: window.localStorage.getItem('name'),
					dp: window.localStorage.getItem('dpURL'),
					email: window.localStorage.getItem('email'),
					createdAt: firebase.firestore.Timestamp.fromDate(new Date("December 10, 1815")),
					updatedAt: firebase.firestore.Timestamp.fromDate(new Date("December 10, 1815")),
					games: {
						g_1: 0,
						g_2: 0,
						g_3: 0,
					}, total: 0
				};

				firebase.firestore().collection("pm_user").doc(window.localStorage.getItem('uid')).set(userDate).then(e => this.scoreLabel.text = "Finnishing up . . .");

				setTimeout(() => {
					this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
					this.game.state.start("Preload");
				}, 1500);
			}

		}).catch(err => { console.log(err) });

	}
}