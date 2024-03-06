<script>
    import projects from '$lib/projects.json';
    import Project from "$lib/Project.svelte";
</script>

<svelte:head>
	<title>projects</title>
</svelte:head>

<h1>{projects.length} projects</h1>
<div class="projects">
{#each projects as p}
    <Project info={p} hLevel=2 />
{/each}
</div>