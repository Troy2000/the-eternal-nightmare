import 'p2';
import 'pixi';
import 'phaser';

import IGame from '../../Fabrique/IGame';

export default class Environment extends Phaser.State {
    public static Name: string = 'hazard';
    public static pause: boolean = false;

    public name: string = Environment.Name;
    public game: IGame;

    public lightningBitmap: Phaser.BitmapData;
    public lightning: Phaser.Image;
    public fragmentSrc: string[];

    constructor() {
        super();

        // Create a bitmap for the lightning bolt texture
        this.lightningBitmap = this.game.add.bitmapData(200, 338);

        // Create a sprite to hold the lightning bolt texture
        this.lightning = this.game.add.image(this.game.width / 2, 80, this.lightningBitmap);

        // This adds what is called a 'fragment shader' to the lightning sprite.
        // See the fragment shader code below for more information.
        // This is an WebGL feature. Because it runs in your web browser, you need
        // a browser that support WebGL for this to work.
        this.lightning.filters = [ this.game.add.filter('Glow') ];

        // Set the anchor point of the sprite to center of the top edge
        // This allows us to position the lightning by simply specifiying the
        // x and y coordinate of where we want the lightning to appear from.
        this.lightning.anchor.setTo(0.5, 0);

        // Trigger lightning on mouse clicks and taps
        //this.game.input.onTap.add(this.zap, this);
    }

    // public preload(): void {
    //     this.game.load.image('cloud', '/assets/gfx/ball.png');
    //     this.game.load.image('ground', '/assets/gfx/ground.png');
    // }

    // // Create a lightning bolt
    // public zap(): void {
    //     // Create the lightning texture
    //     this.createLightningTexture(this.lightningBitmap.width / 2, 0, 20, 3, false);
    //
    //     // Make the lightning sprite visible
    //     this.lightning.alpha = 1;
    //
    //     // Fade out the lightning sprite using a tween on the alpha property
    //     // Check out the 'Easing function' examples for more info.
    //     this.game.add.tween(this.lightning)
    //         .to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
    //         .to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
    //         .to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
    //         .to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
    //         .to({ alpha: 0 }, 250, Phaser.Easing.Cubic.In)
    //         .start();
    // }
    //
    // // This function creates a texture that looks like a lightning bolt
    // public createLightningTexture(x: number, y: number, segments: any, boltWidth: number, branch: boolean): void {
    //     // Get the canvas drawing context for the lightningBitmap
    //     let ctx: any = this.lightningBitmap.context;
    //     let width: number = this.lightningBitmap.width;
    //     let height: number = this.lightningBitmap.height;
    //
    //     // Our lightning will be made up of several line segments starting at
    //     // the center of the top edge of the bitmap and ending at the bottom edge
    //     // of the bitmap.
    //
    //     // Clear the canvas
    //     if (!branch) {
    //         ctx.clearRect(0, 0, width, height);
    //     }
    //
    //     // Draw each of the segments
    //     for (let i: number = 0; i < segments; i++) {
    //         // Set the lightning color and bolt width
    //         ctx.strokeStyle = 'rgb(255, 255, 255)';
    //         ctx.lineWidth = boltWidth;
    //
    //         ctx.beginPath();
    //         ctx.moveTo(x, y);
    //
    //         // Calculate an x offset from the end of the last line segment and
    //         // keep it within the bounds of the bitmap
    //         if (branch) {
    //             // For a branch
    //             x += this.game.rnd.integerInRange(-10, 10);
    //         } else {
    //             // For the main bolt
    //             x += this.game.rnd.integerInRange(-30, 30);
    //         }
    //
    //         if (x <= 10) {
    //             x = 10;
    //         }
    //         if (x >= width - 10) {
    //             x = width - 10;
    //         }
    //
    //         // Calculate a y offset from the end of the last line segment.
    //         // When we've reached the ground or there are no more segments left,
    //         // set the y position to the height of the bitmap. For branches, we
    //         // don't care if they reach the ground so don't set the last coordinate
    //         // to the ground if it's hanging in the air.
    //         if (branch) {
    //             // For a branch
    //             y += this.game.rnd.integerInRange(10, 20);
    //         } else {
    //             // For the main bolt
    //             y += this.game.rnd.integerInRange(20, height / segments);
    //         }
    //         if ((!branch && i === segments - 1) || y > height) {
    //             y = height;
    //         }
    //
    //         // Draw the line segment
    //         ctx.lineTo(x, y);
    //         ctx.stroke();
    //
    //         // Quit when we've reached the ground
    //         if (y >= height) {
    //             break;
    //         }
    //
    //         // Draw a branch 20% of the time off the main bolt only
    //         if (!branch) {
    //             if (1 + Math.random() * 20 === 20) {
    //                 // Draws another, thinner, bolt starting from this position
    //                 this.createLightningTexture(x, y, 10, 1, true);
    //             }
    //         }
    //     }
    //
    //     // This just tells the engine it should update the texture cache
    //     this.lightningBitmap.dirty = true;
    // }
    //
    // // Fragment shaders are small programs that run on the graphics card and alter
    // // the pixels of a texture. Every framework implements shaders differently but
    // // the concept is the same. This shader takes the lightning texture and alters
    // // the pixels so that it appears to be glowing. Shader programming itself is
    // // beyond the scope of this tutorial.
    // //
    // // There are a ton of good resources out there to learn it. Odds are that your
    // // framework already includes many of the most popular shaders out of the box.
    // //
    // // This is an OpenGL/WebGL feature. Because it runs in your web browser
    // // you need a browser that support WebGL for this to work.
    // public Glow(game: Phaser.Game): void {
    //     Phaser.Filter.call(this, game);
    //
    //     this.fragmentSrc = [
    //         'precision lowp float;',
    //         'varying vec2 vTextureCoord;',
    //         'varying vec4 vColor;',
    //         'uniform sampler2D uSampler;',
    //
    //         'void main() {',
    //         'vec4 sum = vec4(0);',
    //         'vec2 texcoord = vTextureCoord;',
    //         'for(int xx = -4; xx <= 4; xx++) {',
    //         'for(int yy = -3; yy <= 3; yy++) {',
    //         'float dist = sqrt(float(xx*xx) + float(yy*yy));',
    //         'float factor = 0.0;',
    //         'if (dist === 0.0) {',
    //         'factor = 2.0;',
    //         '} else {',
    //         'factor = 2.0/abs(float(dist));',
    //         '}',
    //         'sum += texture2D(uSampler, texcoord + vec2(xx, yy) * 0.002) * factor;',
    //         '}',
    //         '}',
    //         'gl_FragColor = sum * 0.025 + texture2D(uSampler, texcoord);',
    //         '}'
    //     ];
    // }

    //Phaser.Filter.Glow.prototype = Object.create(Phaser.Filter.prototype);
    //Phaser.Filter.Glow.prototype.constructor = Phaser.Filter.Glow;

}
