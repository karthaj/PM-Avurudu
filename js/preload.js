var Preload = function(game){ };

Preload.prototype = {
	
	preload: function(){ 
 
		
		this.game.load.image('top-score-panel', 'assets/components/top-score-panel.png');
 
		this.game.load.image('tree', 'assets/components/grease_tree.png');
		this.game.load.image('box', '/assets/components/box.png');
		this.game.load.image('bg-track', 'assets/images/bg/bg-track.png');
		
		this.game.load.spritesheet('player', 'assets/player.png',24 , 24, 24 );
		this.game.load.spritesheet('btn_sack_race', '/assets/components/button_sprite_sheet.png', 193, 71);



		// Game 2 
		this.game.load.image('board', 'assets/components/board.png', 193, 71);
		this.game.load.image('eye', '/assets/components/eye.png', );
		this.game.load.spritesheet('iman', '/assets/components/iman_59x153.png', 58.16,152.33 );
		this.game.load.spritesheet('blind_fold', 'assets/components/blind_fold.png', 800,235 );
		this.game.load.spritesheet('cross', '/assets/components/cross.png', 18,20 );


		// Game 3
		this.game.load.spritesheet('player_climber', 'assets/components/player-climber.png',100,165 ); 

	},

	create: function(){
		this.game.state.start("MainMenu");
	}
}