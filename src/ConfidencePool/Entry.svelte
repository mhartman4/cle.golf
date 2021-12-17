<script>
	import Pick from "./Pick.svelte"
	import { slide } from 'svelte/transition'
	export let entry,pointswon,pointsremaining,placenumber,picks
	let teamName = entry.slice(0, -1).split(" (")[0]
	let owner = entry.slice(0, -1).split(" (")[1]
	let picksVisible = false

	function togglePicks() {
    	picksVisible = !picksVisible
    	if (picksVisible) {
		  	ga('send', {
		  		hitType: 'event',
		  		eventCategory: 'Confidence Pool',
		  		eventAction: 'Click Picks',
		  		eventLabel: entry
			});
    	}
    }
</script>
<div class="team">
	<div class="team" on:click={togglePicks}>
		<div class="header">
			<table border="0" width="100%">
				<tbody>
					<tr>
						<td class="standings-place-number" width="20">{placenumber}</td>
						<td width="50" align="left">
							<span class="pointswon">{pointswon}</span>
						</td>
						<td class="team-name">
							{teamName}
							<div class="owner">{owner}</div>
						</td>
						<td class="pointsremaining">
							{pointsremaining}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		{#if picksVisible}
			
			<div class="roster" transition:slide>
				<table class="roster-table">
					<thead>
						<tr>
							<th class='roster-header'>Team</th>
			                <th class='roster-header'>Wager</th>
						</tr>
					</thead>
					<tbody>
					{#each picks as pick}
						<Pick entry={pick['Entry']} team={pick['Team']} wager={pick['Wager']} pointswon={pick['Points Won']} pointslost={pick['Points Lost']}/>
					{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
<style>
	.team {
    	margin: 5px 0px;
    	border-radius: 4px;
    	background-color: white;	
  	}
  	.header {
  		padding: 5px 2px;
  	}
	.standings-place-number {
	    color: black;
	    padding-left: 5px;
	    padding-top: 6px;
	    font-size: 12px;
	    text-align: left;
	}
	.team-name {
	    font-size: 16px;
	    margin: 0px 8px;
	    color: #46404A;
	    text-align: left;
	    width: 60%;
	}
	.owner {
	    color: lightslategrey;
	    font-size: 12px;
	    font-family: "Roboto";
	}
	.pointswon {
	    background-color: #7bbb5e;
    	color: white;
    	font-family: "Roboto";
    	padding: .2em .2em .2em;
    	font-size: 12px;
    	display: inline;
    	font-weight: 700;
    	line-height: 1;
    	border-radius: .25em;
	}
	.pointsremaining {
		background-color: lightslategrey;
    	color: white;
    	font-family: "Roboto";
    	padding: .2em .2em .2em;
    	font-size: 12px;
    	display: inline;
    	font-weight: 700;
    	line-height: 1;
    	border-radius: .25em;
	}
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
	    /*border-bottom: 1px solid black;*/
	    text-transform: uppercase;
	    font-size: 10px;
	    text-decoration: none;

	}
	.player-row {
		font-size: 10px;
		font-family: "Roboto";
		padding: 5px;
	}
	
</style>