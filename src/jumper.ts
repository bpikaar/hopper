import * as PIXI from 'pixi.js'
import { Joystick } from './arcade/joystick'
import { Game } from './game'
import { GameObject } from './gameobject'
import { Hud } from './hud'
import { Trampoline } from './trampoline'
import spritesheet from './images/spritesheet.json'

export class Jumper extends GameObject {
    private readonly WIDTH: number = 50
    private readonly HEIGHT: number = 50
    private readonly gravity: number = 0.981
    private readonly bounce: number = 0.95
    private readonly horizontalSpeed: number = 0

    private game: Game
    private startX: number = 100
    private startY: number = 100
    private speedX: number = 7
    private speedY: number = 5
    private rotation: number
    private score: number = 0
    // private sprite: PIXI.Sprite
    private joystick: Joystick
    private hud: Hud
    private highscore: number

    constructor(game: Game, joystick: Joystick, x: number, y: number) {
        super()
        this.game = game
        this.joystick = joystick
        this.startX = x
        this.startY = y

        this.drawShape()

        this.highscore = parseInt(this.game.getCookie("highscore"))

        // Keyboard input
        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("keyup", (e) => this.onKeyUp(e));

        // this.game.pixi.loader
        //     .add('spritesheet', 'cat_spritesheet_205_313.png')
        //     .load(() => onAssetsLoaded());
    }

    private drawShape(): void {
        let graphic = new PIXI.Graphics()

        graphic.beginFill(0xFF3300)
        graphic.lineStyle(4, 0xffd900, 1)
        graphic.moveTo(0, this.HEIGHT)
        graphic.lineTo(this.WIDTH / 2, 0)
        graphic.lineTo(this.WIDTH, this.HEIGHT)
        graphic.lineTo(0, this.HEIGHT)
        graphic.closePath()
        graphic.endFill()

        let texture = this.game.pixi.renderer.generateTexture(graphic)

        this.sprite = new PIXI.Sprite(texture)
        this.game.pixi.stage.addChild(this.sprite)

        this.sprite.anchor.set(0.5, 0.5)
        this.sprite.x = this.startX
        this.sprite.y = this.startY

        // PIXI.Loader.shared
        //     .add("spritesheet.json")
        //     .onComplete.once((e) => this.loaded(e))

        // PIXI.Loader.shared.load()
        // this.game.pixi.loader
        //     .add("images/spritesheet.json")
        //     .load((e) => this.loaded(e));
    }

    private loaded(e) {
        console.log(e)
        // get a reference to the sprite sheet we've just loaded:
        let sheet = PIXI.Loader.shared.resources["spritesheet.json"].spritesheet;
        console.log(sheet)
        // create an animated sprite
        let poes = new PIXI.AnimatedSprite(sheet.animations["poes"])

        // set speed, start playback and add it to the stage
        poes.animationSpeed = 0.167;
        poes.play();
        this.game.pixi.stage.addChild(poes);
    }

    private onKeyDown(event: KeyboardEvent) {
        event.preventDefault()
        if (event.key === "ArrowLeft") this.moveLeft()
        if (event.key === "ArrowRight") this.moveRight()
    }
    private onKeyUp(event: KeyboardEvent) {
    }

    public update(): void {
        if (this.joystick) {
            if (this.joystick.Left) this.moveLeft()
            else if (this.joystick.Right) this.moveRight()
        }

        this.fall()

        this.keepInScreen()
    }

    private moveLeft() {
        this.x -= Math.abs(this.speedX) + this.horizontalSpeed
        this.speedX = -(Math.abs(this.speedX))
    }

    private moveRight() {
        this.x += Math.abs(this.speedX) + this.horizontalSpeed
        this.speedX = Math.abs(this.speedX)
    }

    private keepInScreen() {
        if (this.x - this.width < 0) {
            this.speedX *= -1
            this.x = this.width
        }
        // if (this.sprite.y - this.sprite.height / 2 < 0) {
        //     this.speedY *= -1
        // }
        if (this.x + this.width > this.game.pixi.screen.right) {
            this.speedX *= -1
            this.x = this.game.pixi.screen.right - this.width
        }
        if (this.y + this.height > this.game.pixi.screen.bottom) {
            this.bounceUpFrom(this.game.pixi.screen.bottom - this.height)
            this.game.hud.showScore("You touched the lava!")
            if (this.score > this.highscore) {
                this.highscore = this.score
                this.game.hud.showHighscore(this.highscore)
                this.game.setCookie("highscore", String(this.score))
            }
            this.score = 0
        }
    }

    private fall(): void {
        this.x += this.speedX
        this.y += this.speedY
        this.speedY += this.gravity
    }

    public onCollision(target: GameObject): void {
        if (target instanceof Trampoline) {
            this.bounceUpFrom(target.top - this.height)
            this.game.hud.showScore(String(++this.score))
        }
    }

    private bounceUpFrom(height: number): void {
        // place on top of height (screen or object)
        this.y = height
        // keep the ball bouncing without loss
        this.speedY *= -this.bounce
    }

    private onAssetsLoaded() {
        // create an array to store the textures
        const explosionTextures = [];
        let i;

        for (i = 0; i < 26; i++) {
            const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
            explosionTextures.push(texture);
        }

        for (i = 0; i < 50; i++) {
            // create an explosion AnimatedSprite
            const explosion = new PIXI.AnimatedSprite(explosionTextures);

            explosion.x = Math.random() * this.game.pixi.screen.width;
            explosion.y = Math.random() * this.game.pixi.screen.height;
            explosion.anchor.set(0.5);
            explosion.rotation = Math.random() * Math.PI;
            explosion.scale.set(0.75 + Math.random() * 0.5);
            explosion.gotoAndPlay(Math.random() * 27);
            this.game.pixi.stage.addChild(explosion);
        }

        // start animating
        this.game.pixi.start();
    }
}



