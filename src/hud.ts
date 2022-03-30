import * as PIXI from 'pixi.js'
import { Game } from './game.js'
import { GameObject } from "./gameobject"

export class Hud extends GameObject {

    private game: Game
    private highscore: PIXI.Text
    private basicText: PIXI.Text

    constructor(game: Game) {
        super()
        this.game = game
        this.drawObject()
    }

    private drawObject() {
        // const style = new PIXI.TextStyle({
        //     fontFamily: 'Arial',
        //     fontSize: 36,
        //     // fontStyle: 'italic',
        //     fontWeight: 'bold',
        //     // fill: ['#b6f492', '#338b93'], // gradient
        //     fill: ['#338b93'],
        //     stroke: '#FFFFFF',
        //     strokeThickness: 3,
        //     // dropShadow: true,
        //     dropShadowColor: '#000000',
        //     dropShadowBlur: 4,
        //     dropShadowAngle: Math.PI / 6,
        //     dropShadowDistance: 6,
        //     wordWrap: true,
        //     wordWrapWidth: 440,
        //     lineJoin: 'round',
        // })
        const style = new PIXI.TextStyle({
            "align": "center",
            "fill": ['#0f6a73'],
            "breakWords": true,
            "fontFamily": "Tahoma, Geneva, sans-serif",
            "fontSize": 34,
            "fontWeight": "bold",
            "wordWrap": true,
            "wordWrapWidth": 400
        })

        this.basicText = new PIXI.Text('Basic text in pixi', style)
        this.basicText.y = 100
        this.basicText.text = "Hit the trampolines"
        this.game.pixi.stage.addChild(this.basicText)
        this.reposition()

        style.fontSize = 20
        this.highscore = new PIXI.Text('HIGHSCORE ', style)
        this.highscore.x = 30
        this.highscore.y = 30
        this.game.pixi.stage.addChild(this.highscore)
    }

    public showScore(text: string) {
        this.basicText.text = text
        this.reposition()
    }

    private reposition() {
        this.basicText.x = this.game.pixi.screen.width / 2 - this.basicText.width / 2
    }

    public showHighscore(score: number) {
        this.highscore.text = "HIGHSCORE " + score
    }
}