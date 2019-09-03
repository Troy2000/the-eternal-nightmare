export default class Images {

    public static BACKGROUND: string = 'background/bg_forest';
    public static FLOOR: string = 'background/bg_floor';

    /**
     * A list of all images we need to show the preloader itself.
     * These should be loaded in the splash screen.
     */
    public static preloadList: string[] = [
        //Add images for the preloader
        Images.BACKGROUND,
        Images.FLOOR
    ];

    /**
     * A list of all images we need after the preloader.
     */
    public static list: string[] = [
        //Add images to load
    ];
}
