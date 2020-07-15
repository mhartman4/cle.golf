<script>
	import Roster from "./Roster.svelte"
	export let team, placeNumber
	let id = team.id.$t.replace("https://spreadsheets.google.com/feeds/list/1YsZn_ovmbxOE8gUlmAT7z_nUv5mg9qRdwnNAX-lIrnI/2/public/full/", "")
	let teamName = team.gsx$team.$t
	let owner = team.gsx$owner.$t
	let pictureUrl = "https://pga-tour-res.cloudinary.com/image/upload/c_fill,dpr_2.0,f_auto,g_face:center,h_45,q_auto,t_headshots_leaderboard_l,w_45/headshots_" + team.roster[0].id + ".png"
    let rosterVisible = false


    function toggleRoster() {
    	rosterVisible = !rosterVisible
    	if (rosterVisible) {
		  	ga('send', {
		  		hitType: 'event',
		  		eventCategory: 'Weekly',
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
					<td class="standings-place-number" width="30">{placeNumber}</td>
					<td width="75">
						<img class="player-photo" src="{pictureUrl}" width="45" height="45">
					</td>
					<td class="team-name">
						{teamName}
						<div class="owner">{owner}</div>
					</td>
					<td class="team-earnings">
						{numeral(team.totalMoney).format('$0,0')}<br>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	{#if rosterVisible}
		<Roster roster={team.roster}></Roster>
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
	    margin: 0px 5px;
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
</style>