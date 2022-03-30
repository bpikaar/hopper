import * as PIXI from 'pixi.js'
import { Joystick } from './arcade/joystick'
import { Game } from './game'
import { GameObject } from './gameobject'
import { Hud } from './hud'
import { Trampoline } from './trampoline'

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
    }

    public update(): void {
        if (this.joystick.Left) {
            this.x -= Math.abs(this.speedX) + this.horizontalSpeed
            this.speedX = -(Math.abs(this.speedX))
        }
        else if (this.joystick.Right) {
            this.x += Math.abs(this.speedX) + this.horizontalSpeed
            this.speedX = Math.abs(this.speedX)
        }

        this.fall()

        this.keepInScreen()
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
}