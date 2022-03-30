import * as PIXI from 'pixi.js'

export class GameObject {

    protected sprite: PIXI.Sprite;

    public get Sprite(): PIXI.Sprite { return this.sprite }

    public get x(): number { return this.sprite.x }
    public set x(value: number) { this.sprite.x = value }

    public get y(): number { return this.sprite.y }
    public set y(value: number) { this.sprite.y = value }

    public get right(): number { return this.sprite.x + this.sprite.width / 2 }
    public get left(): number { return this.sprite.x - this.sprite.width / 2 }
    public get top(): number { return this.sprite.y - this.sprite.height / 2 }

    public get width(): number { return this.sprite.width / 2 }
    public get height(): number { return this.sprite.height / 2 }

    public update() {

    }

    public onCollision(target: GameObject) {

    }

    public hasCollision(gameobject: GameObject): boolean {
        let rect1 = this.sprite.getBounds()
        let rect2 = gameobject.Sprite.getBounds()

        return (rect1.left < rect2.left + rect2.width &&
            rect1.top < rect2.top + rect2.height &&
            rect1.left + rect1.width > rect2.left &&
            rect1.top + rect1.height > rect2.top)
    }
}