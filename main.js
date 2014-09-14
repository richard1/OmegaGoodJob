var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div');
var speed = 100;
var score = 0;
var scoreText;
var numStars = 0;
var oldFrame = 1;
var shiroFollowing = 0;
var shiroTimeOfSeduction = 0;
var shiroSpeed = 0;
var consecHits = 0;
var nii = [];
var currentNii = 0;
var stephGoingRight = 1;
var stephFollowing = 0;
var stephSpeed = 0;
var stephTimeOfSeduction = 0;

// keyboard codes for key events
var KEYCODE_A = 65;
var KEYCODE_D = 68;
var KEYCODE_S = 83;
var KEYCODE_W = 87;
var KEYCODE_SPACE = 32;
var SHIRO_WITH_NII = 0xFFFFFF;
var SHIRO_ALMOST_NII = 0xAAAAAA;
var SHIRO_NO_NII = 0x555555;
var STEPH_IN_LOVE = 0xFFFFFF;
var STEPH_NO_LOVE = 0xFFC3E1;


var main_state = {

	preload: function() {
		game.load.image('sky', 'assets/bg.png');
		game.load.image('ground', 'assets/platform2.png');
		game.load.image('star', 'assets/heart.png');
		game.load.spritesheet('shiro', 'assets/shirosprite.png', 80, 80);
        game.load.spritesheet('sora', 'assets/sorasprite.png', 80, 80);
        game.load.spritesheet('steph', 'assets/stephsprite.png', 80, 80);
		
		game.load.audio('sfx', 'assets/shoot.wav');
        game.load.audio('nii1', 'assets/nii1.mp3');
        game.load.audio('nii2', 'assets/nii2.mp3');
        game.load.audio('nii3', 'assets/nii3.mp3');
        game.load.audio('nii4', 'assets/nii4.mp3');
        game.load.audio('nii5', 'assets/nii5.mp3');
        game.load.audio('nii6', 'assets/nii6.mp3');
        game.load.audio('nii7', 'assets/nii7.mp3');
        game.load.audio('nii8', 'assets/nii8.mp3');
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
		player = game.add.sprite(32, game.world.height - 150, 'sora');
        shiro = game.add.sprite(16, 150, 'shiro');
        steph = game.add.sprite(600, 300, 'steph');

        game.physics.arcade.enable(player);
 		game.physics.arcade.enable(shiro);
        game.physics.arcade.enable(steph);
 
		// player physics properties
		player.body.bounce.y = 0.1;
		player.body.gravity.y = 1500;
		player.body.collideWorldBounds = true;
		
        // shiro physics properties
		shiro.body.bounce.y = 0.1;
		shiro.body.gravity.y = 1500;
		shiro.body.collideWorldBounds = true;
 
        // steph physics properties
		steph.body.bounce.y = 0.1;
		steph.body.gravity.y = 1500;
		steph.body.collideWorldBounds = true;
		
        // player's two animations, walking left and right
		/*
		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);
		*/
		
		player.frame = 1;
        shiro.frame = 0;
        steph.frame = 0;

		cursors = game.input.keyboard.createCursorKeys();
	
		stars = game.add.group();
		stars.enableBody = true;
	
		//scoreText = game.add.text(16, 16, 'Stars: ' + numStars, { fontSize: '32px', fill: '#000' });
		
        /*
        shiro.body.rebound = true;
		shiro.body.collideWorldBounds = true;
		game.physics.enable(shiro, Phaser.Physics.ARCADE);
		shiro.body.bounce.setTo(1, 1);
		*/

		mouse = new Phaser.Mouse(game);
		mouse.start();
		mouse.mouseUpCallback = this.mouseUp;
		
		keyboard = new Phaser.Keyboard(game);
		keyboard.start();
		
		fx = game.add.audio('sfx');
        nii = [
            game.add.audio('nii1'),
            game.add.audio('nii2'),
            game.add.audio('nii3'),
            game.add.audio('nii4'),
            game.add.audio('nii5'),
            game.add.audio('nii6'),
            game.add.audio('nii7'),
            game.add.audio('nii8'),
        ];
        shiro.tint = SHIRO_NO_NII;
	},

	update: function() {
		//  Collide the player and the stars with the platforms
		game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(shiro, platforms);
        game.physics.arcade.collide(steph, platforms);
        //game.physics.arcade.collide(stars, shiro);
		
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

        if(Phaser.Rectangle.intersects(shiro.getBounds(), stars.getBounds())) {
		    game.physics.arcade.overlap(shiro, stars, this.collectStar, null, this);
        }

        if(shiroFollowing === 1) {
            shiro.tint = SHIRO_NO_NII;
            if(Math.abs((shiro.x + shiro.body.width * 0.5) - (player.x + player.body.width * 0.5)) < 30) {
                shiro.body.velocity.x = 0;
                if(Math.abs((shiro.y + shiro.body.height * 0.5) - (player.y + player.body.height * 0.5)) < 30) {
                    shiro.tint = SHIRO_WITH_NII;
                }
            }
            else if(shiro.x < player.x) {
                shiro.body.velocity.x = 150 + shiroSpeed;
                shiro.frame = 1;
            }
            else if(shiro.x > player.x) {
                shiro.body.velocity.x = -150 - shiroSpeed;
                shiro.frame = 0;
            }

            if((shiro.body.bottom - player.body.bottom) > 30) {
                shiro.body.velocity.y = -800;
            }

            if(Date.now() - shiroTimeOfSeduction > 3000) {
                shiroFollowing = 0;
                shiro.body.velocity.x = 0;
                shiroSpeed = 0;
                shiro.tint = SHIRO_NO_NII;
            }
        }
        
        if(Phaser.Rectangle.intersects(steph.getBounds(), stars.getBounds())) {
		    game.physics.arcade.overlap(steph, stars, this.collectStar, null, this);
        }

        if(stephFollowing === 0) {
            steph.tint = STEPH_NO_LOVE;
            if(stephGoingRight === 1) {
                steph.body.velocity.x = 200;
                steph.frame = 1;
                if(steph.x + steph.body.width + 10 > game.world.width) {
                    stephGoingRight = 0;
                }
            }
            else {
                steph.body.velocity.x = -200;
                steph.frame = 0;
                if(steph.x - 10 < 0) {
                    stephGoingRight = 1;
                }
            }
        }
        else {
            steph.tint = STEPH_IN_LOVE;
            if(Math.abs((steph.x + steph.body.width * 0.5) - (player.x + player.body.width * 0.5)) < 30) {
                steph.body.velocity.x = 0;
                if(Math.abs((steph.y + steph.body.height * 0.5) - (player.y + player.body.height * 0.5)) < 30) {
                    //shiro.tint = SHIRO_WITH_NII;
                }
            }
            else if(steph.x < player.x) {
                steph.body.velocity.x = 150 + stephSpeed;
                steph.frame = 1;
            }
            else if(steph.x > player.x) {
                steph.body.velocity.x = -150 - stephSpeed;
                steph.frame = 0;
            }

            if((steph.body.bottom - player.body.bottom) > 30) {
                steph.body.velocity.y = -800;
            }

            if(Date.now() - stephTimeOfSeduction > 3000) {
                stephFollowing = 0;
                steph.body.velocity.x = 0;
                stephSpeed = 0;
                steph.tint = STEPH_NO_LOVE;
            }
        }

		//game.physics.arcade.overlap(shiro, stars, this.collectStar, null, this);
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
	
        if(player === shiro) {
            shiroFollowing = 1;
            shiroTimeOfSeduction = Date.now();
            if(shiroSpeed < 100)
                shiroSpeed += 2;
            if(!this.niiPlaying())
                nii[(currentNii++ % nii.length)].play();
        }
        else if(player === steph) {
            stephFollowing = 1;
            stephTimeOfSeduction = Date.now();
            if(stephSpeed < 100)
                stephSpeed += 2;
            // TODO sounds
        }
	},

    niiPlaying: function() {
        for(var i = 0; i < nii.length; i++) {
            if(nii[i].isPlaying)
                return true;
        }
        return false;
    }
}

game.state.add('main', main_state);
game.state.start('main');
