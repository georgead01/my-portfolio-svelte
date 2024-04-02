<script>
    import * as d3 from "d3";

    import { onMount } from "svelte";

    let data = [];
    let commits = [];
    let max_depth = 0;
    let avg_line_length = 0;
    let avg_depth = 0;

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

<svelte:head>
	<title>meta</title>
</svelte:head>

<h1>meta</h1>

<p>this page contains stats about the code of this website</p>

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