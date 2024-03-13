<script>
    let colorScheme = "light dark";
    let root = globalThis?.document?.documentElement;
    let localStorage = globalThis.localStorage ?? {};
    colorScheme = localStorage.colorScheme ?? "light dark";
    $: root?.style.setProperty("color-scheme", colorScheme);
    $: localStorage.colorScheme = colorScheme;
</script>

<style>
    .color-scheme {
        position: absolute;
        top: 1rem;
        right: 2rem;
        font-size: 80%;
        font-family: inherit;
}
</style>

<label class="color-scheme">
    Theme:
    <select bind:value={ colorScheme }>
    <option value="light dark">default</option>
    <option value="light">light</option>
    <option value="dark">dark</option>
    </select>
</label>
<slot /> 