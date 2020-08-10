<script>
 	import Picker from "./Picker.svelte"
	import Weekly from "./Weekly.svelte"
	import WeeklyMajor from "./WeeklyMajor.svelte"
	import Overall from "./Overall.svelte"
	import { onMount } from "svelte"
  	let pages = ["Weekly","Overall"]
	
	let currentPage = "Weekly"
</script>

<div id="main">
	<Picker bind:activePage={currentPage} pages={pages} />
	<br><br>
	{#if currentPage === "Weekly"}
		
		<!-- <WeeklyMajor></WeeklyMajor> -->
		<Weekly></Weekly>
	{:else if currentPage === "Overall"}
		<Overall></Overall>
	{/if}	
</div>	

<style>
	#main {
		max-width: 800px;
		margin: 0 auto;
	}
</style>