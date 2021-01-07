<script>
	export let players
</script>
<table>
	{#each players as p}
		<tr>
			<td>{p.name}</td>
			<td>{p.money}</td>
		</tr>
	{/each}
</table>

<style>
	table {
		border: 1px black;
	}
</style>