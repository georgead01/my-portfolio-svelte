<script>
    export let info = {};
    export let hLevel = 1;
</script>

<style>

</style>

<article>
    <svelte:element this={"h" + hLevel}>{ info.title }</svelte:element>
    <img src="{info.image}" alt="">
    <p>{info.description} - {info.year}</p>
</article>