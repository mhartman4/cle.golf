<script>
	import Roster from "./Roster.svelte"
	export let team, placeNumber, isFavorite, activeGolferCounts
	team.roster = team.roster.sort((a,b) => b.sort - a.sort)
	
	// $: pictureUrl = "https://pga-tour-res.cloudinary.com/image/upload/c_fill,dpr_2.0,f_auto,g_face:center,h_45,q_auto,t_headshots_leaderboard_l,w_45/headshots_" + team.roster[0].id + ".png"

    let rosterVisible = false
    let dvLeague = window.location.href.includes("?league=dv")

    function toggleRoster() {
    	rosterVisible = !rosterVisible
    	if (rosterVisible) {
		  	ga('send', {
		  		hitType: 'event',
		  		eventCategory: 'Weekly',
		  		eventAction: 'Click Team',
		  		eventLabel: team.name
			});
    	}
  
    }

</script>


<div class="team">
	<div class="header" on:click={toggleRoster}>
		<table border="0" width="100%">
			<tbody>
				<tr>
					<td class="standings-place-number" width="15">{placeNumber}</td>
					<td width="55">
						<img class="player-photo" src="https://pga-tour-res.cloudinary.com/image/upload/c_fill,dpr_2.0,f_auto,g_face:center,h_45,q_auto,t_headshots_leaderboard_l,w_45/headshots_{team.roster[0].id}.png" width="45" height="45">
					</td>
					<td class="team-name {isFavorite ? " favorite" : ""}">
						{team.teamName}
						<div class="owner {dvLeague ? " invisible" : ""}">{team.owner}&nbsp;&nbsp;
						{#if activeGolferCounts["pga"] > 0}
								<span class="golfer-count pga">{activeGolferCounts["pga"]}</span>
							{/if}
							{#if activeGolferCounts["liv"] > 0}
								<span class="golfer-count liv">{activeGolferCounts["liv"]}</span>
							{/if}
							{#if activeGolferCounts["eur"] > 0}
								<span class="golfer-count eur">{activeGolferCounts["eur"]}</span>
							{/if}
						</div>

					</td>
					<td class="team-earnings {isFavorite ? " favorite" : ""}">
						{numeral(team.totalMoney).format('$0,0')}<br>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	{#if rosterVisible}
		<Roster roster={team.roster} teamName={team.teamName}></Roster>
	{/if}
</div>


<style>
	
  	.header {
  		padding: 5px 2px;
  	}
	.standings-place-number {
	    color: black;
	    margin: 0px 5px;
	    /*padding-left: 5px;*/
	    font-size: 12px;
	    text-align: left;
	}
	.player-photo {
    	margin-right: 8px;
    	margin-left: 4px;
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
	.favorite {
		color: #de0000;
	}
	.invisible {
		display: none;
	}
	.golfer-count {
		display: inline-block;
	    padding: 0.25em 0.4em;
	    font-size: 80%;
	    font-weight: 300;
	    line-height: 1;
	    text-align: center;
	    white-space: nowrap;
	    vertical-align: baseline;
	    border-radius: 0.25rem;
	    color: white;
	}
	.pga {
		background-color: black;
	}
	.liv {
		background-color: #0b5394;
	}
	.eur {
		background-color: #e69138;
	}
</style>