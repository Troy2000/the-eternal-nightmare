import 'p2';
import 'pixi';
import 'phaser';

import IGame from '../../Fabrique/IGame';
import {Atlases} from '../../Data';

export default class Enemy extends Phaser.Sprite {
    public static Name: string = 'enemy';
    public static pause: boolean = false;

    public name: string = Enemy.Name;
    public game: IGame;

    public enemyGroup: Phaser.Group;
    public currentEnemy: Phaser.Sprite;
    public enemySprite: string;

    constructor(game: Phaser.Game, x: number, y: number, key: string) {
        super(game, x, y, key);

        // Enemy group
        this.enemyGroup = this.game.add.group();
    }

    public update(): void {
        // // check enemy collision
        // if (this.game.physics.arcade.collide(this.player, this.floor)) {
        //     console.log('Collision with Floor');
        //     this.onFloor = true;
        // } else {
        //     this.onFloor = false;
        // }

        // // Check floor collision
        // if (this.jumpButton.isDown /*&& this.onFloor*/) {
        //     this.playerJump();
        // }
    }

    // Switch enemy type
    public switchEnemy(): void {
        let spawnEnemies: string[] = ['SkeletonKnight', 'SkeletonWarrior'];
        let randomEnemy: string = spawnEnemies[Math.floor(Math.random() * spawnEnemies.length)];

        //let speed: string = spawnObjects[Math.floor(Math.random() * spawnObjects.length)];
        switch (randomEnemy) {
            case 'SkeletonKnight':
                this.enemySprite = Atlases.SkeletonKnight;
                break;
            case 'SkeletonWarrior':
                this.enemySprite = Atlases.SkeletonWarrior;
                break;
            default:
                break;
        }
    }

    public enemySpawner(enemy: Phaser.Sprite): void {
        // Enemy initiliaze
        enemy = this.game.add.sprite(0, 0, this.enemySprite);
        this.game.physics.enable(enemy, Phaser.Physics.ARCADE);

        enemy.scale.setTo(0.25);
        enemy.anchor.setTo(0.5);
        enemy.position.setTo(this.game.world.width, 700 - (enemy.height / 3));
        enemy.body.setSize(enemy.width * 2.2, enemy.height * 3, enemy.width, enemy.height / 2.7);

        enemy.animations.add(this.enemySprite);
        enemy.animations.play(this.enemySprite, 30, true);
        this.enemyGroup.add(enemy);

        // Enemy movement
        enemy.body.velocity.x = -500;

        this.currentEnemy = enemy;
    }

    public destroyEnemy(enemy: Phaser.Sprite): void {
        this.enemyGroup.remove(enemy, true);

        console.log('Enemy destroyed');
    }
}
