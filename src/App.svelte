<script>
 	import Picker from "./Picker.svelte"
	import Weekly from "./Weekly.svelte"
	import WeeklyEspn from "./WeeklyEspn.svelte"
	import WeeklyMajor from "./Major/WeeklyMajor.svelte"
	import WeeklyTourChampionship from "./TourChampionship/WeeklyTourChampionship.svelte"
	import Overall from "./Overall.svelte"
	import ConfidencePool from "./ConfidencePool/ConfidencePool.svelte"
	import ConfidencePoolEntryForm from "./ConfidencePool/ConfidencePoolEntryForm.svelte"
	import { onMount } from "svelte"
  	let pages = ["Weekly","Overall"]
	
	let currentPage = "Weekly"

	let dvLeague = window.location.href.includes("?league=dv")
	let confidencePool = window.location.href.includes("?confidence")
	let confidencePoolEntry = window.location.href.includes("?enterconfidence")

</script>

{#if confidencePool}
	<div id="main"><ConfidencePool /></div>
{:else if confidencePoolEntry}
	<div id="main"><ConfidencePoolEntryForm /></div>
{:else}
	<div id="main" class={dvLeague ? "dv" : ""}>
		{#if dvLeague}
			<h3>DV'S GOLF LEAGUE</h3>
		{/if}
		<Picker bind:activePage={currentPage} pages={pages} />
		<br><br>
		
		{#if currentPage === "Weekly"}
			<!-- <Weekly /> -->
			<WeeklyEspn />
			<!-- <WeeklyMajor dvLeague={is_dv} /> -->
		{:else if currentPage === "Overall"}
			<Overall />
		{/if}	
	</div>	
{/if}

<style>
	#main {
		max-width: 800px;
		margin: 0 auto;
	}	
	.dv {
		background-color: rgb(0 128 0 / 17%);
		font-family: "Comic Sans MS", "Comic Sans","Marker Felt";
	}
	h3 {
		padding: 4px;
		font-size: 25px;
		font-family: "Comic Sans MS", "Comic Sans","Marker Felt";
	}
</style>