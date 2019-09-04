import 'p2';
import 'pixi';
import 'phaser';

import IGame from '../Fabrique/IGame';
//import Label from '../Objects/Label';
//import LabeledButton from '../Objects/LabeledButton';
import SoundManager from '../Managers/SoundManager';

import {Sounds, /*Constants,*/ Images} from '../Data';
//import {Menu} from './';

export default class Gameplay extends Phaser.State {
    public static Name: string = 'gameplay';
    public static pause: boolean = false;

    public name: string = Gameplay.Name;
    public game: IGame;

    private background: Phaser.TileSprite;
    private floor: Phaser.TileSprite;

    private player: Phaser.Sprite;
    private playerHearts: number = 3;
    private spriteHearts: Phaser.Sprite;
    private heartGroup: Phaser.Group;

    private voidCreature: Phaser.Sprite;

    private jumpButton: Phaser.Key;

    //private text: Label;
    //private backBtn: LabeledButton;

    constructor() {
        super();
    }

    public init(): void {
        this.game.world.removeAll();

        //Play background music
        SoundManager.getInstance().playMusic(Sounds.GameMusic);
    }

    public preload(): void {
        this.game.load.spritesheet('playerWalk', 'assets/images/player/walk/playerWalk.png', 480, 480);
        this.game.load.spritesheet('voidCreature', 'assets/images/enemy/void/voidCreature.png', 28, 36);
        this.game.load.image('heartContainer', 'assets/images/player/health/heartContainer.png');
    }

    public create(): void {
        super.create();
        //Send a screen view to Google to track different states
        // this.game.analytics.google.sendScreenView(this.name);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 300;

        //this.background = this.game.add.image(0, 0, Images.BACKGROUND);
        this.background = this.game.add.tileSprite(0, 0, this.world.bounds.width, this.game.cache.getImage(Images.BACKGROUND).height, Images.BACKGROUND);

        this.floor = this.game.add.tileSprite(0, 700, this.world.bounds.width, this.game.cache.getImage(Images.FLOOR).height, Images.FLOOR);

        // Player
        this.player = this.game.add.sprite(0, 0, 'playerWalk');

        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.gravity.y = 1000;
        this.player.body.maxVelocity.y = 500;
        this.player.body.collideWorldBounds = true;

        this.player.scale.setTo(0.2);
        this.player.anchor.setTo(0.5);
        this.player.position.setTo(100, 700);

        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // Player Animation
        this.player.animations.add('pl_walk');
        this.player.animations.play('pl_walk', 30, true);

        // Heart containers
        this.heartGroup = this.game.add.group();

        let positionIncrement: number = 30;
        let offset: number = this.player.position.x - 23;
        for (let i: number = 0; i < 3; i++) {
            this.spriteHearts = this.game.add.sprite(offset + (i * positionIncrement), 0, 'heartContainer');
            this.spriteHearts.anchor.setTo(0.5);
            this.spriteHearts.scale.setTo(0.07);
            this.heartGroup.add(this.spriteHearts);
        }
        console.log(this.heartGroup);

        // Enemy
        this.voidCreature = this.game.add.sprite(0, 0, 'voidCreature');

        this.voidCreature.scale.setTo(1.5);
        this.voidCreature.anchor.setTo(0.5);
        this.voidCreature.position.setTo(650, 650);

        // Enemy Animation
        this.voidCreature.animations.add('void_creature');
        this.voidCreature.animations.play('void_creature', 7, true);

        //let textStyle: any = {font: 'bold ' + 30 * Constants.GAME_SCALE + 'px Arial', fill: '#FFFFFF'};

        //this.text = new Label(this.game, 0, 0, 'time_to_play', textStyle);

        //this.backBtn = new LabeledButton(this.game, 0, 0, 'back', textStyle, this.startMenu, this, 300, 100);
        //this.backBtn.setFrames('btn_blue', 'btn_blue', 'btn_blue_onpress', 'btn_blue');

        this.resize();
    }

    public update(): void {
        this.heartGroup.y = ((this.player.position.y - this.player.height) + 30);
        //this.heartGroup.forEach(this.moveHeart, this);

        // Move background
        this.background.tilePosition.x -= 2;
        this.floor.tilePosition.x -= 2;

        if (this.jumpButton.isDown && this.player.body.blocked.down === true) {
            this.player.body.velocity.y = -500;

            // Destroy lives
            //this.destroyHearts(this.playerHearts);
        }

        //this.heartGroup.y = this.player.position.y - this.player.height - 5;

        // private startMenu(): void {
        //     this.game.state.add(Menu.Name, Menu, true);
        // }
    }

    // Destroy lives function
    public destroyHearts(heart: number): void {
        if (heart > 0) {
            heart--;
            this.heartGroup.remove(this.heartGroup.getTop(), true);

            console.log('lives left: ' + this.playerHearts);
        }

    }

    /**
     * Called every time the rotation or game size has changed.
     * Rescales and repositions the objects.
     */
    public resize(): void {
        this.background.width = this.game.width;
        this.background.height = this.game.height;
        this.floor.width = this.game.width;

        // this.text.alignIn(this.world.bounds, Phaser.CENTER);
        //
        // this.backBtn.x = this.game.width / 2;
        // this.backBtn.y = this.text.y + this.text.height + this.backBtn.height;
    }

    public shutdown(): void {
        super.shutdown();

        this.background = null;
        this.floor = null;
        //this.text = null;
        //this.backBtn = null;
    }
}
