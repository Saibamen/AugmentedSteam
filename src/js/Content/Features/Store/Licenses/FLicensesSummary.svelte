<script lang="ts" context="module">
    import self_ from "./FLicensesSummary.svelte";
    import {Feature} from "../../../modulesContent";
    import type {CLicenses} from "./CLicenses";

    export class FLicensesSummary extends Feature<CLicenses> {

        override apply(): void {
            let target = document.querySelector(".youraccount_page");
            if (!target) {
                throw new Error("Node not found");
            }

            (new self_({
                target,
                anchor: target.firstElementChild,
            }));
        }
    }
</script>

<script lang="ts">
    import {Localization} from "../../../../modulesCore";
    import {slide} from "svelte/transition";
    import SmallSteamButton from "../../../Steam/SmallSteamButton.svelte";
    import ToggleIcon from "../../../Steam/ToggleIcon.svelte";

    const total: Record<string, number> = {};
    const yearly: Record<string, Record<string, number>> = {};

    for (const item of document.querySelectorAll(".account_table tr")) {
        const dateStr = item.querySelector("td.license_date_col")?.textContent?.trim();
        if (!dateStr) { continue; }

        const year = /\d{4}/.exec(dateStr)?.[0] ?? Localization.str.thewordunknown;
        const type = item.querySelector("td.license_acquisition_col")?.textContent?.trim() || Localization.str.thewordunknown;

        total[type] = (total[type] ?? 0) + 1;
        (yearly[year] ??= {})[type] = (yearly[year][type] ?? 0) + 1;
    }

    let isOpen: boolean = false;
</script>


<div class="stats">
    <h3>
        {Localization.str.wl.label}
        <SmallSteamButton on:click={() => (isOpen = !isOpen)}>
            {isOpen ? Localization.str.hide : Localization.str.show}
            <ToggleIcon down={!isOpen} />
        </SmallSteamButton>
    </h3>

    {#if isOpen}
        <div class="block_content" transition:slide={{axis: "y", duration: 200}}>
            <table class="account_table">
                <thead>
                    <tr>
                        <th>{Localization.str.year}</th>
                        {#each Object.keys(total) as type}
                            <th>{type}</th>
                        {/each}
                        <th>{Localization.str.all}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each Object.entries(yearly).reverse() as [year, map]}
                        <tr>
                            <td>{year}</td>
                            {#each Object.keys(total) as type}
                                <td>{map[type] ?? 0}</td>
                            {/each}
                            <td>{Object.values(map).reduce((result, currentValue) => result + currentValue, 0)}</td>
                        </tr>
                    {/each}
                </tbody>
                <tfoot>
                    <tr>
                        <td>{Localization.str.all}</td>
                        {#each Object.values(total) as count}
                            <td>{count}</td>
                        {/each}
                        <td>{Object.values(total).reduce((result, currentValue) => result + currentValue, 0)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    {/if}
</div>


<style>
    .stats {
        margin-bottom: 20px;
    }

    h3 {
        color: #ffffff;
        font-size: 22px;
        font-family: "Motiva Sans", Sans-serif;
        font-weight: normal;
        text-transform: uppercase;
        display: flex;
        gap: 5px;
        justify-content: flex-start;
        align-items: baseline;
    }
</style>
