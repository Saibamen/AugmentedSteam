import {ASFeature} from "modules/ASFeature";

import {HTML, Localization} from "core";

export class FCardFoilLink extends ASFeature {

    checkPrerequisites() {
        return document.querySelector(".gamecards_inventorylink") !== null;
    }

    apply() {

        let url = window.location.href;
        let text;
        if (this.context.isFoil) {
            url = url.replace(/\?border=1/, "");
            text = Localization.str.view_normal_badge;
        } else {
            url += "?border=1";
            text = Localization.str.view_foil_badge;
        }

        HTML.beforeEnd(".gamecards_inventorylink",
            `<a class="btn_grey_grey btn_small_thin" href="${url}"><span>${text}</span></a>`);
    }
}
