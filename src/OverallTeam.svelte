<script>
	import OverallRoster from "./OverallRoster.svelte"
	export let team, placeNumber
	let teamName = team.gsx$teamname.$t
	let owner = team.gsx$owner.$t
	let teamTotalEarnings = team.gsx$teamtotalearnings.$t
	let teamTotalPayout = team.gsx$teampayout.$t
    let rosterVisible = false

    function toggleRoster() {
    	rosterVisible = !rosterVisible
    	if (rosterVisible) {
		  	ga('send', {
		  		hitType: 'event',
		  		eventCategory: 'Overall',
		  		eventAction: 'Click Team',
		  		eventLabel: teamName
			});
    	}
    }

</script>


<div class="team" on:click={toggleRoster}>
	<div class="header">
		<table border="0" width="100%">
			<tbody>
				<tr>
					<td class="standings-place-number" width="25">{placeNumber}</td>
					<td width="45" align="left">
						<span class="team-total-payout { teamTotalPayout < 0 ? 'negative' : ''}">{numeral(teamTotalPayout).format("$0")}</span>
					</td>
					<td class="team-name">
						{teamName}
						<div class="owner">{owner}</div>
					</td>
					<td class="team-earnings">
						{numeral(teamTotalEarnings).format('$0,0')}<br>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	{#if rosterVisible}
		<OverallRoster roster={team.roster}></OverallRoster>
	{/if}
</div>


<style>
	.team {
    	margin: 5px 0px;
    	border-radius: 4px;
    	border: 1px solid #ddd;
    	background-color: white;	
  	}
  	.header {
  		padding: 5px 2px;
  	}
	.standings-place-number {
	    color: black;
	    padding-left: 5px;
	    font-size: 12px;
	    text-align: left;
	}
	.player-photo {
    	margin: 0px 8px;
 	}
	.team-name {
	    font-size: 16px;
	    margin: 0px 8px;
	    color: #46404A;
	    text-align: left;
	}
	.owner {
	    color: lightslategrey;
	    font-size: 12px;
	    font-family: "Roboto";
	}
	.team-earnings {
	    color: #46404A;
	    font-size: 16px;
	    padding: 0px 0px;
	    text-align: right;
	}
	.team-total-payout {
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
	.negative {
		background-color: #d9534f;
	}
</style>