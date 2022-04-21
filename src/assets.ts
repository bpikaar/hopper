import * as PIXI from 'pixi.js'
import { Game } from './game'

export class Assets {

    private game: Game
    private loader: PIXI.Loader
    private assets: { name: string, url: string }[] = []

    constructor(game: Game) {
        this.game = game
        this.loader = new PIXI.Loader()

        this.assets = [
            { name: "spritesheetJson", url: "spritesheet.json" },
        ]

        this.load()
    }

    private load() {
        this.assets.forEach(asset => {
            console.log(asset.name)
            this.loader.add(asset.name, asset.url)
        })
        console.log(this.loader)
        this.loader.load(() => this.loadCompleted())
    }

    // after loading is complete, create a fish sprite
    private loadCompleted() {
        this.game.loadCompleted()
    }
}