var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div');
var speed = 100;
var score = 0;
var scoreText;
var numStars = 0;
var oldFrame = 1;

// keyboard codes for key events
var KEYCODE_A = 65;
var KEYCODE_D = 68;
var KEYCODE_S = 83;
var KEYCODE_W = 87;
var KEYCODE_SPACE = 32;

var main_state = {

	preload: function() {
		game.load.image('sky', 'assets/bg.png');
		game.load.image('ground', 'assets/platform2.png');
		game.load.image('star', 'assets/heart.png');
		//game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
		game.load.spritesheet('dude', 'assets/sorasprite.png', 80, 80);
		
		game.load.audio('sfx', 'assets/shoot.wav');
	},

	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.add.sprite(0, 0, 'sky');
 
		platforms = game.add.group();
		platforms.enableBody = true;
 
 		// the ground - enable physics but make immovable
		var ground = platforms.create(0, game.world.height - 64, 'ground');
 		ground.scale.setTo(2, 2);
 		ground.body.immovable = true;
 
 		// the ledges - also immovable
		var ledge = platforms.create(400, 400, 'ground');
		ledge.body.immovable = true;
		ledge = platforms.create(-150, 250, 'ground');
		ledge.body.immovable = true;
	
		// the player and its settings
		player = game.add.sprite(32, game.world.height - 150, 'dude');
 		game.physics.arcade.enable(player);
 
		// player physics properties
		player.body.bounce.y = 0.1;
		player.body.gravity.y = 1500;
		player.body.collideWorldBounds = true;
 
		// player's two animations, walking left and right
		/*
		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);
		*/
		
		player.frame = 1;
		player.animations.add('left', [1], 10, true);
		player.animations.add('right', [0], 10, true);
	
		cursors = game.input.keyboard.createCursorKeys();
	
		stars = game.add.group();
		stars.enableBody = true;
	
		//scoreText = game.add.text(16, 16, 'Stars: ' + numStars, { fontSize: '32px', fill: '#000' });
		
		mouse = new Phaser.Mouse(game);
		mouse.start();
		mouse.mouseUpCallback = this.mouseUp;
		
		keyboard = new Phaser.Keyboard(game);
		keyboard.start();
		
		fx = game.add.audio('sfx');
	},

	update: function() {
		//  Collide the player and the stars with the platforms
		game.physics.arcade.collide(player, platforms);
	
		//  Reset the players velocity (movement)
		player.body.velocity.x = 0;
 
		if (cursors.left.isDown || keyboard.isDown(KEYCODE_A)) {
			//  Move to the left
			player.body.velocity.x = -150 - speed;
 
			//player.animations.play('left');
			player.frame = 1;
		}
		else if (cursors.right.isDown || keyboard.isDown(KEYCODE_D)) {
			//  Move to the right
			player.body.velocity.x = 150 + speed;
 
			//player.animations.play('right');
			player.frame = 0;
		}
		else {
			//  Stand still
			player.animations.stop();
 			
			player.frame = oldFrame;
		}
	
		//  Allow the player to jump if they are touching the ground.
		if ((cursors.up.isDown || keyboard.isDown(KEYCODE_W) ||
			keyboard.isDown(KEYCODE_SPACE)) && player.body.touching.down) {
			player.body.velocity.y = -800;
		}
	
		// stars collide with each other and platforms
		game.physics.arcade.collide(stars, platforms);
		game.physics.arcade.collide(stars, stars);
	
		//game.physics.arcade.overlap(player, stars, this.collectStar, null, this);
		oldFrame = player.frame;
	},
	
	mouseUp: function() {
		fx.play();
		var x = mouse.event.screenX - 57;
		var y = mouse.event.screenY - 93;
		var playerX = player.body.right - player.body.width * 0.5;
		var playerY = player.body.bottom - player.body.height * 0.5;
		numStars++;
		//scoreText.text = 'Stars: ' + numStars;

		if(x > playerX) {
			//player.animations.play('right');
			player.frame = 0;
			oldFrame = 0;
		}
		else {
			//player.animations.play('left');
			player.frame = 1;
			oldFrame = 1;
		}
				
		var star = stars.create(playerX, playerY - 20, 'star');

		var hyp = Math.sqrt( (x - playerX) * (x - playerX) +
			(y - playerY) * (y - playerY) );
		var normX = (x - playerX) / hyp * 500;
		var normY = (y - playerY) / hyp * 500;

		star.body.velocity = new Phaser.Point(normX, normY);
		star.body.rebound = true;
		star.body.collideWorldBounds = true;
		game.physics.enable(star, Phaser.Physics.ARCADE);
		star.body.bounce.setTo(1, 1);
		//star.body.angularVelocity = 20;
		var diffX = x - playerX;
		var diffY = y - playerY;
		
		var offset = 90;
		if(diffX < 0) offset += 180;
		//if(diffY < 0) offset ;
		star.angle = Math.atan(diffY / diffX) * 180 / Math.PI + offset;
	},

	collectStar: function(player, star) {
	
		// removes the star from the screen
		star.kill();
 
		// add and update the score
		score += 10;
		//scoreText.text = 'Score: ' + score;
	
		speed += 10;
	}
}

game.state.add('main', main_state);
game.state.start('main');