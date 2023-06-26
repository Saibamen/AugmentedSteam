import {Localization} from "../../../../modulesCore";
import {RequestData} from "../../../modulesContent";
import {Page} from "../../Page";

export class AddToCart {

    static async post(formEl, onWishlist, addToCartEl) {

        const cartUrl = formEl.getAttribute("action");
        let response;

        try {
            response = await RequestData.post(cartUrl, new FormData(formEl), {}, "none");
        } catch (err) {
            // Likely network error; response.ok doesn't mean the item was added successfully
            Page.runInPageContext((errTitle, errDesc, errStr) => {
                window.SteamFacade.showAlertDialog(errTitle, `${errDesc}<br><br>${errStr}`);
            },
            [
                Localization.str.error,
                Localization.str.addtocart_dialog.error_desc,
                err.toString()
            ]);

            return;
        }

        // If redirected to a page other than the cart, follow the redirect
        if (response.url !== cartUrl) {
            window.location.assign(response.url);
            return;
        }

        if (onWishlist) {
            addToCartEl.setAttribute("href", cartUrl);
            addToCartEl.querySelector("span").textContent = Localization.str.in_cart;

            // Show the cart button and update item count
            document.getElementById("store_header_cart_btn").style.display = "block";
            const itemCount = document.getElementById("cart_item_count_value");
            itemCount.textContent = Number(itemCount.textContent) + 1;

            // The Cart page forces a DS update, so do here too
            Page.runInPageContext(() => {
                window.SteamFacade.dynamicStoreInvalidateCache();
            });
        } else {
            // On store pages, reload so page elements are updated
            window.location.reload();
        }
    }
}
