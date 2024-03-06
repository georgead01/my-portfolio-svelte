<script>
    import projects from '$lib/projects.json';
    import Project from "$lib/Project.svelte";
</script>

<h1>george abu daoud</h1>
<p>i love cats! :3</p>
<img src="images/cat.jpeg" alt="cat">

<h2>projects highlights</h2>
<div class="projects">
    {#each projects.slice(0,3) as p}
        <Project info={p} hLevel=3 />
    {/each}
</div>