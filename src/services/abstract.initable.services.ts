export default abstract class AbstractInitableServices {

	abstract init(): void | Promise<void>;

}
