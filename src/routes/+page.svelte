<script lang="ts">
	import { onMount } from 'svelte';
	import type { Hypothesis } from '$lib/types';
	import { calculatePosteriorProbability } from '$lib/bayes';
	import {
		saveHypotheses,
		loadHypotheses,
		deleteHypothesis,
		duplicateHypothesis
	} from '$lib/storage';
	import NewHypothesisForm from '$lib/components/NewHypothesisForm.svelte';
	import type { BeeminderConfig } from '$lib/types';

	let hypotheses: Hypothesis[] = [];
	let beeminderConfig: BeeminderConfig;
	let searchQuery = '';

	$: filteredHypotheses = hypotheses.filter((h) => {
		if (!searchQuery.trim()) return true;

		const query = searchQuery.toLowerCase();
		const matchName = h.name.toLowerCase().includes(query);
		const matchDescription = h.description.toLowerCase().includes(query);
		const matchObservations = h.observations.some(
			(o) =>
				o.description.toLowerCase().includes(query) ||
				(o.notes && o.notes.toLowerCase().includes(query))
		);

		return matchName || matchDescription || matchObservations;
	});

	onMount(() => {
		hypotheses = loadHypotheses();
		const stored = localStorage.getItem('beeminder-config');
		if (stored) {
			beeminderConfig = JSON.parse(stored);
		}
	});

	function formatProbability(prob: number): string {
		return (prob * 100).toFixed(1) + '%';
	}
</script>

<main class="min-h-screen bg-slate-50 py-8 px-4">
	<div class="max-w-4xl mx-auto">
		<div class="text-center mb-12">
			<h1 class="text-4xl font-serif text-slate-800 mb-4">Bayesian Inference Tool</h1>
			<p class="text-slate-600 mb-4 font-light">
				A systematic approach to updating beliefs based on evidence
			</p>
			<p class="text-sm text-slate-500 mb-6 max-w-2xl mx-auto">
				Track your hypotheses and update their probabilities as you gather evidence. Start by
				creating a hypothesis below or explore your existing ones.
			</p>
		</div>

		<NewHypothesisForm {hypotheses} {beeminderConfig} />

		<!-- List of hypotheses -->
		<div class="mb-12 p-8 bg-white rounded-lg shadow-sm border border-slate-200">
			<div>
				<h2 class="text-2xl font-serif text-slate-700 mb-4">Your Hypotheses</h2>
				<div class="relative max-w-xl mb-6">
					<input
						type="search"
						bind:value={searchQuery}
						placeholder="Search hypotheses..."
						class="w-full px-4 py-2 pl-10 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
					/>
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<svg
							class="w-5 h-5 text-slate-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
				</div>
			</div>
			{#if hypotheses.length === 0}
				<div class="text-center py-12 bg-white rounded-lg border border-slate-200">
					<p class="text-slate-600">No hypotheses yet. Create one above to get started!</p>
				</div>
			{:else if filteredHypotheses.length === 0}
				<div class="text-center py-12 bg-white rounded-lg border border-slate-200">
					<p class="text-slate-600">No hypotheses match your search.</p>
				</div>
			{:else}
				<div class="space-y-3">
					{#each filteredHypotheses as hypothesis}
						<div class="group relative">
							<a
								href="/hypothesis/{hypothesis.id}"
								class="block bg-white rounded-lg border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-indigo-200"
							>
								<div class="p-6">
									<div class="flex items-start justify-between gap-6">
										<div class="flex-1 min-w-0">
											<div class="flex items-center gap-3 mb-1">
												<h3
													class="text-xl font-medium text-slate-800 group-hover:text-indigo-600 transition-colors truncate"
												>
													{hypothesis.name}
												</h3>
												<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
													<button
														class="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-slate-50"
														aria-label="Duplicate hypothesis"
														on:click|stopPropagation={(e) => {
															e.preventDefault();
															duplicateHypothesis(hypothesis.id);
															hypotheses = loadHypotheses(); // Always reload to ensure UI updates
														}}
														title="Duplicate hypothesis"
													>
														<svg
															class="w-4 h-4"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
															/>
														</svg>
													</button>
													<button
														class="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-md hover:bg-slate-50"
														aria-label="Delete hypothesis"
														on:click|stopPropagation={(e) => {
															e.preventDefault();
															if (
																confirm(
																	'Are you sure you want to delete this hypothesis? This action cannot be undone.'
																)
															) {
																deleteHypothesis(hypothesis.id);
																hypotheses = hypotheses.filter((h) => h.id !== hypothesis.id);
															}
														}}
														title="Delete hypothesis"
													>
														<svg
															class="w-4 h-4"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
															/>
														</svg>
													</button>
												</div>
											</div>
											<p class="text-slate-600 text-sm whitespace-pre-line">
												{hypothesis.description}
											</p>
										</div>
										<div class="flex items-center gap-8 shrink-0">
											<div class="text-center">
												<div class="text-sm font-medium text-slate-500">Prior</div>
												<div class="text-lg font-medium text-slate-700">
													{formatProbability(hypothesis.priorProbability)}
												</div>
											</div>
											<div class="text-center">
												<div class="text-sm font-medium text-slate-500">Current</div>
												<div class="text-lg font-medium text-indigo-600">
													{formatProbability(calculatePosteriorProbability(hypothesis))}
												</div>
											</div>
										</div>
									</div>
									<div class="mt-4 flex items-center gap-6 text-sm">
										<div class="flex items-center gap-2 text-slate-500">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
											<span
												>{new Date(
													hypothesis.observations[hypothesis.observations.length - 1]?.timestamp ||
														Date.now()
												).toLocaleDateString()}</span
											>
										</div>
										<div class="flex items-center gap-2 text-slate-500">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
												/>
											</svg>
											<span
												>{hypothesis.observations.length} observation{hypothesis.observations
													.length === 1
													? ''
													: 's'}</span
											>
										</div>
										<div class="flex items-center gap-2 text-slate-500">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
												/>
											</svg>
											<span>
												{hypothesis.observations.length > 0
													? (
															(calculatePosteriorProbability(hypothesis) -
																hypothesis.priorProbability) *
															100
														).toFixed(1) + '% change'
													: 'No change'}
											</span>
										</div>
									</div>
								</div>
								<div
									class="px-6 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500 rounded-b-lg"
								>
									Click to view details and add observations
								</div>
							</a>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</main>


