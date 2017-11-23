
"use strict"

var stage, hero, heroSS, heroSize, q, tileSheet, levelLength, levelData, gameMusic, backgroundMusic, musicText, loadText, waterLevelText;
var title, playButton, howToButton, currentE, bottleLevel, bottleLevelCommand, bottleFillCommand, bottleInterval, pauseText, bottleLevelBack;
var stageHasMoved = 0;
var currentLevel = -1;
var gameRunning = false;
var standingOnPlat = false;
var canJump = false;
var doubleJump = false;
var canDuck = false;
var collisionDetectRight = false;
var collisionDetectLeft = false;
var collisionDetectUp = false;
var soundOn = false;
var firstPopup = false;
var firstWaterHasBeen = false;
var notFirstDuck = false;
var groundPlatforms = [];
var hardPlatforms = [];
var softPlatforms = [];
var hidePlatforms = [];
var enemies = [];
var movingPlatforms = [];
var dummyBackgrounds = [];
var hideObjects = [];
var lightCones = [];
var lightConeBlink = [];
var backgroundDummy = [];
var clouds = [];
var waterBottles = [];
var wins = [];
var platformMove = {
    moveRight : false,
    moveLeft : false
};
var tabletMove = {
    runningRight : false,
    walkingRight : false,
    runningLeft : false,
    walkingLeft : false
};
var keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

var touches = {
    startTouchY: null,
    endTouchY: null,
    startTouchX: null,
    endTouchX: null
};
var heroSizes = {
    duckSizeW: null,
    duckSizeH: null,
    walkSizeW: null,
    walkSizeH: null,
    jumpSizeW: null,
    jumpSizeH: null
};
var settings = {
    platformSpeed: 4,
    maxGravity: 6,
    resetJumpP: 20,
    doubleJumpPower: 10,
    heroSpeedFast: 5,
    enemyMove: 1,
    lightConeSpeed: 2
};


function preloader() {
    stage = new createjs.Stage("gameCanvas");
    title = new createjs.Bitmap("img/headline.png");
    title.regX = 385;
    title.regY = 33;
    title.x = stage.canvas.width/2;
    title.y = stage.canvas.height/2;
    loadText = new createjs.Text("Loading: 0%","30px Verdana", "black");
    loadText.textBaseline="middle";
    loadText.textAlign="center";
    loadText.x=stage.canvas.width/2;
    loadText.y=stage.canvas.height/1.5;
    stage.addChild(loadText, title);

    q = new createjs.LoadQueue(true);
    q.installPlugin(createjs.Sound);
    q.on("progress", loadProgress);
    q.on("complete", init);

    q.loadManifest([
        {id: "tiles0", src: "data/tiles-0.json" },
        {id: "tiles1", src: "data/tiles-1.json" },
        {id: "tiles2", src: "data/tiles-2.json" },
        {id: "tiles3", src: "data/tiles-3.json" },
        {id: "levels", src: "data/levels.json"},
        {id: "hero-0", src: "data/hero-0.json"},
        {id: "hero-1", src: "data/hero-1.json"},
        {id: "hero-2", src: "data/hero-2.json"},
        {id: "hero-3", src: "data/hero-3.json"},
        {id: "heroSize", src: "data/herosize.json"},
        {id: "enemy", src: "data/enemy.json"},
        {id: "back-0", src: "img/background-0.png"},
        {id: "back-1", src: "img/background-1.png"},
        {id: "back-2", src: "img/background-2.png"},
        {id: "back-3", src: "img/background-3.png"},
        {id: "howToButton", src: "img/howto-button.png"},
        {id: "playButton", src: "img/play-button.png"},
        {id: "busted", src: "img/busted.png"},
        {id: "popup0", src: "img/humans.png"},
        {id: "popup1", src: "img/duck.png"},
        {id: "popupWater", src: "img/water.png"},
        {id: "popupLevel0", src: "img/level0complete.png"},
        {id: "popupLevel1", src: "img/level1complete.png"},
        {id: "popupLevel2", src: "img/level2complete.png"},
        {id: "popupLevel3", src: "img/level3complete.png"},
        {id: "howto", src: "img/howto.png"},
        {id: "intro", src: "img/presentation.png"},
        {id: "waterbottle", src: "img/bottlewater.png"},
        {id: "jumpsound", src: "sound/jump_01.mp3"},
        {id: "yeahsound", src: "sound/yeah_01.mp3"},
        {id: "watersound", src: "sound/waterpouring_01.mp3"},
        {id: "whalesong", src: "sound/whale_01.mp3"},
        {id: "loop", src: "sound/dysterloop.mp3"},
        {id: "message", src: "sound/message.mp3"},
        {id: "tick", src: "sound/tick.mp3"},
        {id: "diesound", src: "sound/whale_01.mp3"},
        {id: "backsound0", src: "sound/beach.mp3"},
        {id: "backsound1", src: "sound/carpark.mp3"},
        {id: "backsound2", src: "sound/factory.mp3"},
        {id: "backsound3", src: "sound/military.mp3"}


    ]);


}

function loadProgress(e) {
    loadText.text = "Loading: " + (Math.round(e.progress*100)) + "%";
    stage.update();


}


function init() {

    stage.removeChild(loadText);

    playButton = new createjs.Bitmap(q.getResult("playButton"));
    playButton.regX = 89;
    playButton.regY = 17;
    playButton.x = stage.canvas.width / 3;
    playButton.y = stage.canvas.height / 1.5;

    howToButton = new createjs.Bitmap(q.getResult("howToButton"));
    howToButton.regX = 89;
    howToButton.regY = 17;
    howToButton.x = stage.canvas.width - (stage.canvas.width / 3);
    howToButton.y = stage.canvas.height / 1.5;

    stage.addChild(playButton, howToButton);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.on("tick", tock);

    howToButton.on("click", function () {
        var temp = new createjs.Bitmap(q.getResult("howto"));


        stage.addChild(temp);

        temp.on("click", function() {
            stage.removeChild(this);
        })


    });

    playButton.on("click", gameIntro);
}




function gameIntro() {
    stage.removeAllChildren();
    var t = new createjs.Bitmap(q.getResult("intro"));
    stage.addChild(t);
    t.on("click", function () {
        stage.removeChild(this);
        startGame();
    })
}


function startGame() {


    gameRunning = true;
    soundOn = true;


    tileSheet = new createjs.SpriteSheet(q.getResult("tiles"));
    heroSize = q.getResult("heroSize").herosize[0];
    heroSizes.duckSizeW = heroSize.duck[0].width;
    heroSizes.duckSizeH = heroSize.duck[0].height;
    heroSizes.walkSizeW = heroSize.walk[0].width;
    heroSizes.walkSizeH = heroSize.walk[0].height;
    heroSizes.jumpSizeW = heroSize.jump[0].width;
    heroSizes.jumpSizeH = heroSize.jump[0].height;

    pauseText = new createjs.Text("PAUSE", "45px Verdana", "white");
    pauseText.textBaseline= "middle";
    pauseText.textAlign = "center";
    pauseText.x = stage.canvas.width/2;
    pauseText.y = stage.canvas.height/2;

    waterLevelText = new createjs.Text("Slowing down", "30px Verdana", "white");
    waterLevelText.textBaseline= "middle";
    waterLevelText.textAlign = "center";
    waterLevelText.x = stage.canvas.width/2;
    waterLevelText.y = 40;


    musicText = new createjs.Text("Music On", "20px Verdana", "white");
    musicText.textBaseline="bottom";
    musicText.x = 10;
    musicText.y = stage.canvas.height - 10;


    bottleLevelBack = new createjs.Shape();
    bottleLevelBack.graphics.beginFill("grey").drawRoundRect(0,0, 100, 20, 3);
    bottleLevelBack.x = 20;
    bottleLevelBack.y = 20;
    bottleLevelBack.alpha = 0.5;

    bottleLevel = new createjs.Shape();
    bottleLevel.x = 20;
    bottleLevel.y = 20;
    bottleLevel.alpha = 0.7;
    bottleFillCommand = bottleLevel.graphics.beginFill("blue").command;
    bottleLevelCommand = bottleLevel.graphics.drawRoundRect(0,0, 100, 20, 3).command;


    window.addEventListener("keyup", keyUp);
    window.addEventListener("keydown", keyDown);
    document.addEventListener("touchstart", touchStart, true);
    document.addEventListener("touchmove", touchMove, true);
    document.addEventListener("touchend", touchEnd, true);


    nextLevel();
}


function nextLevel() {
    stage.removeAllChildren();
    clearInterval(bottleInterval);
    stageHasMoved = 0;
    currentLevel++;
    levelLength = 0;
    groundPlatforms = [];
    hardPlatforms = [];
    softPlatforms = [];
    hidePlatforms = [];
    enemies = [];
    movingPlatforms = [];
    dummyBackgrounds = [];
    hideObjects = [];
    lightCones = [];
    lightConeBlink = [];
    backgroundDummy = [];
    clouds = [];
    waterBottles = [];
    wins = [];
    gameRunning = true;
    if(backgroundMusic) {
        backgroundMusic.stop();
    }
    if(gameMusic) {
        gameMusic.stop();
    }
    var background = new createjs.Bitmap(q.getResult("back-"+currentLevel));
    stage.addChild(background);
    var musicLoop = new createjs.PlayPropsConfig().set({interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1, volume: 0.04});
    gameMusic = createjs.Sound.play("loop", musicLoop);
    var tempSound = new createjs.PlayPropsConfig().set({interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1, volume: 0.1});
    backgroundMusic = createjs.Sound.play("backsound"+currentLevel, tempSound);
    if(!soundOn) {
        gameMusic.paused= true;
        backgroundMusic.paused = true;
    }


    var temp = q.getResult('levels');
    tileSheet = new createjs.SpriteSheet(q.getResult("tiles"+currentLevel));
    levelData = temp.levels[currentLevel];

    levelItems(levelData.clouds, clouds);
    levelItems(levelData.backgroundDummy, backgroundDummy);
    levelItems(levelData.dummies, dummyBackgrounds);
    levelItems(levelData.ground, groundPlatforms);
    levelItems(levelData.softPlatforms, softPlatforms);
    levelItems(levelData.hardPlatforms, hardPlatforms);


    for(var i = 0; i<levelData.hidePlatforms.length; i++) {
        t = new createjs.Sprite(tileSheet, levelData.hidePlatforms[i].sprite);
        t.width = levelData.hidePlatforms[i].width;
        t.height = levelData.hidePlatforms[i].height;
        t.x = levelData.hidePlatforms[i].x;
        t.y = levelData.hidePlatforms[i].y;
        t.hideSide = levelData.hidePlatforms[i].hideSide;
        stage.addChild(t);
        hidePlatforms.push(t);
    }

    for( i = 0; i<levelData.movingplatforms.length; i++) {
        t = new createjs.Sprite(tileSheet, levelData.movingplatforms[i].sprite);
        t.width = levelData.movingplatforms[i].width;
        t.height = levelData.movingplatforms[i].height;
        t.x = levelData.movingplatforms[i].x;
        t.y = levelData.movingplatforms[i].y;
        t.speed = levelData.movingplatforms[i].speed;
        t.direction = levelData.movingplatforms[i].direction;
        stage.addChild(t);
        movingPlatforms.push(t);

    }


    for(i = 0; i<levelData.lightCones.length; i++) {
        t = new createjs.Sprite(tileSheet, levelData.lightCones[i].sprite);
        t.width = levelData.lightCones[i].width;
        t.height = levelData.lightCones[i].height;
        t.x = levelData.lightCones[i].x;
        t.y = levelData.lightCones[i].y;
        t.maxX = levelData.lightCones[i].maxX;
        t.minX = levelData.lightCones[i].minX;
        t.lightMoveRight = true;
        t.speed = levelData.lightCones[i].speed;
        lightCones.push(t);
        stage.addChild(t);
    }

    for(i = 0; i<levelData.lightConeBlink.length; i++) {
        t = new createjs.Sprite(tileSheet, levelData.lightConeBlink[i].sprite);
        t.width = levelData.lightConeBlink[i].width;
        t.height = levelData.lightConeBlink[i].height;
        t.x = levelData.lightConeBlink[i].x;
        t.y = levelData.lightConeBlink[i].y;
        t.range = levelData.lightConeBlink[i].range;
        t.orgX = t.x;
        t.alpha = 0;
        t.isShowing = false;
        t.canHurt = false;
        lightConeBlink.push(t);
        stage.addChild(t);
    }

    levelItems(levelData.hideObjects, hideObjects);
    levelItems(levelData.waterBottles, waterBottles);
    levelItems(levelData.wins, wins);



    for(i = 0; i<levelData.enemies.length; i++) {
        var enemySheet = new createjs.SpriteSheet(q.getResult("enemy"));
        var t = new createjs.Sprite(enemySheet, levelData.enemies[i].sprite);
        t.width = levelData.enemies[i].width;
        t.height = levelData.enemies[i].height;
        t.x = levelData.enemies[i].x;
        t.y = levelData.enemies[i].y;
        t.maxX = levelData.enemies[i].maxX;
        t.minX = levelData.enemies[i].minX;
        t.enemyMoveRight = true;
        t.speed = levelData.enemies[i].speed;
        enemies.push(t);
        stage.addChild(t);
    }








    heroSS = new createjs.SpriteSheet(q.getResult("hero-"+currentLevel));
    hero = new createjs.Sprite(heroSS, "standright");
    hero.y = 420;
    hero.width = heroSizes.walkSizeW;
    hero.height = heroSizes.walkSizeH;
    hero.gravityEffect = 0;
    hero.jumpPower = 0;
    hero.speed = settings.heroSpeedFast;
    hero.isHiding = false;
    hero.isHiddenLight = false;
    stage.addChild(hero);


    stage.addChild(bottleLevelBack, bottleLevel, musicText);


    bottleWaterLevels();

}





function levelItems(dataArrayName, arrayName) {
    var i, r;
    var dataName = dataArrayName;

    for(i = 0; i<dataName.length; i++) {
        for(r=0; r<dataName[i].repeat; r++) {
            //tileSheet = new createjs.SpriteSheet(q.getResult("tiles"+currentLevel));
            var t = new createjs.Sprite(tileSheet, dataName[i].sprite);
            t.width = dataName[i].width;
            t.height = dataName[i].height;
            t.x = dataName[i].x+t.width*r;
            t.y = dataName[i].y;
            stage.addChild(t);
            arrayName.push(t);
        }
    }

}





function touchStart(e) {
    var touch = e.touches[0];
    touches.startTouchX=touch.pageX;
    touches.startTouchY=touch.pageY;

}

function touchMove(e) {
    var touch = e.touches[0];
    touches.endTouchX=touch.pageX;
    touches.endTouchY=touch.pageY;
    e.preventDefault(); //scroll

}


function touchEnd(e) {
    var dx = touches.endTouchX - touches.startTouchX;
    var dy = touches.endTouchY - touches.startTouchY;


    if(Math.abs(dx) > Math.abs(dy)) {

        //horizontal swipe right
        if(dx > 150) {

            if(tabletMove.runningRight){
                tabletMove.runningRight = false;

            } else {

                tabletMove.walkingRight = false;
                tabletMove.runningLeft = false;
                tabletMove.walkingLeft = false;

                tabletMove.runningRight = true;
            }



        } else if(dx > 0 ) {
            if(tabletMove.walkingRight){
                tabletMove.walkingRight = false;

            } else {
                tabletMove.runningRight = false;
                tabletMove.runningLeft = false;
                tabletMove.walkingLeft = false;

                tabletMove.walkingRight = true;
            }


        }

        //horizontal swipe left
        if(dx < -150) {
            if(tabletMove.runningLeft){
                tabletMove.runningLeft = false;

            } else {

                tabletMove.runningRight = false;
                tabletMove.walkingRight = false;
                tabletMove.walkingLeft = false;

                tabletMove.runningLeft = true;
            }

        } else if(dx < 0) {
            if(tabletMove.walkingLeft){
                tabletMove.walkingLeft = false;

            } else {

                tabletMove.runningRight = false;
                tabletMove.runningLeft = false;
                tabletMove.walkingRight = false;

                tabletMove.walkingLeft = true;
            }

        }


    } else {
        //vertical swipe up
        if(dy < -150) {
            //double jumping
            if(canJump) {
                hero.jumpPower = (settings.resetJumpP/2)+settings.doubleJumpPower;
            }


            if(hero.jumpPower > 0) {

                /*
                 collisionDetectUp = false;
                 hero.nextY= hero.y-hero.jumpPower;
                 hero.nextX = hero.x;

                 for(i=0; i < platforms.length; i++) {
                 if(predictHit(hero, platforms[i])) {
                 collisionDetectUp = true;
                 break;
                 }
                 }
                 if(collisionDetectUp) {
                 hero.jumpPower = 0;
                 }

                 */

                hero.y-=hero.jumpPower;
                hero.jumpPower--;
                }


           // hero.y-=10;
        } else if(dy < 0) {
            //single jumping
            if(canJump) {
                hero.jumpPower = settings.resetJumpP;
            }


            if(hero.jumpPower > 0) {

                /*
                 collisionDetectUp = false;
                 hero.nextY= hero.y-hero.jumpPower;
                 hero.nextX = hero.x;

                 for(i=0; i < platforms.length; i++) {
                 if(predictHit(hero, platforms[i])) {
                 collisionDetectUp = true;
                 break;
                 }
                 }
                 if(collisionDetectUp) {
                 hero.jumpPower = 0;
                 }

                 */

                hero.y-=hero.jumpPower;
                hero.jumpPower--;
            }


            hero.y--;
        }
        //vertical swipe down
        if(dy > 150) {
            hero.y+=10;

        } else if(dy > 0 ) {
            hero.y++;
        }



    }

}



function keyUp(e) {
    switch (e.keyCode) {

        case 37:
            keys.left = false;
            if(gameRunning) {

                if (gameRunning) {
                    hero.gotoAndStop("standleft");
                    hero.width = heroSizes.walkSizeW;
                    hero.height = heroSizes.walkSizeH;
                }
            }
            break;
        case 38:
            keys.up = false;
            if(gameRunning) {
                if (soundOn) {
                    var jumpSound = createjs.Sound.play("jumpsound");
                    jumpSound.setVolume(0.05);
                }
                if (hero.currentAnimation == "jumpright") {
                    hero.on("animationend", function () {
                        hero.width = heroSizes.walkSizeW;
                        hero.height = heroSizes.walkSizeH;
                        if (keys.right) {
                            hero.gotoAndPlay("right");
                        } else {
                            hero.gotoAndStop("standright");
                        }

                    })
                }
                if (hero.currentAnimation == "jumpleft") {
                    hero.on("animationend", function () {
                        hero.width = heroSizes.walkSizeW;
                        hero.height = heroSizes.walkSizeH;
                        if (keys.left) {
                            hero.gotoAndPlay("left");
                        } else {
                            hero.gotoAndStop("standleft");
                        }
                    })
                }
            }
            //jumping();
            break;
        case 39:

            keys.right = false;
            if(gameRunning) {
                hero.gotoAndStop("standright");
                hero.width = heroSizes.walkSizeW;
                hero.height = heroSizes.walkSizeH;
            }
            break;
        case 40:
            keys.down = false;
            if(gameRunning) {
                hero.isHiding = false;
                if (hero.currentAnimation == "standduckleft" || hero.currentAnimation == "duckleft") {
                    hero.gotoAndStop("standleft");
                    hero.width = heroSizes.walkSizeW;
                    hero.height = heroSizes.walkSizeH;
                }
                if (hero.currentAnimation == "standduckright" || hero.currentAnimation == "duckright") {
                    hero.gotoAndStop("standright");
                    hero.width = heroSizes.walkSizeW;
                    hero.height = heroSizes.walkSizeH;
                }
            }
            break;
        case 77:
            if(soundOn){
                soundOn = false;
                gameMusic.paused = true;
                backgroundMusic.paused = true;
                musicText.text="Music Off";

            } else{
                soundOn = true;
                gameMusic.paused = true;
                backgroundMusic.paused = true;
                musicText.text="Music On";
            }
            break;
        case 80:

            if(gameRunning){
                gameRunning = false;

                stage.addChild(pauseText);

            } else{
                gameRunning = true;
                stage.removeChild(pauseText);
            }


            break;
    }

}


function keyDown(e) {

    if(gameRunning) {

        switch (e.keyCode) {
            case 37:
                keys.left = true;
                if (hero.currentAnimation != "left") {
                    hero.gotoAndPlay("left");
                    hero.width = heroSizes.walkSizeW;
                    hero.height = heroSizes.walkSizeH;

                }
                break;
            case 38:
                keys.up = true;
                if (hero.currentAnimation == "right" || hero.currentAnimation == "standright" || hero.currentAnimation == "duckright" || hero.currentAnimation == "standduckleft") {
                    hero.gotoAndPlay("jumpright");
                    hero.width = heroSizes.jumpSizeW;
                    hero.height = heroSizes.jumpSizeH;
                }
                if (hero.currentAnimation == "left" || hero.currentAnimation == "standleft" || hero.currentAnimation == "duckleft" || hero.currentAnimation == "standduckleft") {
                    hero.gotoAndPlay("jumpleft");
                    hero.width = heroSizes.jumpSizeW;
                    hero.height = heroSizes.jumpSizeH;

                }
                break;
            case 39:
                keys.right = true;
                if (hero.currentAnimation != "right") {
                    hero.gotoAndPlay("right");
                    hero.width = heroSizes.walkSizeW;
                    hero.height = heroSizes.walkSizeH;

                }
                break;
            case 40:
                if (canDuck && standingOnPlat) {
                    hero.isHiding = true;
                    keys.down = true;
                    if (hero.currentAnimation == "left" || hero.currentAnimation == "standleft") {
                        hero.width = heroSizes.duckSizeW;
                        hero.height = heroSizes.duckSizeH;
                        hero.gotoAndPlay("duckleft");
                        hero.on("animationend", function () {
                            hero.gotoAndStop("standduckleft");

                        })
                    }
                    if (hero.currentAnimation == "right" || hero.currentAnimation == "standright") {
                        hero.width = heroSizes.duckSizeW;
                        hero.height = heroSizes.duckSizeH;
                        hero.gotoAndPlay("duckright");
                        hero.on("animationend", function () {
                            hero.gotoAndStop("standduckright");

                        })
                    }

                }
                break;
        }
    }

}







//        HITEST

function objOnPlat(moving, stationary) {
    if(moving.x < stationary.x +stationary.width
        && moving.x + moving.width > stationary.x
        && Math.abs((moving.y + moving.height)-stationary.y)<4
    ) {
        moving.y=stationary.y-moving.height;
        return true;
    }

    return false;
}

function objOnMovingPlat(moving1, moving2) {
    if(moving1.x < moving2.x +moving2.width
        && moving1.x + moving1.width > moving2.x
        && Math.abs((moving1.y + moving1.height)-moving2.y)<10
    ) {
        moving1.y=moving2.y-moving1.height;
        return true;
    }

    return false;
}


function predictHit(obj1, obj2) {
    if ( obj1.nextX >= obj2.x + obj2.width
        || obj1.nextX + obj1.width <= obj2.x
        || obj1.nextY >= obj2.y + obj2.height
        || obj1.nextY + obj1.height <= obj2.y )
    {
        return false;
    }
    return true;
}

function predictDuck(obj1, obj2) {
    if ( obj1.nextX >= obj2.x + obj2.width
        || obj1.nextX + obj1.width*2 <= obj2.x
        || obj1.nextY >= obj2.y + obj2.height
        || obj1.nextY + obj1.height <= obj2.y )
    {
        return false;
    }
    return true;
}


function hitTest(rect1,rect2) {
    if ( rect1.x >= rect2.x + rect2.width
        || rect1.x + rect1.width <= rect2.x
        || rect1.y >= rect2.y + rect2.height
        || rect1.y + rect1.height <= rect2.y )
    {
        return false;
    }
    return true;
}





//        HEROMOVES



function moveHero() {
    var emptySpace = 0;
    var firstPlat, finalPlat, fullLength;
    platformMove.moveRight = false;
    platformMove.moveLeft = false;

    for(var i=0; i<levelData.ground.length; i++) {
        emptySpace += levelData.ground[i].emptyspace;

    }


    firstPlat = groundPlatforms[0];
    finalPlat = groundPlatforms[(groundPlatforms.length-1)];
    fullLength = finalPlat.x + emptySpace;



    if(keys.left) {
        canDuck = false;
        collisionDetectLeft = false;

        hero.nextY = hero.y+hero.jumpPower;
        hero.nextX = hero.x-hero.speed;
        for(i=0; i < hardPlatforms.length; i++) {
            if(predictHit(hero, hardPlatforms[i])) {
                collisionDetectLeft = true;
                break;
            }
        }
        for(i=0; i < movingPlatforms.length; i++) {
            if(predictHit(hero, movingPlatforms[i])) {
                collisionDetectLeft = true;
                break;
            }
        }
        for(i=0; i < hidePlatforms.length; i++) {
            if(predictDuck(hero, hidePlatforms[i])) {
                if(hidePlatforms[i].hideSide == "right") {
                    console.log("can duck");
                    canDuck = true;
                }
            }
            if(predictHit(hero, hidePlatforms[i])) {
                collisionDetectLeft = true;
                break;
            }

        }


        if(!collisionDetectLeft) {
            if (hero.x > stage.canvas.width / 4) {
                hero.x -= hero.speed;
            } else {
                if (firstPlat.x < 0) {
                    platformMove.moveLeft = true;
                } else if (hero.x > 0) {
                    hero.x -= hero.speed;
                }
            }
        }
    }

    if(keys.right) {
        canDuck = false;

        collisionDetectRight = false;
        hero.nextY = hero.y+ hero.jumpPower;
        hero.nextX = hero.x+hero.speed;
        for(i=0; i < hardPlatforms.length; i++) {
            if(predictHit(hero, hardPlatforms[i])) {
                collisionDetectRight = true;
                break;

            }
        }
        for(i=0; i < movingPlatforms.length; i++) {
            if(predictHit(hero, movingPlatforms[i])) {
                collisionDetectRight = true;
                break;

            }
        }

        for(i=0; i < hidePlatforms.length; i++) {
            if(predictDuck(hero, hidePlatforms[i])) {
                if(hidePlatforms[i].hideSide == "left") {
                    console.log("can duck")
                    canDuck = true;
                }
            }
            if(predictHit(hero, hidePlatforms[i])) {
                collisionDetectRight = true;
                break;
            }

        }

        if(!collisionDetectRight){
            if(hero.x < stage.canvas.width/1.5) {
                hero.x +=hero.speed;

            } else {
                if(finalPlat.x > stage.canvas.width-finalPlat.width) {
                    platformMove.moveRight = true;
                } else if(hero.x < stage.canvas.width - hero.width) {
                    hero.x +=hero.speed;
                }

            }
        }
    }



    //jumping
    if(keys.up && canJump) {
        hero.jumpPower = settings.resetJumpP;
        doubleJump = true;
    }


    if(hero.jumpPower > 0) {
        collisionDetectUp = false;
        hero.nextY= hero.y-hero.jumpPower;
        hero.nextX = hero.x;

        for(i=0; i < hardPlatforms.length; i++) {
            if(predictHit(hero, hardPlatforms[i])) {
                collisionDetectUp = true;
                break;
            }
        }

        for(i=0; i < movingPlatforms.length; i++) {
            if(predictHit(hero, movingPlatforms[i])) {
                collisionDetectUp = true;
                break;
            }
        }
        if(collisionDetectUp) {
            hero.jumpPower = 0;
        }


        hero.y-=hero.jumpPower;
        hero.jumpPower--;

        if(keys.up && doubleJump && hero.jumpPower <= settings.resetJumpP/2) {
            hero.jumpPower+=settings.doubleJumpPower;
            doubleJump = false;
        }
    }



}





function heroMoveTablet(){
    var finalPlat = groundPlatforms[(groundPlatforms.length-1)];
    var firstPlat = groundPlatforms[0];

    //right
    if(hero.x < stage.canvas.width/1.5) {
        if(tabletMove.runningRight){
            hero.x+=settings.heroSpeedFast;
        }

        if(tabletMove.walkingRight) {
            hero.x++;
        }

    } else {

        if(finalPlat.x > stage.canvas.width-finalPlat.width) {
            platformMove.moveRight = true;

        } else if(hero.x < stage.canvas.width - hero.width) {

            if(tabletMove.runningRight){
                hero.x+=settings.heroSpeedFast;
            }

            if(tabletMove.walkingRight) {
                hero.x++;
            }
        }
    }



    //left
    if(hero.x > stage.canvas.width/4) {
        if(tabletMove.runningLeft){
            hero.x-=settings.heroSpeedFast;
        }

        if(tabletMove.walkingLeft){
            hero.x--;
        }
    } else {
        if(firstPlat.x < 0) {
            platformMove.moveLeft = true;
        } else if(hero.x > 0) {
            if(tabletMove.runningLeft){
                hero.x-=settings.heroSpeedFast;
            }

            if(tabletMove.walkingLeft){
                hero.x--;
            }
        }
    }


}




function onPlatform() {
    standingOnPlat = false;
    canJump = false;

    var allLevelPlatforms = [groundPlatforms, hardPlatforms, softPlatforms, hidePlatforms];

    for(var i = 0; i<allLevelPlatforms.length; i++) {
        for(var r=0; r<allLevelPlatforms[i].length; r++){

            if(objOnPlat(hero, allLevelPlatforms[i][r])){
                standingOnPlat = true;
                canJump = true;

            }
        }
    }

    for(i=0; i<movingPlatforms.length; i++) {
        if(objOnMovingPlat(hero, movingPlatforms[i])){
            standingOnPlat = true;
            canJump = true;
        }
    }

}


function gravity() {

    if(!standingOnPlat){

        hero.y+=hero.gravityEffect;
        hero.gravityEffect++;
        if (hero.gravityEffect > settings.maxGravity){
            hero.gravityEffect = settings.maxGravity;
        }
    }
}



function movePlatforms() {

    settings.platformSpeed = settings.heroSpeedFast-1;

    var allLevelObjects = [groundPlatforms, hardPlatforms, softPlatforms, dummyBackgrounds, movingPlatforms, hidePlatforms, lightConeBlink, hideObjects, waterBottles, wins];

    if(platformMove.moveRight){
        stageHasMoved -= settings.platformSpeed;
        for(var i = 0; i<allLevelObjects.length; i++) {

            for(var r=0; r<allLevelObjects[i].length; r++){
                allLevelObjects[i][r].x-=settings.platformSpeed;

            }

        }


    }


    if(platformMove.moveLeft){
        stageHasMoved += settings.platformSpeed;
        for(i = 0; i<allLevelObjects.length; i++) {

            for(r=0; r<allLevelObjects[i].length; r++){
                allLevelObjects[i][r].x+=settings.platformSpeed;

            }

        }
    }

}



function moveEnemy() {

    for(var i=0; i<enemies.length; i++) {

            if (enemies[i].enemyMoveRight) {
                if (enemies[i].x > enemies[i].maxX+stageHasMoved) {
                    enemies[i].scaleX = enemies[i].scaleX * -1;
                    enemies[i].regX = enemies[i].width;
                    enemies[i].x-= enemies[i].width/2;
                    enemies[i].enemyMoveRight = false;


                } else {
                    enemies[i].x += settings.enemyMove + enemies[i].speed;
                    if(platformMove.moveRight){
                        enemies[i].x -= settings.platformSpeed;
                    }
                    if(platformMove.moveLeft){
                        enemies[i].x += settings.platformSpeed;

                    }
                }
            } else {
                if (enemies[i].x < enemies[i].minX+stageHasMoved) {
                    enemies[i].scaleX = enemies[i].scaleX * -1;
                    enemies[i].regX = 0;
                    enemies[i].x += enemies[i].width/2;
                    enemies[i].enemyMoveRight = true;

                } else {
                    enemies[i].x -= settings.enemyMove + enemies[i].speed;
                    if(platformMove.moveRight){
                        enemies[i].x -= settings.platformSpeed;
                    }
                    if(platformMove.moveLeft){
                        enemies[i].x += settings.platformSpeed;
                    }
                }
            }
    }




    for(i=0; i<lightCones.length; i++) {


        if (lightCones[i].lightMoveRight) {
            if (lightCones[i].x > lightCones[i].maxX+stageHasMoved) {
                lightCones[i].lightMoveRight = false;

            } else {
                lightCones[i].x += settings.lightConeSpeed + lightCones[i].speed;
                if(platformMove.moveRight){
                    lightCones[i].x -= settings.platformSpeed;
                }
                if(platformMove.moveLeft){
                    lightCones[i].x += settings.platformSpeed;

                }
            }
        } else {
            if (lightCones[i].x < lightCones[i].minX+stageHasMoved) {
                lightCones[i].lightMoveRight = true;

            } else {
                lightCones[i].x -= settings.lightConeSpeed + lightCones[i].speed;
                if(platformMove.moveRight){
                    lightCones[i].x -= settings.platformSpeed;
                }
                if(platformMove.moveLeft){
                    lightCones[i].x += settings.platformSpeed;
                }
            }
        }
    }

}


function moveMovingPlatforms() {
    
    var newYposition = (Math.floor(Math.random() * 30));

    for (var i=0; i < movingPlatforms.length; i++) {

        if(movingPlatforms[i].direction == "down") {
            if (movingPlatforms[i].y < stage.canvas.height) {

                movingPlatforms[i].y += movingPlatforms[i].speed;

            } else {
                movingPlatforms[i].y = -newYposition;
            }
        } else {
            if (movingPlatforms[i].y > -movingPlatforms[i].height) {

                movingPlatforms[i].y -= movingPlatforms[i].speed;

            } else {
                movingPlatforms[i].y = stage.canvas.width + newYposition;
            }
        }
    }
}


function lightConeBlinking() {
    var flashDelay = 30;
    var tickerTime = createjs.Ticker.getTicks();


    for(var i =0; i<lightConeBlink.length; i++){
        if(!lightConeBlink[i].isShowing) {
            lightConeBlink[i].isShowing = true;
            lightConeBlink[i].x = lightConeBlink[i].orgX + Math.floor(Math.random()* lightConeBlink[i].range) + stageHasMoved;

            flashDelay += (Math.floor(Math.random()* 10)*10);
            if(tickerTime % tickerTime == 0) {
                lightFlashTween(lightConeBlink[i]);
            }
        }

        if(lightConeBlink[i].canHurt) {

            flashDelay += (Math.floor(Math.random()* 10)*30);

            if(tickerTime % flashDelay == 0) {
                lightsOut(lightConeBlink[i]);
            }
        }

    }
}



function lightsOut(currentLight){

    createjs.Tween.get(currentLight)
        .to(
            {
                alpha:0
            },
            1000,
            createjs.Ease.bounceIn
        )
        .call( function () {
            currentLight.canHurt = false;
            currentLight.isShowing = false;

        });
}


function lightFlashTween(currentLight) {

    createjs.Tween.get(currentLight)
        .to(
            {
                alpha:1
            },
            1500,
            createjs.Ease.bounceIn
        )
        .call( function () {
            currentLight.canHurt = true;

        });

}





function checkCollision() {
    var i;
    hero.isHiddenLight = false;


    for(i=enemies.length-1; i >=0; i--) {
        if (hitTest(hero, enemies[i])) {
            if(!hero.isHiding) {
                gameRunning = false;
                currentE = enemies[i];
                currentE.gotoAndPlay("spotted");
                currentE.on("animationend", function () {
                    currentE.gotoAndStop("stand");
                    //stage.removeChild(currentE);
                    //enemies.splice(currentE, 1);
                    die();
                })


            }
        }
    }
    

    for(i=hideObjects.length-1; i >=0; i--) {
        if (hitTest(hero, hideObjects[i])) {
            hero.isHiddenLight = true;
        }

    }



    for(i=lightConeBlink.length-1; i >=0; i--) {

        if(lightConeBlink[i].canHurt){
            if (hitTest(hero, lightConeBlink[i])) {
                die();
            }
        }
    }

    for(i=lightCones.length-1; i >=0; i--) {
        if(!hero.isHiddenLight) {
            if (hitTest(hero, lightCones[i])) {
                die();
            }
        }
    }




    for(i=waterBottles.length-1; i >=0; i--) {

        if (hitTest(hero, waterBottles[i])) {
            if (soundOn) {
                if(soundOn) {
                    var waterSound = createjs.Sound.play("watersound");
                    waterSound.setVolume(0.5);
                }
            }

            var t = new createjs.Bitmap(q.getResult("waterbottle"));
            t.x = waterBottles[i].x;
            t.y = waterBottles[i].y;
            stage.addChild(t);
            stage.removeChild(waterBottles[i]);
            waterBottles.splice(i, 1);
            createjs.Tween.get(t)
                .to({x: 60, y: 0, alpha: 0.5}, 1500, createjs.Ease.circOut)
                .call( function () {

                    if(bottleLevelCommand.w > 50){
                        createjs.Tween.get(bottleLevelCommand)
                            .to({w: 100}, 1500, createjs.Ease.quadInOut)
                    } else {
                        var currentW = bottleLevelCommand.w + 50;
                        createjs.Tween.get(bottleLevelCommand)
                            .to({w: currentW}, 1500, createjs.Ease.quadInOut)
                    }
                    stage.removeChild(this);

                });



            if(!firstWaterHasBeen) {
                gameRunning = false;
                if(soundOn) {
                    var s = createjs.Sound.play("message");
                    s.setVolume(1);
                }
                t = new createjs.Bitmap(q.getResult("popupWater"));
                stage.addChild(t);

                t.on("click", function () {
                    stage.removeChild(this);
                    gameRunning = true;
                    firstWaterHasBeen = true;
                })
            }
        }
    }


    for(i=wins.length-1; i >=0; i--) {

        if (hitTest(hero, wins[i])) {
            levelChange();
        }

    }

}


function levelChange(){
    gameRunning = false;


    if(soundOn) {
        var s = createjs.Sound.play("yeahsound");
        s.setVolume(0.5);
    }
    var popUp = new createjs.Bitmap(q.getResult("popupLevel"+currentLevel));
    stage.addChild(popUp);

    if(currentLevel !== 3){
        popUp.on("click", function (){
            nextLevel();

        })
    }
}



function cloudMove() {

    for(var i=0; i<clouds.length; i++) {
        if(clouds[i].x > stage.canvas.width){
            clouds[i].x = -400;
            clouds[i].y = Math.floor(Math.random()* 290);

        } else{
            clouds[i].x+= 0.5;

        }

    }

}


function firstLevelPopups() {

    if(!firstPopup){
        if(hero.x > 400) {
            gameRunning = false;
            if(soundOn) {
                var s = createjs.Sound.play("message");
                s.setVolume(0.5);
            }
            var t = new createjs.Bitmap(q.getResult("popup0"));
            stage.addChild(t);

            t.on("click", function () {
                stage.removeChild(this);
                firstPopup = true;
                gameRunning = true;

            })

        }
    }

    if (canDuck) {
        if(!notFirstDuck) {
            gameRunning = false;
            if(soundOn) {
                s = createjs.Sound.play("message");
                s.setVolume(0.5);
            }
            t = new createjs.Bitmap(q.getResult("popup1"));
            stage.addChild(t);

            t.on("click", function () {
                stage.removeChild(this);
                notFirstDuck = true;
                gameRunning = true;

            })


        }

    }
}


function die() {
    var s;
    //var sPlaying = false;
    gameRunning = false;
    createjs.Tween.get(bottleLevelCommand)
        .to({w: 100}, 1500, createjs.Ease.quadInOut)


    if(soundOn) {
        if(!s) {
            s = createjs.Sound.play("diesound");
            s.setVolume(0.5);
            //sPlaying = true;
        }
    }
    currentLevel--;

    var t = new createjs.Bitmap(q.getResult("busted"));
    stage.addChild(t);

    t.on("click", function () {
        stage.removeChild(this);
        nextLevel();
    })


}



function bottleWaterLevels() {
    var tickSound;
    bottleInterval = setInterval(function () {

        if(gameRunning) {
            if (bottleLevelCommand.w > 1) {
                bottleLevelCommand.w--;
            } else {
                die();
            }

            if (bottleLevelCommand.w > 50) {
                hero.speed = settings.heroSpeedFast;
            } else if (bottleLevelCommand.w > 25) {
                hero.speed = settings.heroSpeedFast - 2;

            }

            if(bottleLevelCommand.w == 50 || bottleLevelCommand.w == 25) {
                waterLevelText.alpha = 0;
                stage.addChild(waterLevelText);

                createjs.Tween.get(waterLevelText)
                    .to({alpha: 1}, 1500, createjs.Ease.bounceIn)
                    .call( function () {
                        createjs.Tween.get(waterLevelText)
                            .to({alpha: 0}, 1500, createjs.Ease.bounceOut)
                            .call( function () {
                                stage.removeChild(this);
                            });
                    });


            }

            if (bottleLevelCommand.w < 25) {
                hero.speed = settings.heroSpeedFast - 4;
                bottleFillCommand.style = "red";
                if (soundOn) {
                    var tickLoop = new createjs.PlayPropsConfig().set({
                        interrupt: createjs.Sound.INTERRUPT_ANY,
                        loop: -1,
                        volume: 0.05
                    });
                    if (!tickSound) {
                        tickSound = createjs.Sound.play("tick", tickLoop);
                    }
                } else {
                    if(tickSound) {
                        tickSound.stop();
                    }
                }
            } else {
                bottleFillCommand.style = "blue";
                if (tickSound) {
                    tickSound.stop();
                }
            }
        }


    }, 500);

}






function tock(e) {

    if(gameRunning) {
        onPlatform();
        gravity();
        heroMoveTablet();
        moveHero();
        moveEnemy();
        moveMovingPlatforms();
        checkCollision();
        movePlatforms();
        lightConeBlinking();
        cloudMove();
        firstLevelPopups();
    }


    stage.update(e);

}