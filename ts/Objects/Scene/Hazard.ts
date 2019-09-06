import 'p2';
import 'pixi';
import 'phaser';

import IGame from '../../Fabrique/IGame';
import {Images} from '../../Data';

export default class Hazard extends Phaser.Sprite {
    public static Name: string = 'hazard';
    public static pause: boolean = false;

    public name: string = Hazard.Name;
    public game: IGame;

    public hazardGroup: Phaser.Group;
    public currentHazard: Phaser.Sprite;
    public hazardSprite: string;

    constructor(game: Phaser.Game, x: number, y: number, key: string) {
        super(game, x, y, key);

        this.hazardGroup = this.game.add.group();
    }

    // Switch hazard type
    public switchHazard(): void {
        let randomHazard: string[] = [Images.WOODSPIKE];
        this.hazardSprite = randomHazard[Math.floor(Math.random() * randomHazard.length)];
    }

    public hazardSpawner(hazard: Phaser.Sprite): void {
        // Hazard initiliaze
        hazard = this.game.add.sprite(0, 0, this.hazardSprite);
        hazard.game.physics.enable(hazard, Phaser.Physics.ARCADE);

        hazard.scale.setTo(0.5, 0.3);
        hazard.anchor.setTo(0.5, 0.5);
        hazard.position.setTo(this.game.world.width, (700 - (hazard.height / 2.4)));
        hazard.body.setSize(hazard.width * 2, hazard.height * 2.4, 0, 50);

        this.hazardGroup.add(hazard);

        // Enemy movement
        hazard.body.velocity.x = -400;

        this.currentHazard = hazard;
    }

    public destroyHazard(hazard: Phaser.Sprite): void {
        this.hazardGroup.remove(hazard, true);

        console.log('Hazard destroyed');
    }
}
