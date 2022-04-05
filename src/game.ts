import * as PIXI from 'pixi.js'
import { Arcade } from './arcade/arcade'
import { GameObject } from './gameobject'
import { Hud } from './hud'
import { Jumper } from './jumper'
import { Trampoline } from './trampoline'

export class Game {

    // fields
    private arcade: Arcade
    private joystickListener: EventListener
    private _pixi: PIXI.Application
    private gameObjects: GameObject[] = []
    private _hud: Hud
    // Properties
    public get pixi(): PIXI.Application { return this._pixi }
    public get hud(): Hud { return this._hud }

    constructor() {
        // this._pixi = new PIXI.Application({ width: 1440, height: 900 })
        this._pixi = new PIXI.Application({ width: 1440, height: 900, backgroundColor: 0x1099bb })
        document.body.appendChild(this._pixi.view)

        // create arcade cabinet with 2 joysticks (with 6 buttons)
        this.arcade = new Arcade(this)

        this._hud = new Hud(this)
        let highscore: number = parseInt(this.getCookie("highscore"))
        highscore = isNaN(highscore) ? 0 : highscore
        this._hud.showHighscore(highscore)
        this._hud.showScore("Press a button to start")

        // The game must wait for de joysticks to connect
        this.joystickListener = (e: Event) => this.initJoystick(e as CustomEvent)
        document.addEventListener("joystickcreated", this.joystickListener)

        // this.jumper = new Jumper(this, null)
        // start update loop
        this.pixi.ticker.add((delta) => this.update())
    }

    private update() {
        for (const gameobject of this.gameObjects) {
            gameobject.update()
            this.checkCollision(gameobject)
        }

        for (let joystick of this.arcade.Joysticks) {
            joystick.update()
        }
    }

    /**
     * Checks the collision of the givin game object against all other game objects.
     * If a collision occurs, the onCollision of the given game object is called
     * @param gameObject1 The game object to check
     */
    private checkCollision(gameObject1: GameObject) {
        for (const gameobject2 of this.gameObjects) {
            if (gameObject1 != gameobject2 && gameObject1.hasCollision(gameobject2)) {
                gameObject1.onCollision(gameobject2)
            }
        }
    }

    private startGame() {
        this.gameObjects.push(new Trampoline(this))
        this.gameObjects.push(new Trampoline(this))
        this.gameObjects.push(new Trampoline(this))
        this.gameObjects.push(new Trampoline(this))
        this.gameObjects.push(new Trampoline(this))
    }

    /**
     * 
     * @param gamepadEvent 
     */
    private initJoystick(e: CustomEvent) {

        let joystick = this.arcade.Joysticks[e.detail]

        for (const buttonEvent of joystick.ButtonEvents) {
            document.addEventListener(buttonEvent, () => console.log(buttonEvent))
        }

        this.gameObjects.push(new Jumper(this, joystick, 100, 100))
        this.startGame()
        // alternatively you can handle single buttons
        // Handle button 0 (this is the first button, X-Button on a PS4 controller)
        // document.addEventListener(joystick.ButtonEvents[0], () => this.handleJump())
    }

    public disconnect() {
        document.removeEventListener("joystickcreated", this.joystickListener)
    }

    public setCookie(cname: string, cvalue: string, exdays = 365): void {
        localStorage.setItem(cname, cvalue)
        // const d = new Date();
        // d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        // let expires = "expires=" + d.toUTCString();
        // document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    public getCookie(cname: string): string {
        return localStorage.getItem(cname)

        // let name = cname + "=";
        // let decodedCookie = decodeURIComponent(document.cookie);
        // let ca = decodedCookie.split(';');
        // for (let i = 0; i < ca.length; i++) {
        //     let c = ca[i];
        //     while (c.charAt(0) == ' ') {
        //         c = c.substring(1);
        //     }
        //     if (c.indexOf(name) == 0) {
        //         return c.substring(name.length, c.length);
        //     }
        // }
        // return "";
    }
}