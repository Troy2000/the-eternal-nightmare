import 'p2';
import 'pixi';
import 'phaser';

import IGame from '../Fabrique/IGame';
import {Images} from '../Data';

export default class Player extends Phaser.Sprite {
    public static Name: string = 'gameplay';
    public static pause: boolean = false;

    public name: string = Player.Name;
    public game: IGame;

    private heartCount: number = 3;
    private heartSprites: Phaser.Sprite;
    public heartGroup: Phaser.Group;

    public jumpButton: Phaser.Key;
    //private onFloor: boolean = false;

    constructor(game: Phaser.Game, x: number, y: number, key: string) {
        super(game, x, y, key);

        //this.game.add.sprite(0, 0, 'playerWalk');
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.gravity.y = 1000;
        this.body.maxVelocity.y = 500;
        this.body.collideWorldBounds = true;

        this.scale.setTo(0.2);
        this.anchor.setTo(0.5, 0.5);
        //this.position.setTo(100, (this.floor.y - (this.player.height / 3.1)));
        this.body.setSize(this.width * 2.2, this.height * 3.5, this.width * 1.7, this.height / 1.7);

        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // Player Animation
        this.animations.add('pl_walk');
        this.animations.play('pl_walk', 30, true);
        // Heart containers
        this.heartGroup = this.game.add.group();

        let positionIncrement: number = 30;
        let offset: number = this.x - 120;
        for (let i: number = 0; i < 3; i++) {
            this.heartSprites = this.game.add.sprite(offset + (i * positionIncrement), 0, Images.HEART);
            this.heartSprites.anchor.setTo(0.5);
            this.heartSprites.scale.setTo(0.07);
            this.heartGroup.add(this.heartSprites);
        }
        this.game.add.existing(this);
    }

    public update(): void {
        // Position hearts above player
        this.heartGroup.y = ((this.y - this.height) + 30);
    }

    // Player
    public Jump(): void {
        this.body.velocity.y = -500;

        // Destroy lives
        this.DestroyHearts(this.heartCount);
    }

    private DestroyHearts(heart: number): void {
        if (heart > 0) {
            this.heartCount--;
            this.heartGroup.remove(this.heartGroup.getTop(), true);

            console.log('lives left: ' + this.heartCount);
        }
    }
}
