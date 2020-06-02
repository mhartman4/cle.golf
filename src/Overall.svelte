<script>
	import { onMount } from "svelte"
	import OverallTeam from "./OverallTeam.svelte"
	let overall
	
	onMount(async () => {
		overall = await getOverallStandings()
	})
	
	const getOverallStandings = async () => {
		const response = await fetch(`https://spreadsheets.google.com/feeds/list/1YsZn_ovmbxOE8gUlmAT7z_nUv5mg9qRdwnNAX-lIrnI/3/public/full?alt=json`)
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
			<OverallTeam team={team} placeNumber={i+1}></OverallTeam>
		{/each}
	{:else}
		<img class="sheets-icon" src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x32.png"><span>&nbsp;Loading overall standings</span>
	{/if}
</div>