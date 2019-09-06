export default class Atlases {
    public static Interface: string = 'interface/interface';
    public static Player: string = 'player/playerWalk';
    public static SkeletonKnight: string = 'enemy/skeletonKnight';
    public static SkeletonWarrior: string = 'enemy/skeletonWarrior';

    /**
     *  A list of all atlases we need for the preloader.
     */
    public static preloadList: string[] = [
        //Add atlases
        Atlases.Interface,
        Atlases.Player,
        Atlases.SkeletonKnight,
        Atlases.SkeletonWarrior
    ];

    /**
     * A list of all atlases we need after the preloader.
     */
    public static list: string[] = [
    ];
}
