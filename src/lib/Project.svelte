<script>
    export let info = {};
    export let hLevel = 1;
    let p = info;
</script>

<style>

</style>

<article>
    <svelte:element this={"h" + hLevel}>{ p.title }</svelte:element>
    <img src="{p.image}" alt="">
    <p>{p.description}</p>
</article>