<style>
    svg {
        max-width: 20em;
        margin-block: 2em;

        /* Do not clip shapes outside the viewBox */
        overflow: visible;
    }

    svg:has(path:hover) {
        path:not(:hover) {
            opacity: 50%;
        }
    }

    path {
        transition: 300ms;
        cursor: pointer;
    }

    .selected {
        --color: oklch(60% 45% 0) !important;

        &:is(path) {
            fill: var(--color);
        }
    }

    .legend{
        border: 1px solid lightgray;
        padding: 5%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(9em, 1fr));
    }

    .swatch{
        width: 1em;
        aspect-ratio: 1/1;
        background-color: var(--color);
        border-radius: 100%;
    }

    li{
        display: flex;
        align-items: center;
    }
</style>

<script>
    import * as d3 from 'd3';
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

    export let data = [];

    let sliceGenerator = d3.pie().value(d => d.value);

    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    export let selectedIndex = -1;

    let pieData;
    $: {
        let arcData = sliceGenerator(data);
        let arcs = arcData.map(d => arcGenerator(d));
        pieData = data.map(d => ({...d}));
        pieData = pieData.map((d, i) => ({...d, ...arcData[i], arc: arcs[i]}));
    }
</script>

<svg viewBox="-50 -50 100 100">
	{#each pieData as d, index}
        <path d={d.arc} fill={ colors(d.label) }
            class:selected={selectedIndex === index}
            on:click={e => selectedIndex = selectedIndex === index ? -1 : index} />
    {/each}
</svg>

<ul class="legend">
	{#each pieData as d, index}
		<li style="--color: { colors(d.label) }">
			<span class="swatch"></span>
			{d.label} <em>({d.value})</em>
		</li>
	{/each}
</ul>