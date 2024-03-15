import protobuf from "protobufjs";
import ServiceAccountCartProto from "../../../../../messages/webui/service_accountcart.json";

export class AddItemsToCart {

    private requestType;
    private responseType;

    constructor() {
        // @ts-ignore
        const root = protobuf.Root.fromJSON(ServiceAccountCartProto);
        this.requestType = root.lookupType("CAccountCart_AddItemsToCart_Request");
        this.responseType = root.lookupType("CAccountCart_AddItemsToCart_Response");
    }

    async send(accessToken: string, userCountry: string, packageids: number[], bundleids: number[]) {
        const url = `https://api.steampowered.com/IAccountCartService/AddItemsToCart/v1?access_token=${accessToken}`;

        let items = [
            ...packageids.map(packageid => {return {packageid}}),
            ...bundleids.map(bundleid => {return {bundleid}}),
        ]

        const buffer = this.requestType.encode({
            userCountry,
            items
        }).finish();

        let data = new FormData();
        data.set("input_protobuf_encoded", btoa(String.fromCharCode(...buffer)))

        let response = await fetch(url, {
            method: "POST",
            body: data
        });

        if (!response || !response.ok) {
            throw new Error();
        }

        let body = (await response.body?.getReader().read())?.value;
        if (!body) {
            throw new Error();
        }

        return this.responseType.decode(body);
    }
}
