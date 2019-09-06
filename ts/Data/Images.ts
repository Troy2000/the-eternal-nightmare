export default class Images {

    public static BACKGROUND: string = 'background/bg_forest';
    public static MOON: string = 'background/bg_moon';
    public static FLOOR: string = 'background/bg_floor';

    public static STAGEBAR: string = 'background/bg_stagebar';
    public static POINTER: string = 'background/bg_pointer';

    public static HEART: string = 'player/health/heartContainer';
    public static WOODSPIKE: string = 'enemy/woodSpike/woodSpike';

    /**
     * A list of all images we need to show the preloader itself.
     * These should be loaded in the splash screen.
     */
    public static preloadList: string[] = [
        //Add images for the preloader
        Images.BACKGROUND,
        Images.FLOOR,
        Images.STAGEBAR,
        Images.POINTER,
        Images.HEART,
        Images.WOODSPIKE,
        Images.MOON
    ];

    /**
     * A list of all images we need after the preloader.
     */
    public static list: string[] = [
        //Add images to load
    ];
}
