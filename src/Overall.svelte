<script>
	import { onMount } from "svelte"
	import OverallTeam from "./OverallTeam.svelte"
	let overall, favoriteTeam
	
	onMount(async () => {
		overall = await getOverallStandings()
		if (document.cookie.split('; ').find(row => row.startsWith('favoriteTeam'))) {
			favoriteTeam = document.cookie.split('; ').find(row => row.startsWith('favoriteTeam')).split('=')[1];	
		}
		else {
			favoriteTeam = ""
		}
	})
	function setFavorite(message) {
    	document.cookie = "favoriteTeam=" + message
    	favoriteTeam = message
    	ga('send', {
		  		hitType: 'event',
		  		eventCategory: 'Weekly',
		  		eventAction: 'Favorite',
		  		eventLabel: teamName
			});
    }
	const getOverallStandings = async () => {
		// const response = await fetch(`https://spreadsheets.google.com/feeds/list/1YsZn_ovmbxOE8gUlmAT7z_nUv5mg9qRdwnNAX-lIrnI/3/public/full?alt=json`)
		const response = await fetch(`https://kvdb.io/vRrcDLPTr4WWpVTJxim1H/overall?timestamp=` + Date.now())
		const data = await response.json()
		const teams = data.feed.entry.filter(row => row.gsx$teamname.$t != "")
		teams.forEach((team) => {
			team.roster = []
			data.feed.entry.forEach((player) => {
				if (player.gsx$team.$t == team.gsx$team.$t)
				{
					team.roster.push(player)
				}
			})	
		})
		const sortedTeams = teams.sort((a,b) => {
			return numeral(a.gsx$teamtotalearnings.$t).value() > numeral(b.gsx$teamtotalearnings.$t).value() ? -1 : numeral(a.gsx$teamtotalearnings.$t).value() < numeral(b.gsx$teamtotalearnings.$t).value() ? 1 : 0
		})
		return sortedTeams
	}
</script>

<div class="teams">
	{#if overall}
		{#each overall as team, i}
			<table class="team" width="100%" border="0">
				<tr>
					<td class="favorite-cell" width="25">
						<span class="favorite-button" on:click={setFavorite(team.gsx$team.$t)}>
						{#if favoriteTeam === team.gsx$team.$t}
							<span style="font-size: 10px;">❤️</span>
						{:else}
							<span style="font-size: 13px;color: #969494;">♡</span>
						{/if}
						</span>	
					</td>
					<td>
						<OverallTeam team={team} placeNumber={i+1} isFavorite={favoriteTeam === team.gsx$team.$t}></OverallTeam>	
					</td>
				</tr>
			</table>
			
		{/each}
	{:else}
		<img class="sheets-icon" src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x32.png"><span>&nbsp;Loading overall standings</span>
	{/if}
</div>

<style>
	.favorite-cell {
		vertical-align: top;
	  	padding-top: 22px;
	}
	.team {
    	margin: 5px 0px;
    	border-radius: 4px;
    	border: 1px solid #ddd;
    	background-color: white;
  	}
  	.panel-group {
	    margin-bottom: 20px;
		border-radius: 4px;
	}
</style>