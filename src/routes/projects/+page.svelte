<script>
    import projects from '$lib/projects.json';
    import Project from "$lib/Project.svelte";
    import Pie from '$lib/Pie.svelte';
    import * as d3 from 'd3';

    let query = "";
    let selectedYearIndex = -1;

    let filteredProjects = projects;

    $: filteredProjects = projects.filter(project => {
        let values = Object.values(project).join("\n").toLowerCase();
        return values.includes(query.toLowerCase());
    });

    let pieData;

    $: {

        pieData = {};

        let rolledData = d3.rollups(filteredProjects, v => v.length, d => d.year);

        pieData = rolledData.map(([year, count]) => {
            return { value: count, label: year };
        });

    }

    let selectedYear;
    let filteredByYear = [];
    $: selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;

    $: {
        if (selectedYear){
            filteredByYear = filteredProjects.filter(project => {
                return project.year === selectedYear;
            })
        }
        else {
            filteredByYear = filteredProjects;
        }
    }
</script>

<svelte:head>
	<title>projects</title>
</svelte:head>

<h1>{filteredProjects.length} projects</h1>
<Pie data={pieData} bind:selectedIndex={selectedYearIndex} />
<input type="search" bind:value={query}
       aria-label="Search projects" placeholder="🔍 Search projects…" />
<div class="projects">
{#each filteredByYear as p}
    <Project info={p} hLevel=2 />
{/each}
</div>