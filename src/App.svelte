<script>
 	import Picker from "./Picker.svelte"
	import Weekly from "./Weekly.svelte"
	import WeeklyMajor from "./Major/WeeklyMajor.svelte"
	import WeeklyTourChampionship from "./TourChampionship/WeeklyTourChampionship.svelte"
	import Overall from "./Overall.svelte"
	import { onMount } from "svelte"
  	let pages = ["Weekly","Overall"]
	
	let currentPage = "Weekly"

	let dvLeague = window.location.href.includes("?league=dv")

</script>

<div id="main" class={dvLeague ? "dv" : ""}>
	{#if dvLeague}
		<h3>DV'S GOLF LEAGUE</h3>
	{/if}
	<Picker bind:activePage={currentPage} pages={pages} />
	<br><br>
	
	{#if currentPage === "Weekly"}
		<Weekly dvLeague={dvLeague} />
		<!-- <WeeklyMajor dvLeague={is_dv} /> -->
	{:else if currentPage === "Overall"}
		<Overall dvLeague={dvLeague} />
	{/if}	
</div>	

<style>
	#main {
		max-width: 800px;
		margin: 0 auto;
	}	
	.dv {
		background-color: rgb(0 128 0 / 17%);
		font-family: "Comic Sans MS", "Comic Sans", cursive;
	}
	h3 {
		padding: 4px;
		font-size: 25px;
		font-family: "Comic Sans MS", "Comic Sans", cursive;
	}
</style>