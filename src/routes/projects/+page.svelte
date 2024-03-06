<script>
    import projects from '$lib/projects.json';
</script>

<svelte:head>
	<title>projects</title>
</svelte:head>

<h1>projects</h1>

{#each projects as p}
	<article>
		<h2>Lorem ipsum dolor sit.</h2>
		<img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
		<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam dolor quos, quod assumenda explicabo odio, nobis ipsa laudantium quas eum veritatis ullam sint porro minima modi molestias doloribus cumque odit.</p>
	</article>
{/each}