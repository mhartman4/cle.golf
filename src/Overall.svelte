<script>
	import { onMount } from "svelte"
	import OverallTeam from "./OverallTeam.svelte"
	let overall, favoriteTeam
	export let dvLeague = false
	
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
		const endpoint = `https://docs.google.com/spreadsheets/d/1lNeLG3zTCsDr7KvKJNky1maiUNVoEqapj-LCt8G9Z7Q/gviz/tq?tqx=out:json&tq&gid=1042369643`

		const response = await fetch(endpoint)
		const text = await response.text()
		const data = await JSON.parse(text.substring(47).slice(0, -2)).table
		
		const filtered = data.rows.filter(e => e.c[6] != null)
		// console.log(filtered)
		const teams = []

		filtered.forEach(t => {
			teams.push({
				"name": t.c[5].v,
				"owner": t.c[4].v,
				"earnings": t.c[6].v,
				"balance": t.c[7].v,
				"roster": JSON.parse(t.c[8].v)
			})
		})
		const sortedTeams = teams.sort((a,b) => {
			return b.earnings - a.earnings
		})
		return sortedTeams
	}
</script>

<div class="teams">
	{#if overall}
		{#each overall as team, i}
			<table class="team" width="100%" border="0">
				<tr>
					<!-- <td class="favorite-cell" width="25">
						<span class="favorite-button" on:click={setFavorite(team.gsx$team.$t)}>
						{#if favoriteTeam === team.gsx$team.$t}
							<span style="font-size: 10px;">❤️</span>
						{:else}
							<span style="font-size: 13px;color: #969494;">♡</span>
						{/if}
						</span>	
					</td> -->
					<td>
						<OverallTeam team={team} placeNumber={i+1} isFavorite={false}></OverallTeam>	
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