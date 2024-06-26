var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: 0,
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);

var player;
var cursors;
var Score = 0;
var ScoreText;
var initialTime = 60;
var TimerText;
var timer;
var gameOver = false;
var objects;
var initialNumberOfObjects = 10;
var currentNumberOfObjects = initialNumberOfObjects;
var endText;
var worldWidth = 2000;
var worldHeight = 1100;
var enemies;

function preload() {
    // Load assets
    this.load.image('background', 'assets/background/space.jpg');
    this.load.image('player', 'assets/player.png');
    this.load.image('object1', 'assets/spacemoor-1.png')
    this.load.image('object2', 'assets/spacemoor-2.png')
}

function create ()
{

    //Add background
    background = this.add.tileSprite(0, 0, worldWidth, worldHeight, "background").setOrigin(0, 0);

    //#region Player
    player = this.physics.add.sprite(1000, 550, 'player').setScale(0.15)
        .setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();
    //#endregion

    //Creating multi func for objects
    objects = this.physics.add.staticGroup();


    //Creating objects
    object1 = this.physics.add.staticGroup();
    createWorldObjects(object1, 'object1')

    object2 = this.physics.add.staticGroup();
    createWorldObjects(object2, 'object2')

    this.physics.add.collider(player, object1, collectObject, null, this);
    this.physics.add.collider(player, object2, collectObject, null, this);

    //Add score
    ScoreText = this.add.text(16, 16, 'Score: 0', {fontSize: '35px', fill: '#fff'}).setScrollFactor(0);

    //#region Timer
    TimerText = this.add.text(800, 16, 'Time: ' + formatTime(initialTime), { fontSize: '35px', fill: '#fff' }).setScrollFactor(0);

    timer = this.time.addEvent({
        delay: 1000,
        callback: updateTime,
        callbackScope: this,
        loop: true
    });
    //#endregion

   

    //Camera settings
    this.cameras.main.setBounds(0, 0, worldWidth, 1080);
    this.physics.world.setBounds(0, 0, worldWidth, 1080);

    // Start camera follow
    this.cameras.main.startFollow(player);


    createWorldObjects(object1, 'object1', initialNumberOfObjects);
    createWorldObjects(object2, 'object2', initialNumberOfObjects);
}

function update ()
{
    //#region Movement
    player.setVelocity(0)

    if (cursors.left.isDown && cursors.up.isDown) {
        player.setVelocityX(-400);
        player.setVelocityY(-400);
        player.setAngle(-45); // Rotate player 45 degrees
    } else if (cursors.right.isDown && cursors.up.isDown) {
        player.setVelocityX(400);
        player.setVelocityY(-400);
        player.setAngle(45); // Rotate player 45 degrees (opposite direction)
    } else if (cursors.left.isDown && cursors.down.isDown) {
        player.setVelocityX(-400);
        player.setVelocityY(400);
        player.setAngle(-135); // Rotate player 135 degrees
    } else if (cursors.right.isDown && cursors.down.isDown) {
        player.setVelocityX(400);
        player.setVelocityY(400);
        player.setAngle(135); // Rotate player 135 degrees (opposite direction)
    } else if (cursors.left.isDown) {
        player.setVelocityX(-400);
        player.setAngle(-90); // Rotate player 90 degrees
    } else if (cursors.right.isDown) {
        player.setVelocityX(400);
        player.setAngle(90); // Rotate player 90 degrees (opposite direction)
    } else if (cursors.up.isDown) {
        player.setVelocityY(-400);
        player.setAngle(0); // Reset player angle
    } else if (cursors.down.isDown) {
        player.setVelocityY(400);
        player.setAngle(180); // Rotate player 180 degrees
    } else {
        player.setVelocityX(0);
        player.setVelocityY(0);
    }
//#endregion

}

function formatTime(seconds) {
    //format function
    var partInSeconds = seconds % 60;
    partInSeconds = partInSeconds.toString().padStart(2, '0');
    return `${partInSeconds}`;
}

function updateTime() {
    initialTime--;
    TimerText.setText('Time: ' + formatTime(initialTime));

    if (initialTime <= 0) {
        timer.remove(false);

        this.physics.pause();

        endText = this.add.text(250, 220, "Press ENTER to try again", {fontSize: '35px', fill: '#fff'}).setScrollFactor(0);
        this.add.text(250, 260, "Your score is: " + Score, {fontSize: '35px', fill: '#fff'}).setScrollFactor(0);

        document.addEventListener('keyup', function (event) {
            if (event.code === 'Enter') {
                window.location.reload();
            }
        });
    }
}

function collectObject(player, object) {
    object.disableBody(true, true);
    Score += 10;
    ScoreText.setText('Score: ' + Score);

    if (objectsAreGone()) {
        createNewObjects();
    }
}

function objectsAreGone() {
    return object1.countActive() === 0 && object2.countActive() === 0;
}

function createNewObjects() {
    createWorldObjects(object1, 'object1', initialNumberOfObjects);
    createWorldObjects(object2, 'object2', initialNumberOfObjects);
}

function createWorldObjects(objects, asset, count) {
    objects.clear(true, true);
    for (var i = 0; i < count; i++) {
        var randomX = Phaser.Math.Between(0, worldWidth);
        var randomY = Phaser.Math.Between(0, worldHeight);

        objects
            .create(randomX, randomY, asset)
            .setScale(Phaser.Math.FloatBetween(0.8, 1.5));
    }
}