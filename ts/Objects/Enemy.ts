import 'p2';
import 'pixi';
import 'phaser';

import IGame from '../Fabrique/IGame';

export default class Enemy extends Phaser.Sprite {
    public static Name: string = 'gameplay';
    public static pause: boolean = false;

    public name: string = Enemy.Name;
    public game: IGame;

    public enemyGroup: Phaser.Group;
    public currentEnemy: Phaser.Sprite;
    private enemySprite: string;

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
    public SwitchEnemy(): void {
        let randomEnemy: string[] = ['skeletonKnight'];
        this.enemySprite = randomEnemy[Math.floor(Math.random() * randomEnemy.length)];
    }

    // Spawn enemy
    public SpawnEnemy(): void {
        setTimeout(() => {
            this.EnemySpawner(this.currentEnemy);
            this.SpawnEnemy();
        }, 1000 + Math.random() * 2000);
    }

    public EnemySpawner(enemy: Phaser.Sprite): void {
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

    public DestroyEnemy(enemy: Phaser.Sprite): void {
        this.enemyGroup.remove(enemy, true);

        console.log('Enemy destroyed');
    }
}
