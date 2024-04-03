<script>
    import * as d3 from "d3";

    import { onMount } from "svelte";

    let data = [];
    let commits = [];
    let max_depth = 0;
    let avg_line_length = 0;
    let avg_depth = 0;

    let width = 1000, height = 600;
    let margin = {top: 10, right: 10, bottom: 30, left: 20};
    let usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left
    };
    usableArea.width = usableArea.right - usableArea.left;
    usableArea.height = usableArea.bottom - usableArea.top;
    let xScale = d3.scaleLinear([0, 365],[usableArea.left, usableArea.right]);
    let yScale = d3.scaleLinear([0, 24],[usableArea.bottom, usableArea.top]);
    let xAxis, yAxis;
    let yAxisGridlines;
    let hoveredIndex = -1;
    $: hoveredCommit = commits[hoveredIndex] ?? {};

    let cursor = {x: 0, y: 0};

    $: {
        d3.select(xAxis).call(d3.axisBottom(xScale));
        d3.select(yAxis).call(d3.axisLeft(yScale));
        d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
        d3.select(yAxisGridlines).call(d3.axisLeft(yScale).tickFormat("").tickSize(-usableArea.width));
    }

    onMount(async () => {
        data = await d3.csv("loc.csv", row => ({
            ...row,
            line: Number(row.line), // or just +row.line
            depth: Number(row.depth),
            length: Number(row.length),
            date: new Date(row.date + "T00:00" + row.timezone),
            datetime: new Date(row.datetime)
        }));

        commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
            let first = lines[0];
            let {author, date, time, timezone, datetime} = first;
            let ret = {
                id: commit,
                url: "https://github.com/vis-society/lab-7/commit/" + commit,
                author, date, time, timezone, datetime,
                hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                totalLines: lines.length
            };

            // Like ret.lines = lines
            // but non-enumerable so it doesn’t show up in JSON.stringify
            Object.defineProperty(ret, "lines", {
                value: lines,
                configurable: true,
                writable: true,
                enumerable: false,
            });

            return ret;
        });

        xScale = d3.scaleTime(d3.extent(data, (d) => d.datetime), [usableArea.left, usableArea.right]).nice();

        data.forEach(elt => {
            if(elt.depth > max_depth){
                max_depth = elt.depth;
            }

            avg_depth += elt.depth;
        });


        if (data.length == 0){
            avg_line_length = 0;
            avg_depth = 0;
        } else{
            data.forEach(elt => {
                avg_line_length += elt.length;
            });
            avg_line_length /= data.length;
            avg_depth /= data.length;
        }
    });

</script>

<style>
	svg {
		overflow: visible;
        transform-origin: center;
        transform-box: fill-box;
	}
    .gridlines {
        stroke-opacity: .2;
    }
    circle {
        transition: 200ms;

        &:hover {
            transform: scale(1.5);
        }
        transform-origin: center;
        transform-box: fill-box;

    }

    dl {
        background-color: oklch(100% 0% 0 / 80%);
        box-shadow: 3px 3px 5px lightgrey;
        backdrop-filter: blur(2.5px);
    }

    dl.info {
        position: fixed;
        /* ... other styles ... */
        transition-duration: 500ms;
        transition-property: opacity, visibility;

        &[hidden]:not(:hover, :focus-within) {
            opacity: 0;
            visibility: hidden;
        }
    }
</style>

<svelte:head>
	<title>meta</title>
</svelte:head>

<h1>meta</h1>

<p>this page contains stats about the code of this website</p>

<h2>stats</h2>

<dl class="stats">
    <dt># of Commits</dt>
    <dd>{commits.length}</dd>
	<dt>Total <abbr title="Lines of code">LOC</abbr></dt>
	<dd>{data.length}</dd>
    <dt>Max Depth</dt>
    <dd>{max_depth}</dd>
    <dt>Avg. Depth</dt>
    <dd>{avg_depth}</dd>
    <dt>Avg. Line Length</dt>
    <dd>{avg_line_length}</dd>
</dl>

<h2>commits by time of day</h2>
{JSON.stringify(cursor, null, "\t")}
<svg viewBox="0 0 {width} {height}">
    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
    <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
	<g class="dots">
        {#each commits as commit, index }
            <circle
                cx={ xScale(commit.datetime) }
                cy={ yScale(commit.hourFrac) }
                r="5"
                fill="steelblue"
                on:mouseenter={evt => {
                    hoveredIndex = index;
                    cursor = {x: evt.x, y: evt.y};
                }}
                on:mouseleave={evt => hoveredIndex = -1}
            />
        {/each}
    </g>
</svg>

<dl id="commit-tooltip" class="info tooltip" hidden={hoveredIndex === -1} style="top: {cursor.y}px; left: {cursor.x}px">
	<dt>Commit</dt>
	<dd><a href="{ hoveredCommit.url }" target="_blank">{ hoveredCommit.id }</a></dd>

    <dt>Author</dt>
    <dd>{ hoveredCommit.author }</dd>

	<dt>Date</dt>
	<dd>{ hoveredCommit.datetime?.toLocaleString("en", {date: "full"}) }</dd>

    <dt>Time</dt>
    <dd>{hoveredCommit.time}</dd>
    
    <dt>Lines</dt>
    <dd>{ hoveredCommit.totalLines }</dd>

	<!-- Add: Time, author, lines edited -->
</dl>

