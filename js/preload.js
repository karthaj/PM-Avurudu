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

		// buttons
		this.game.load.spritesheet('btn_close', '/assets/components/close_button_143x140.png', 90, 91);
		this.game.load.spritesheet('btn_elephant', '/assets/components/elephant_377x126.png', 377, 126);
		this.game.load.spritesheet('btn_obstacle', '/assets/components/obstacle_377x126.png', 377, 126);
		this.game.load.spritesheet('btn_grease', '/assets/components/grease_pole_377x126.png', 377, 126);
		this.game.load.spritesheet('btn_main_menu', '/assets/components/main_menu_377x126.png', 377, 126);
		this.game.load.spritesheet('btn_leader_board', '/assets/components/leader_board_377x126.png', 377, 126); 
		this.game.load.spritesheet('sun', '/assets/components/sun.png', 551, 551); 
		this.game.load.spritesheet('bird', '/assets/components/bird.png', 241, 250); 

		this.game.load.spritesheet('btn_sound', '/assets/components/sound_100x100.png', 105, 105);
		this.game.load.spritesheet('btn_mute', '/assets/components/mute100x100.png', 105, 105);
		this.game.load.spritesheet('btn_home', '/assets/components/home.png', 105, 105);

		this.game.load.image('menu','/assets/images/bg/menu-screen.png');
		this.game.load.image('menu-fix','/assets/images/bg/menu-fix.png');
 
		this.game.load.image('top-score-panel', 'assets/components/top-score-panel.png');
		this.game.load.image('popup', '/assets/images/bg/start.png');

		this.game.load.image('tree', 'assets/components/grease_tree.png');
		this.game.load.image('box', '/assets/components/box.png');
		this.game.load.image('bg-track', 'assets/images/bg/bg-track.png');

		this.game.load.spritesheet('player', 'assets/player.png', 24, 24, 24);
		this.game.load.spritesheet('btn_sack_race', '/assets/components/button_sprite_sheet.png', 193, 71);
 
		// Game 2 
		this.game.load.image('board', 'assets/components/board.png', 193, 71);
		this.game.load.image('chalk', '/assets/components/chalk.png' );
		this.game.load.image('timeline', '/assets/components/timeline.png' );
		this.game.load.image('timeline-bg', '/assets/components/timeline-bg.png' );
		this.game.load.image('eye', '/assets/components/eye.png',);
		this.game.load.spritesheet('iman', '/assets/components/iman_59x153.png', 58.16, 152.33);
		this.game.load.spritesheet('blind_fold', 'assets/components/blind_fold.png', 800, 235);
		this.game.load.spritesheet('cross', '/assets/components/cross.png', 18, 19);
 
		// Game 3
		this.game.load.spritesheet('player_climber', 'assets/components/player-climber.png', 100, 165);




	},

	create: function () {

		this.game.state.start("MainMenu");
	}
}