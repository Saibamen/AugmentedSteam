import {Context, ContextType} from "../../Modules/Content";
import FHideTrademarks from "../Common/FHideTrademarks";

export class CCommunityBase extends Context {

    constructor(type = ContextType.COMMUNITY_DEFAULT, features = []) {

        features.push(
            FHideTrademarks,
        );

        super(type, features);
    }
}
