import * as PIXI from 'pixi.js'
import { Game } from './game'
import { GameObject } from './gameobject'

export class Trampoline extends GameObject {
    private readonly WIDTH: number = 80
    private readonly HEIGHT: number = 30

    private direction: number
    // private _x: number = 100
    // private y: number = 100
    private speedX: number = 5
    private game: Game
    // private sprite: PIXI.Sprite

    // public get right(): number { return this.sprite.x + this.sprite.width / 2 }
    // public get left(): number { return this.sprite.x - this.sprite.width / 2 }

    // public set x(v: number) { this.sprite.x = v }

    constructor(game: Game) {
        super()
        this.game = game
        this.direction = Math.random() < 0.5 ? 1 : -1

        this.drawObject()
    }

    private drawObject() {
        let graphic = new PIXI.Graphics()

        graphic.lineStyle(4, 0xffd900, 1)
        graphic.beginFill(0xAAFFAA)
        graphic.drawRect(0, 0, this.WIDTH, this.HEIGHT)
        graphic.endFill()

        let texture = this.game.pixi.renderer.generateTexture(graphic)

        this.sprite = new PIXI.Sprite(texture)
        this.game.pixi.stage.addChild(this.sprite)

        this.sprite.anchor.set(0.5, 0.5)

        this.sprite.x = this.direction > 0 ? -this.width : this.game.pixi.screen.right + this.width
        this.sprite.y = this.game.pixi.screen.bottom - this.height
    }

    public update() {
        this.sprite.x += this.speedX * this.direction

        if (this.right < 0 && this.direction < 0)
            this.x = Math.random() * this.game.pixi.screen.width + this.game.pixi.screen.width
        if (this.left > this.game.pixi.screen.right && this.direction > 0)
            this.x = Math.random() * -this.game.pixi.screen.width
    }
}