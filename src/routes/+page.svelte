<script>
    import projects from '$lib/projects.json';
    import Project from "$lib/Project.svelte";
</script>

<h1>george abu daoud</h1>
<p>i love cats! :3</p>
<img src="images/cat.jpeg" alt="cat">

<style>
    tr{
        width: 100%;
    }
    th{
        padding: auto;
    }
</style>

<h2>github stats</h2>
{#await fetch("https://api.github.com/users/georgead01") }
	<p>Loading...</p>
{:then response}
	{#await response.json()}
		<p>Decoding...</p>
	{:then data}
        <tr>
            <th>followers:</th>
            <th>following:</th>
            <th>public repos:</th>
            <th>public gists:</th>
        </tr>
        <tr>
            <th>{ JSON.stringify(data.followers) }</th>
            <th>{ JSON.stringify(data.following) }</th>
            <th>{ JSON.stringify(data.public_repos) }</th>
            <th>{ JSON.stringify(data.public_gists) }</th>
        </tr>
	{:catch error}
		<p class="error">
			Something went wrong: {error.message}
		</p>
	{/await}
{:catch error}
	<p class="error">
		Something went wrong: {error.message}
	</p>
{/await}

<h2>projects highlights</h2>
<div class="projects">
    {#each projects.slice(0,3) as p}
        <Project info={p} hLevel=3 />
    {/each}
</div>