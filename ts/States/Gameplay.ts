import 'p2';
import 'pixi';
import 'phaser';

import IGame from '../Fabrique/IGame';
import Label from '../Objects/Label';
import LabeledButton from '../Objects/LabeledButton';
import SoundManager from '../Managers/SoundManager';

import {Sounds, Constants, Images} from '../Data';
import {Menu} from './';

export default class Gameplay extends Phaser.State {
    public static Name: string = 'gameplay';
    public static pause: boolean = false;

    public name: string = Gameplay.Name;
    public game: IGame;

    private background: Phaser.Image;
    private floor: Phaser.Image;

    private player: Phaser.Sprite;

    private text: Label;
    private backBtn: LabeledButton;

    constructor() {
        super();
    }

    public init(): void {
        this.game.world.removeAll();

        //Play background music
        SoundManager.getInstance().playMusic(Sounds.GameMusic);
    }

    public preload(): void {
        //this.game.load.atlasJSONHash('playerscene', 'assets/atlases/walk/playerscene.png', 'assets/atlases/walk/playerscene.json');
        this.game.load.spritesheet('playerscene', 'assets/atlases/walk/playerscene.png', 480, 480);
    }

    public create(): void {
        super.create();

        //Send a screen view to Google to track different states
        // this.game.analytics.google.sendScreenView(this.name);

        this.background = this.game.add.image(0, 0, Images.BACKGROUND);
        this.floor = this.game.add.image(0, 680, Images.FLOOR);

        // Sprite
        this.player = this.game.add.sprite(0, 0, 'playerscene');
        this.player.scale.setTo(0.2, 0.2);
        this.player.position.setTo(0, (this.floor.y - (this.player.height / 1.25)));

        // Animation
        //this.player.animations.add('walk', Phaser.Animation.generateFrameNames('assets/images/player/walk/', 1, 12, '', 2), 10, true, false);
        this.player.animations.add('walk');
        this.player.animations.play('walk', 30, true);

        let textStyle: any = {font: 'bold ' + 30 * Constants.GAME_SCALE + 'px Arial', fill: '#FFFFFF'};

        this.text = new Label(this.game, 0, 0, 'time_to_play', textStyle);

        this.backBtn = new LabeledButton(this.game, 0, 0, 'back', textStyle, this.startMenu, this, 300, 100);
        this.backBtn.setFrames('btn_blue', 'btn_blue', 'btn_blue_onpress', 'btn_blue');

        this.resize();
    }

    public update(): void {
        //console.log(this.player.animations.play('walk'));
        // Auto move
        this.player.x += 3;
        if (this.player.x > 800)  {
            this.player.x = -50;
        }
    }

    private startMenu(): void {
        this.game.state.add(Menu.Name, Menu, true);
    }

    /**
     * Called every time the rotation or game size has changed.
     * Rescales and repositions the objects.
     */
    public resize(): void {
        this.background.width = this.game.width;
        this.background.height = this.game.height;
        this.floor.width = this.game.width;

        this.text.alignIn(this.world.bounds, Phaser.CENTER);

        this.backBtn.x = this.game.width / 2;
        this.backBtn.y = this.text.y + this.text.height + this.backBtn.height;
    }

    public shutdown(): void {
        super.shutdown();

        this.background = null;
        this.floor = null;
        this.text = null;
        this.backBtn = null;
    }
}
