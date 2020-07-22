<script>
  	import { onMount } from "svelte"
	import Team from "./Team.svelte"
	import Leaderboard from "./Leaderboard.svelte"
	let teams, tourneyName, leaderboard, favoriteTeam
	
	// onMount do all of our async functions
	onMount(async () => {
		if (document.cookie.split('; ').find(row => row.startsWith('favoriteTeam'))) {
			favoriteTeam = document.cookie.split('; ').find(row => row.startsWith('favoriteTeam')).split('=')[1];	
		}
		else {
			favoriteTeam = ""
		}
		
		console.log(favoriteTeam)
		const tourneyId = await getRelevantTournament()
		const pgaStanding = await getPgaStandings(tourneyId)
		const rawTeams = await getTeamRosters()
		processTeams(rawTeams, pgaStanding)
	})
	function setFavorite(message) {
    	document.cookie = "favoriteTeam=" + message
    	favoriteTeam = message
    	console.log(message)
    }
	const processTeams = (rawTeams, pgaStanding) => {
		rawTeams.forEach((team) => {
				team.processed = true
			  team.roster = []
			  team.totalMoney = 0.0
			  if (team.gsx$roster.$t != undefined) {
					JSON.parse(team.gsx$roster.$t).forEach((player) => {
						const pgaPlayerMatches = pgaStanding.filter(p => p.player_id === player.id)
						if (pgaPlayerMatches.length > 0) {
							player.isPlaying = true
							const pgaPlayer = pgaPlayerMatches[0]
							player.name = pgaPlayer.player_bio.first_name + ' ' + pgaPlayer.player_bio.last_name,
							player.positionNum = parseInt(pgaPlayer.current_position.replace(/\D/g,'')),
							player.position = pgaPlayer.current_position,
							player.projMoney = pgaPlayer.rankings.projected_money_event,
							player.today = pgaPlayer.today,
							player.thru = pgaPlayer.thru,
							player.total = pgaPlayer.total,
							player.playerId = pgaPlayer.player_id,
							team.totalMoney += pgaPlayer.rankings.projected_money_event
						}
						team.roster.push(player)
					})
				}
				
		})
		rawTeams.forEach((team) => {
			team.roster.forEach((player) => {
				if (player.isPlaying === undefined) {
					player.isPlaying = false
					// If not playing put at bottom of list
					player.sort = -2
				}
				else {
					if (isNaN(player.positionNum)) {
						// Next up is cut players
						player.sort = -1
					}
					else {
						// Then sort by projected money
						player.sort = parseInt(player.projMoney)
					}
				}
				// console.log(player)
			})
		})
		const sortedTeams = rawTeams.sort((a,b) => {
			return a.totalMoney > b.totalMoney ? -1 : a.totalMoney < b.totalMoney ? 1 : 0
		})
		
		sortedTeams.forEach( (team) => {
			const sortedRoster = team.roster.sort((a, b) => (a.sort < b.sort) ? 1 : -1)
			team.roster = sortedRoster
		})

		teams = sortedTeams
	}
	
	// Hit the google sheet for the schedule
	const getRelevantTournament = async () => {
		// const response = await fetch(`https://spreadsheets.google.com/feeds/list/1YsZn_ovmbxOE8gUlmAT7z_nUv5mg9qRdwnNAX-lIrnI/1/public/full?alt=json`)
		const response = await fetch(`https://kvdb.io/vRrcDLPTr4WWpVTJxim1H/schedule?timestamp=` + Date.now())
		
		const data = await response.json()
		const today = new Date()
		const tourneysBeforeToday = data.feed.entry.filter(event => new Date(Date.parse(event.gsx$date.$t)) <= today.setHours(0,0,0,0))
		const tourneyId = tourneysBeforeToday.slice(-1)[0].gsx$tournamentid.$t
		tourneyName = tourneysBeforeToday.slice(-1)[0].gsx$name.$t
		return tourneyId;
	}
	
	const getPgaStandings = async (tourneyId) => {
			// Hit KVDB to get our security blurb so we can call the PGA method
			const response = await fetch(`https://kvdb.io/vRrcDLPTr4WWpVTJxim1H/pgasecurityblurb?timestamp="` + Date.now());
			const securityBlurb = await response.text()
			console.log(securityBlurb)
			// This is where we hit the PGA
			return makePgaCall(securityBlurb, tourneyId);
	}
	
	const makePgaCall = async (securityBlurb, tourneyId) => {
		  console.log(securityBlurb)
			const pgaResp = await fetch("https://statdata.pgatour.com/r/" + tourneyId + "/2020/leaderboard-v2.json" + securityBlurb + "&timestamp=" + Date.now());
			const jsonResp = await pgaResp.json()
			leaderboard = await jsonResp.leaderboard.players
			return jsonResp.leaderboard.players
	}
	
	// This one gets our team rosters from the Google Sheet
	const getTeamRosters = async () => {
		// const response = await fetch(`https://spreadsheets.google.com/feeds/list/1YsZn_ovmbxOE8gUlmAT7z_nUv5mg9qRdwnNAX-lIrnI/2/public/full?alt=json`)
		const response = await fetch(`https://kvdb.io/vRrcDLPTr4WWpVTJxim1H/rosters`)
		const data = await response.json()
		return await data.feed.entry.filter(e => e.gsx$roster.$t)
	}
</script>

{#if tourneyName}
	<h1 class="tourney-name">{tourneyName}</h1>
{:else}
	<img class="sheets-icon" src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x32.png"><span>&nbsp;Loading current tournament</span>
{/if}

<!-- {#if leaderboard}
	<Leaderboard leaderboard={leaderboard}></Leaderboard>	
{/if} -->


<div class="teams">
	{#if teams}
		{#each teams as team, i}
			<table class="team" width="100%" border="0">
				<tr>
					<td class="favorite-cell" width="40">
						<span class="favorite-button" on:click={setFavorite(team.gsx$team.$t)}>
						{#if favoriteTeam === team.gsx$team.$t}
							<span style="font-size: 10px;">❤️</span>
						{:else}
							<span style="font-size: 13px;color: #969494;">♡</span>
						{/if}
						</span>	
					</td>
					<td>
						<Team team={team} placeNumber={i+1} isFavorite={favoriteTeam === team.gsx$team.$t}></Team>	
					</td>
				</tr>
			</table>
	  	{/each}
	{:else}
		<img class="sheets-icon" src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x32.png"><span>&nbsp;Loading teams and standings</span>
	{/if}
</div>


<style>
	.tourney-name {
	  font-size: 18px;
	  text-align: center;
	  text-transform: uppercase;
	  margin-bottom: 5px;
	  font-weight: normal;
	}
	.panel-group {
	    margin-bottom: 20px;
		border-radius: 4px;
	}
	.team {
    	margin: 5px 0px;
    	border-radius: 4px;
    	border: 1px solid #ddd;
    	background-color: white;
  	}
  	.favorite-cell {
  		vertical-align: top;
  		padding-top: 22px;
  	}
</style>
