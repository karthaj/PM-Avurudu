var Preload = function (game) { };

Preload.prototype = {

	preload: function () {

		// Audio
		this.game.load.audio('click', '/assets/audio/click.mp3');
		this.game.load.audio('open', '/assets/audio/open_page.mp3');
		this.game.load.audio('jump', '/assets/audio/jump.mp3');
		this.game.load.audio('hurt', '/assets/audio/hurt.mp3');
		this.game.load.audio('slip', '/assets/audio/slip.mp3');
		this.game.load.audio('switch', '/assets/audio/switch.mp3');
		this.game.load.audio('cheer', '/assets/audio/cheer.m4a');
		this.game.load.audio('count', '/assets/audio/count.m4a');
		this.game.load.audio('whisile', '/assets/audio/whisile.m4a');
		this.game.load.audio('mark', '/assets/audio/mark.mp3');
		this.game.load.audio('bgm', '/assets/audio/bgm.mp3');

		// // buttons 
		this.game.load.spritesheet('btn_elephant', '/assets/components/btn-aliya.png',313,132);
		this.game.load.spritesheet('btn_obstacle', '/assets/components/btn-goni.png', 313,132);
		this.game.load.spritesheet('btn_grease', '/assets/components/btn-grease.png', 313,132);
		this.game.load.spritesheet('btn_leader_board', '/assets/components/btn-leader.png', 303,152);

		this.game.load.spritesheet('sun', '/assets/components/sun.png', 551.2, 552);
		this.game.load.spritesheet('bird', '/assets/components/bird.png', 241, 250);
		this.game.load.spritesheet('logo', '/assets/components/logo.png', 360, 360);
		this.game.load.spritesheet('btn_sound', '/assets/components/sound_100x100.png', 105, 105);
		this.game.load.spritesheet('btn_mute', '/assets/components/mute100x100.png', 105, 105);
		this.game.load.spritesheet('btn_home', '/assets/components/home.png', 105, 105);
		this.game.load.spritesheet('btn_play', '/assets/components/btn-play.png', 105, 105);
		this.game.load.spritesheet('btn_exit', '/assets/components/btn-exit.png', 107.5, 104);

		this.game.load.image('menu', '/assets/images/bg/menu-screen.png');
		this.game.load.image('menu-fix', '/assets/images/bg/menu-fix.png');
		this.game.load.image('points-style', '/assets/images/bg/points-style.png');

		this.game.load.image('top-score-panel', 'assets/components/top-score-panel.png');
		this.game.load.image('popup', '/assets/images/bg/start.png');

		this.game.load.image('tree', 'assets/components/grease_tree.png');
		this.game.load.image('rock-1', '/assets/components/rock-1.png');
		this.game.load.image('rock-2', '/assets/components/rock-2.png');
		this.game.load.image('bg-track', 'assets/images/bg/bg-track.png');


		// Game Start 
		this.game.load.image('gs-bg-1', '/assets/images/bg/race.png');
		this.game.load.image('gs-bg-2', '/assets/images/bg/elephant.png');
		this.game.load.image('gs-bg-3', '/assets/images/bg/grease.png');

		// Game 1
		this.game.load.image('bg-1', 'assets/images/bg/bg-1.png');
		this.game.load.image('bg-1-1', 'assets/images/bg/bg-1-1.png');
		this.game.load.spritesheet('imang-goni', '/assets/components/imang-goni.png', 100, 206);

		// Game 2 
		this.game.load.image('board', 'assets/components/board.png', 193, 71);
		this.game.load.image('chalk', '/assets/components/chalk.png');
		this.game.load.image('bg-aliya', '/assets/images/bg/aliya-back-ground.png');
		this.game.load.image('timeline', '/assets/components/timeline.png');
		this.game.load.image('timeline-bg', '/assets/components/timeline-bg.png');
		this.game.load.image('eye', '/assets/components/eye.png',);
		this.game.load.spritesheet('iman', '/assets/components/iman_59x153.png', 58.16, 152.33);
		this.game.load.spritesheet('blind_fold', 'assets/components/blind_fold.png', 800, 235);
		this.game.load.spritesheet('cross', '/assets/components/cross.png', 18, 19);

		// Game 3
		this.game.load.spritesheet('player_climber', 'assets/components/player-climber.png', 200, 330);
		this.game.load.image('bg-3', 'assets/images/bg/bg-3.png');
		this.game.load.spritesheet('grease-pit', 'assets/components/grease-pit.png', 70, 157);

		// Game Over

		this.game.load.image('game-over', '/assets/images/bg/Game-over-screen.png');

	},

	create: function () {
		this.game.state.start("MainMenu");
	}
}