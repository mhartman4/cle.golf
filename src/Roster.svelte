<script>
	import { slide } from 'svelte/transition'
	export let roster, teamName
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
				<!-- {#if player.isPlaying} -->
					<tr class="player-row{player.isPlaying ? '' : ' inactive'}{player.position ? '' : ' cut'}">
						<td>{player.name}</td>
	                    <td>{player.position ? numeral(player.projMoney).format("$0,0") : ""}</td>
	                    <td>{player.isPlaying ? (player.position ? player.position : (player.pgaStatus === "wd" ? "WD" : "CUT")) : "--"}</td>
	                    <td>{player.position ? (player.total ? player.total : "E") : ""}</td>
	                    <td>{player.today ? player.today : ""}</td>
	                    <td>{player.thru ? player.thru : ""}</td>
					</tr>
				<!-- {/if} -->
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
	.cut {
		background-color: #ea9999;
	}
	.inactive {
		background-color: #dedede;
	}
	.favorite-button {
		margin: 5px;
	}
</style>