import 'p2';
import 'pixi';
import 'phaser';

import IGame from '../Fabrique/IGame';
//import Label from '../Objects/Label';
//import LabeledButton from '../Objects/LabeledButton';
import SoundManager from '../Managers/SoundManager';

import Player from '../Objects/Scene/Player';
import Enemy from '../Objects/Scene/Enemy';
import Hazard from '../Objects/Scene/Hazard';

import Environment from '../Objects/Scene/Environment';

import {Sounds, /*Constants,*/ Images, Atlases} from '../Data';
//import {Menu} from './';

export default class Gameplay extends Phaser.State {
    public static Name: string = 'gameplay';
    public static pause: boolean = false;

    public name: string = Gameplay.Name;
    public game: IGame;

    private background: Phaser.TileSprite;
    private moon: Phaser.Sprite;
    public floor: Phaser.TileSprite;
    //private stagebar: Phaser.Sprite;

    private onFloor: boolean = false;

    public player: Player;
    public enemy: Enemy;
    public hazard: Hazard;

    public environment: Environment;

    private hostileCount: number = 0;
    private waveChecker: number = 0;
    //private waveText: Label;

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

    public create(): void {
        super.create();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //Send a screen view to Google to track different states
        // this.game.analytics.google.sendScreenView(this.name);

        this.background = this.game.add.tileSprite(0, 0, this.world.bounds.width, this.game.cache.getImage(Images.BACKGROUND).height, Images.BACKGROUND);

        this.moon = this.game.add.sprite(0, 0, Images.MOON);
        this.moon.scale.set(0.2);
        this.moon.position.setTo(this.game.width - this.moon.width - 10, 10);

        this.floor = this.game.add.tileSprite(0, 700, this.world.bounds.width, this.game.cache.getImage(Images.FLOOR).height, Images.FLOOR);
        this.game.physics.enable(this.floor, Phaser.Physics.ARCADE);
        this.floor.body.immovable = true;
        this.floor.body.gravity.y = 0;

        //this.stagebar = this.game.add.sprite(this.game.width / 2, 700, Images.FLOOR);
        //this.game.add.sprite(this.game.width / 2, 700, Images.STAGEBAR);

        this.player = new Player(this.game, 200, 200, Atlases.Player);
        this.player.position.setTo(100, (this.floor.y - (this.player.height / 3.1)));
        //enemy.position.setTo(this.game.world.width, this.floor.y - (enemy.height / 3));

        this.enemy = new Enemy(this.game, 200, 200, null);
        this.hazard = new Hazard(this.game, 300, 700, null);

        this.spawnObject();

        this.world.bringToTop(this.floor);
        this.resize();

        this.environment = new Environment();
    }

    public update(): void {
        // Lock player on x position
        this.player.x = 100;

        // Move background
        this.background.tilePosition.x -= 10;
        this.floor.tilePosition.x -= 10;

        this.collisions();

        // Go to menu
        // if (this.player.heartCount <= 0) {
        //     this.startMenu();
        // }
    }

    // private startMenu(): void {
    //     this.game.state.add(Menu.Name, Menu, true);
    // }

    private waveRounds(): void {
        this.waveChecker++;
        console.log('Wave: ' + this.waveChecker);
    }

    // Spawn timer
    public spawnObject(): void {
        setTimeout(() => {
            this.enemy.switchEnemy();
            this.hazard.switchHazard();

            let spawnObjects: string[] = ['Enemy', 'Hazard'];
            let randomSpawn: string = spawnObjects[Math.floor(Math.random() * spawnObjects.length)];
            //let speed: string = spawnObjects[Math.floor(Math.random() * spawnObjects.length)];
            switch (randomSpawn) {
                case 'Enemy':
                    console.log('Enemy');
                    this.enemy.enemySpawner(this.enemy.currentEnemy);
                    this.hostileCount++;
                    break;
                case 'Hazard':
                    console.log('Hazard');
                    this.hazard.hazardSpawner(this.hazard.currentHazard);
                    this.hostileCount++;
                    break;
                default:
                    break;
            }
            console.log(this.hostileCount);
            if (this.hostileCount > 5) {
                this.waveRounds();
                this.hostileCount = 0;
            }
            this.spawnObject();
        },  600 + Math.random() * 2000);
    }

    // Collisions
    private collisions(): void {
        //Check floor collision
        if (this.game.physics.arcade.collide(this.player, this.floor)) {
            this.onFloor = true;
        } else {
            this.onFloor = false;
        }

        // On colliding with hazard
        this.hazard.hazardGroup.forEach((hazardObj: Phaser.Sprite) => {
            if (this.game.physics.arcade.collide(this.player, hazardObj)) {
                this.hazard.destroyHazard(hazardObj);

                // Destroy player hearts
                this.player.destroyHearts(this.player.heartCount);
            }
        }, this);

        // Destroy hazard on going out of bounds
        this.enemy.enemyGroup.forEach((hazardObj: Phaser.Sprite) => {
            if (hazardObj.x < 0) {
                this.enemy.destroyEnemy(hazardObj);
            }
        }, this);

        // Player jump
        if (this.player.jumpButton.isDown && this.onFloor) {
            this.player.jump();
            //this.environment.zap();
        }

        // Destroy enemy on going out of bounds
        this.enemy.enemyGroup.forEach((enemyObj: Phaser.Sprite) => {
            if (enemyObj.x < 0) {
                this.enemy.destroyEnemy(enemyObj);
            }
        }, this);

        // Destroy enemy on colliding with player
        this.enemy.enemyGroup.forEach((enemyObj: Phaser.Sprite) => {
            if (this.game.physics.arcade.collide(this.player, enemyObj)) {
                this.enemy.destroyEnemy(enemyObj);

                // Destroy player hearts
                this.player.destroyHearts(this.player.heartCount);
            }
        }, this);
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

    // Rendering
    public render(): void {
        // Display
        //this.game.debug.bodyInfo(this.player, 32, 32);
        //this.game.debug.body(this.player);
        this.game.debug.body(this.hazard);
        //this.game.debug.spriteBounds(this.floor);
        //this.game.debug.spriteBounds(this.background);
    }
}
