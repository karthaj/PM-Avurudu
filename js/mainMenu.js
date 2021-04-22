var MainMenu = function (game, firebase) { };
var btn_sack_race;
const NAME = window.localStorage.getItem('name');

MainMenu.prototype = {

	create: function () {


		this.click = game.add.audio('click');
		this.open = game.add.audio('open');
		this.bgm = game.add.audio('bgm');
		this.bgm.volume = 0.7;

		this.game.stage.backgroundColor = 'ffe8a3';
		this.game.stage.backgroundColor = '000000';

		this.start = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

		game.add.image(0, 0, 'menu').scale.setTo(1.02, 1.02);
		game.add.image(0, 0, 'points-style').scale.setTo(1.02, 1.02);

		var sun = game.add.sprite(this.game.world.width - 300, -20, 'sun');
		sun.animations.add('shine', [0, 1, 2, 3], 2, true);
		sun.play('shine');
		sun.scale.setTo(0.6, 0.6);

		var bird = game.add.sprite(-15, -20, 'bird');
		bird.animations.add('crow', [0, 1, 2, 3], 3, true);
		bird.play('crow');

		game.add.image(0, 0, 'menu-fix').scale.setTo(1.02, 1.02);

		game.add.image(this.game.world.centerX - 150, 70, 'logo').scale.setTo(0.7, 0.7);

		this.showMenu();
		this.addButtons();

		this.game.time.events.loop(38000, this.bgms, this);
		this.bgms();
	},




	showMenu: function () {

		this.open.play();

		var scoreFont = "25px Mali";

		this.game.add.text(this.game.world.centerX - 165, this.game.world.height - 70, "Powered by PickMe Engineering", { font: "20px Mali", fill: "#000" });

		this.scoreLabel = this.game.add.text(this.game.world.centerX, this.game.world.height / 2.355, "", { font: scoreFont, fill: "#4f3e00" });
		this.scoreLabel.anchor.setTo(0.5, 0.5);
		this.scoreLabel.align = 'center';
		this.game.world.bringToTop(this.scoreLabel);

		this.greetText = this.game.add.text(this.game.world.centerX, this.game.world.height / 2.9, "", { font: scoreFont, fill: "#000" });
		this.greetText.anchor.setTo(0.5, 0.5);
		this.greetText.align = 'center';
		this.game.world.bringToTop(this.greetText);

		this.greetText.text = "සුභ අලුත් අවුරුද්දක් වේවා!\n" + NAME;
		this.scoreLabel.text = "Your ⭐ is " + (window.localStorage.getItem('overall_score') == null ? 0 : parseInt(window.localStorage.getItem('overall_score') / 100));

		game.add.button(game.world.centerX - 130, this.game.world.height / 2.75 + 85, 'btn_obstacle', this.startGame1, this, 1, 0, 0).scale.setTo(0.75);
		game.add.button(game.world.centerX - 130, this.game.world.height / 2.75 + 160, 'btn_elephant', this.startGame2, this, 1, 0, 0).scale.setTo(0.75);
		game.add.button(game.world.centerX - 130, this.game.world.height / 2.75 + 240, 'btn_grease', this.startGame3, this, 1, 0, 0).scale.setTo(0.75);
		game.add.button(game.world.centerX - 125, this.game.world.height / 2.75 + 320, 'btn_leader_board', this.populateBoard, this, 1, 0, 0).scale.setTo(0.75);

		this.scoreLabel.bringToTop();

	},
	bgms: function () {
		if (this.sound.visible)
			this.bgm.play();
		else
			this.bgm.pause();
	},

	addButtons: function () {

		game.add.button(13, 275, 'btn_exit', this.exit, this, 1, 0);

		this.mute = game.add.button(10, 175, 'btn_mute', this.soundIt, this, 1, 0);
		this.mute.visible = false;
		this.sound = game.add.button(10, 175, 'btn_sound', this.muteIt, this, 1, 0);

	},

	exit: function () {
		window.localStorage.clear();
		window.location.reload();
	}
	,
	muteIt: function () {
		this.mute.visible = true;
		this.sound.visible = false;
		this.bgm.pause();

	},

	soundIt: function () {
		this.sound.visible = true;
		this.mute.visible = false;
		this.bgm.play();
		this.click.play();
	},


	cxx: function () {
		this.click.play();
		this.bgm.pause();

	},

	startGame1: function () { this.cxx(); this.game.state.start("StartGame1") },
	startGame2: function () { this.cxx(); this.game.state.start("StartGame2") },
	startGame3: function () { this.cxx(); this.game.state.start("StartGame3") },

	populateBoard: function () {

		this.click.play();

		var profile = null;
		var data = [];
		if (window.localStorage.getItem("uid") != null) {
			firebase.firestore().collection("pm_user")
				.orderBy("total", "desc")
				.get()
				.then((querySnapshot) => {
					let i = 1;
					const UID = window.localStorage.getItem("uid");

					querySnapshot.forEach((doc) => {
						if (doc.id == UID && i > 3) {
							console.log(doc.data()["uid"]);
							profile = [i, doc.data()["name"], parseInt(doc.data()["total"]/100), doc.data()["dp"],];
						}

						data.push([i++, doc.data()["name"], parseInt(doc.data()["total"]/100 ), doc.data()["dp"],]);
					});

					if (data.length < 3) {
						alert('Leader board is not ready, Try again later.') 
						return;
					}

					var split = (e)=>e.split(' ')[0]

					document.getElementById("top-ranks").innerHTML =
						`<div class="col-4 text-center">
						<img src="${data[1][3]}"
							class="border shadow-sm rounded-circle" width="80%" alt="${data[1][1]}" style="border:7px solid #A5A5A5 !important">
						<img src="/assets/components/silver.png"
							style="position: absolute;top: 36%;right: 13%;width: 60px;" alt="silver" >
						<h6 class="text-primary text-center">
							${split(data[1][1])}
						</h6>
						<h6>⭐${data[1][2]}</h6>
					</div>
					<div class="col-4 text-center">
						<img src="${data[0][3]}"
							class="border  shadow-sm rounded-circle" width="100%" alt="${data[0][1]}" style="border:7px solid #FFB300 !important">
							<img
							src="/assets/components/gold.png"
							style="position: absolute;top: 42%;right: 7%;width: 60px;" alt="silver">
						<h6 class="text-primary text-center">
							${split(data[0][1])}
						</h6>
						<h6>⭐${data[0][2]}</h6>
					</div>
					<div class="col-4 text-center">
						<img src="${data[2][3]}"
							class="border  shadow-sm rounded-circle" width="80%" alt="${data[2][1]}" style="border:7px solid #B86300 !important"><img
							src="/assets/components/bronze.png"
							style="position: absolute;top: 36%;right: 13%;width: 60px;" alt="silver" >
						<h6 class="text-primary text-center">
							${split(data[2][1])}
						</h6>
						<h6>⭐${data[2][2]}</h6>
					</div>`;

					if (profile != null) {
						document.getElementById("user-rank").innerHTML = `
				 <div class="col-3 text-center ">
				 	<img src="${profile[3]}"
				 		class="border rounded-circle" width="70" height="70" alt="${profile[2]}">
				 </div>
				 <div class="col-5  align-self-center ">
				 	<h6 class="m-auto">${profile[1]}</h6>
				 </div>
				 <div class="col-2  align-self-center text-left ">
				 	<h4>⭐${profile[2]}</h4>
				 </div>
				 <div class="col-2  align-self-center text-center ">
				 	<h4>${profile[0]}</h4>
				 </div>	`;
					} else {
						document.getElementById("user-rank").style.display = 'none'
						document.getElementById("my-rank").style.display = 'none'
					}


					var list = `<h5>List empty !</h6>`;

					if (data.length > 3) {
						var list = `  `;

						for (let i = 3; i < data.length; i++) {

							const e = data[i];

							list += `
						<div id="user-rank" click='${this.mainMenu}' class="form-group form-row mx-2 my-2 py-1 px-1 border shadow-sm "
						style="border-radius: 10px;background-image: linear-gradient(120deg, #efefff 0%, #ebedee 100%);">
						<div class="col-2 text-center ">
							 <img src="${e[3]}" class="border rounded-circle shadow-sm" width="50" height="50" alt="">
						</div>
						<div class="col-5 align-self-center ">
							 <h6 class="m-auto">${e[1]}</h6>
						</div>
						<div class="col-2 align-self-center text-center ">
							 <h5>⭐${e[2]}</h5>
						</div>
						<div class="col-2 align-self-center text-right ">
							 <h5>${e[0]}</h5>
						</div>
						</div> `;
						}

					}

					document.getElementById("users-ranks").innerHTML = list;

					function eventFire(el, etype) {
						if (el.fireEvent) {
							el.fireEvent("on" + etype);
						} else {
							var evObj = document.createEvent("Events");
							evObj.initEvent(etype, true, false);
							el.dispatchEvent(evObj);
						}

					}
					this.open.play();
					eventFire(document.getElementById("btn"), "click");
				})
				.catch((err) => {
					console.log(err);
					alert("Something seems off. Please reload.");
				});
		} else {
			window.location.reload();
		}
	},



}