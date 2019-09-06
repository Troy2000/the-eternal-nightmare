import 'p2';
import 'pixi';
import 'phaser';

import IGame from '../Fabrique/IGame';
//import Label from '../Objects/Label';
//import LabeledButton from '../Objects/LabeledButton';
import SoundManager from '../Managers/SoundManager';

import Player from '../Objects/Player';
import Enemy from '../Objects/Enemy';

import {Sounds, /*Constants,*/ Images} from '../Data';
//import {Menu} from './';

export default class Gameplay extends Phaser.State {
    public static Name: string = 'gameplay';
    public static pause: boolean = false;

    public name: string = Gameplay.Name;
    public game: IGame;

    private background: Phaser.TileSprite;
    public floor: Phaser.TileSprite;
    private onFloor: boolean = false;

    public player: Player;
    public enemy: Enemy;

    //private text: Label;
    //private backBtn: LabeledButton;

    constructor() {
        super();
    }

    public init(): void {
        this.game.world.removeAll();

        this.game.world.setBounds(0, 0, 1280, 720);

        //Play background music
        SoundManager.getInstance().playMusic(Sounds.GameMusic);
    }

    public preload(): void {
        this.game.load.spritesheet('playerWalk', 'assets/images/player/walk/playerWalk.png', 480, 480, 12);
        this.game.load.spritesheet('skeletonKnight', 'assets/images/enemy/skeletonKnight/skeletonKnight.png', 384, 384, 17);
    }

    public create(): void {
        super.create();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //Send a screen view to Google to track different states
        // this.game.analytics.google.sendScreenView(this.name);

        this.background = this.game.add.tileSprite(0, 0, this.world.bounds.width, this.game.cache.getImage(Images.BACKGROUND).height, Images.BACKGROUND);

        this.floor = this.game.add.tileSprite(0, 700, this.world.bounds.width, this.game.cache.getImage(Images.FLOOR).height, Images.FLOOR);
        this.game.physics.enable(this.floor, Phaser.Physics.ARCADE);
        this.floor.body.immovable = true;
        this.floor.body.gravity.y = 0;

        this.player = new Player(this.game, 200, 200, 'playerWalk');
        this.player.position.setTo(100, (this.floor.y - (this.player.height / 3.1)));
        //enemy.position.setTo(this.game.world.width, this.floor.y - (enemy.height / 3));

        this.enemy = new Enemy(this.game, 200, 200, 'skeletonKnight');

        this.enemy.SwitchEnemy();
        this.enemy.SpawnEnemy();

        this.resize();
    }

    public update(): void {
        // Lock player on x position
        this.player.x = 100;

        // Move background
        this.background.tilePosition.x -= 2;
        this.floor.tilePosition.x -= 2;

        //Check floor collision
        if (this.game.physics.arcade.collide(this.player, this.floor)) {
            console.log('Collision with Floor');
            this.onFloor = true;
        } else {
            this.onFloor = false;
        }

        // Player jump
        if (this.player.jumpButton.isDown && this.onFloor) {
            this.player.Jump();
        }

        // Destroy enemy on going out of bounds
        this.enemy.enemyGroup.forEach((enemyObj: Phaser.Sprite) => {
            if (enemyObj.x < 0) {
                this.enemy.DestroyEnemy(enemyObj);
            }
        }, this);

        // Destroy enemy on colliding with player
        this.enemy.enemyGroup.forEach((enemyObj: Phaser.Sprite) => {
            if (this.game.physics.arcade.collide(this.player, enemyObj)) {
                this.enemy.DestroyEnemy(enemyObj);
            }
        }, this);

        // private startMenu(): void {
        //     this.game.state.add(Menu.Name, Menu, true);
        // }
    }

    // Resizing
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
