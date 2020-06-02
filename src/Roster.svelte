<script>
	import { slide } from 'svelte/transition'
	export let roster
</script>

<div class="roster" transition:slide>
	<table class="roster-table">
		<thead>
			<tr>
				<th class='roster-header'>Golfer</th>
                <th class='roster-header'>Proj. $</th>
                <th class='roster-header'>Pos</th>
                <th class='roster-header'>Total</th>
                <th class='roster-header'>Today</th>
                <th class='roster-header'>Thru</th>
			</tr>
		</thead>
		<tbody>
			{#each roster as player}
				{#if player.isPlaying}
					<tr class="player-row">
						<td>{player.name}</td>
	                    <td>{numeral(player.projMoney).format("$0,0")}</td>
	                    <td>{player.position ? player.position : ""}</td>
	                    <td>{player.total ? player.total : ""}</td>
	                    <td>{player.today ? player.today : ""}</td>
	                    <td>{player.thru ? player.thru : ""}</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>

<style>
	.roster {
		margin-bottom: 10px;
	}
	.roster-table {
		margin: 0 auto;
		border-spacing: 0;
	    border-collapse: collapse;
	}
	.roster-header {
		font-family: "Fjalla One";
	    border-bottom: 1px solid black;
	    text-transform: uppercase;
	    font-size: 10px;
	    text-decoration: none;

	}
	.player-row {
		font-size: 10px;
		font-family: "Roboto";
		padding: 5px;
	}
	td {
		padding: 5px;
	}
</style>