import * as PIXI from 'pixi.js'
import { Game } from './game'

type AssetFile = { name: string, url: string }

export class Assets extends PIXI.Loader {

    // private game: Game
    private assets: AssetFile[] = []

    constructor(game: Game) {
        super()
        // this.game = game

        this.assets = [
            { name: "spritesheetJson", url: "spritesheet.json" },
        ]

        this.assets.forEach(asset => {
            this.add(asset.name, asset.url)
        })

        this.load(() => game.loadCompleted())
    }
}