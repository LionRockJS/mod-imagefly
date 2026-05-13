import { Controller } from "@lionrockjs/central";
export default class ControllerImageFly extends Controller {
    static mixins: typeof import("@lionrockjs/central").ControllerMixin[];
    get request(): any;
    action_index(): Promise<void>;
}
