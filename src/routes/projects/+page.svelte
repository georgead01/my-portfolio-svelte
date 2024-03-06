<svelte:head>
    <script>
        import projects from '$lib/projects.json';
    </script>
	<title>projects</title>
</svelte:head>

<h1>projects</h1>

<pre>{ JSON.stringify(projects, null, "\t") }</pre>