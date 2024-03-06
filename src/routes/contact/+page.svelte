<svelte:head>
	<title>contact me!</title>
</svelte:head>

<h1>contact</h1>

<form action="mailto:georgead@mit.edu" method="POST" enctype="text/plain">
    <label for="email">Email:</label>
    <input name="email" type="email" id="email">
    <label for="subject">Subject:</label>
    <input name="subject" type="text" id="subject">
    <label for="body">Body:</label>
    <textarea name="body" id="body"></textarea>
    <button>Submit</button>
</form>
