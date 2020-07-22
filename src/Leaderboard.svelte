<script>
	export let leaderboard
</script>
<div align="center">
	<table align="center">
		<tr>
		{#each leaderboard as player, i}
			{#if i < 10}
				<td align="center">
					<img width="60" src="https://pga-tour-res.cloudinary.com/image/upload/c_fill,dpr_2.0,f_auto,g_face:center,h_45,q_auto,t_headshots_leaderboard_l,w_45/headshots_{player.player_id}.png">
					<div class="badge">{player.current_position}<br>{player.player_bio.last_name}</div>
				</td>
			{/if}
		{/each}
		</tr>
	</table>
</div>


<style>
	.badge {
		padding: .25em .4em;
		border-radius: .25rem;	
	    background-color: #000;
	    color: #fff;
	    display: inline-block;
	    padding-left: 8px;
	    padding-right: 8px;
	    text-align: center;
	    font-size: 12px;
	    font-family: "Roboto";
	}

	.player-photo {
    	margin: 0px 8px;
 	}
</style>