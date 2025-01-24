<script lang="ts">
	import '../app.css';
	import { searchQuery } from '$lib';
	import { loadHypotheses } from '$lib/storage';
	import { calculatePosteriorProbability } from '$lib/bayes';
	import type { Hypothesis } from '$lib/types';
	import { onMount } from 'svelte';

	let hypotheses: Hypothesis[] = [];

	onMount(() => {
		hypotheses = loadHypotheses();
	});

	$: filteredHypotheses = hypotheses.filter((h) => {
		if (!$searchQuery.trim()) return true;

		const query = $searchQuery.toLowerCase();
		const matchName = h.name.toLowerCase().includes(query);
		const matchDescription = h.description.toLowerCase().includes(query);
		const matchObservations = h.observations.some(
			(o) =>
				o.description.toLowerCase().includes(query) ||
				(o.notes && o.notes.toLowerCase().includes(query))
		);

		return matchName || matchDescription || matchObservations;
	});

	function formatProbability(prob: number): string {
		return (prob * 100).toFixed(1) + '%';
	}
</script>

<div class="min-h-screen flex flex-col">
	<nav class="bg-white border-b border-slate-200">
		<div class="max-w-4xl mx-auto px-4">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center justify-between flex-1">
					<a
						href="/"
						class="text-xl font-serif text-slate-800 hover:text-indigo-600 transition-colors"
					>
						Bayes
					</a>

					<div class="flex items-center gap-6">
						<a
							href="/"
							class="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							<span>Home</span>
						</a>
						<a
							href="/hypotheses"
							class="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
							<span>Hypotheses</span>
						</a>
						<a
							href="/settings"
							class="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							<span>Settings</span>
						</a>
					</div>

					<div class="relative">
						<input
							type="search"
							bind:value={$searchQuery}
							placeholder="Search hypotheses..."
							class="w-64 px-4 py-2 pl-10 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
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

						{#if $searchQuery.trim() && hypotheses}
							<div
								class="absolute right-0 mt-2 py-2 bg-white rounded-lg shadow-lg border border-slate-200 max-h-96 overflow-y-auto z-50 w-96"
							>
								{#if filteredHypotheses.length === 0}
									<div class="px-4 py-2 text-sm text-slate-500">
										No hypotheses match your search
									</div>
								{:else}
									{#each filteredHypotheses as hypothesis}
										<div>
											<a
												href="/hypothesis/{hypothesis.id}"
												class="block px-4 py-2 hover:bg-slate-50 transition-colors"
											>
												<div class="text-sm font-medium text-slate-800">
													{hypothesis.name}
												</div>
												{#if hypothesis.description}
													<div class="text-xs text-slate-500 truncate mt-0.5">
														{hypothesis.description}
													</div>
												{/if}
												<div class="flex items-center gap-3 mt-1 text-xs text-slate-400">
													<span>{hypothesis.observations.length} observations</span>
													<span>•</span>
													<span
														>Current: {formatProbability(
															calculatePosteriorProbability(hypothesis)
														)}</span
													>
												</div>
											</a>
											{#if hypothesis.observations.some((o) => o.description
														.toLowerCase()
														.includes($searchQuery.toLowerCase()) || (o.notes && o.notes
															.toLowerCase()
															.includes($searchQuery.toLowerCase())))}
												<div class="border-t border-slate-100 mx-4">
													{#each hypothesis.observations.filter((o) => o.description
																.toLowerCase()
																.includes($searchQuery.toLowerCase()) || (o.notes && o.notes
																	.toLowerCase()
																	.includes($searchQuery.toLowerCase()))) as observation}
														<a
															href="/hypothesis/{hypothesis.id}"
															class="block py-2 px-4 hover:bg-slate-50 transition-colors"
														>
															<div class="text-xs text-slate-400 mb-0.5">
																Observation • {new Date(observation.timestamp).toLocaleDateString()}
															</div>
															<div class="text-sm text-slate-600">
																{observation.description}
															</div>
															{#if observation.notes}
																<div class="text-xs text-slate-500 truncate mt-0.5">
																	{observation.notes}
																</div>
															{/if}
														</a>
													{/each}
												</div>
											{/if}
										</div>
									{/each}
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</nav>

	<div class="flex-1">
		<slot />
	</div>

	<footer class="bg-white border-t border-slate-200 py-8">
		<div class="max-w-4xl mx-auto px-4">
			<div class="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
				<a
					href="https://nathanarthur.com"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-indigo-600 transition-colors flex items-center gap-1 whitespace-nowrap"
				>
					<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					nathanarthur.com
				</a>
				<span class="text-slate-300">•</span>
				<a
					href="https://pinepeakdigital.com"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-indigo-600 transition-colors flex items-center gap-1 whitespace-nowrap"
				>
					<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
						/>
					</svg>
					pinepeakdigital.com
				</a>
				<span class="text-slate-300">•</span>
				<a
					href="https://taskratchet.com"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-indigo-600 transition-colors flex items-center gap-1 whitespace-nowrap"
				>
					<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
						/>
					</svg>
					TaskRatchet
				</a>
				<span class="text-slate-300">•</span>
				<a
					href="https://codebuff.com/referrals/ref-6d348d54-80f1-4155-903b-2cc6c57dd12f"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-indigo-600 transition-colors flex items-center gap-1 whitespace-nowrap"
				>
					<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
						/>
					</svg>
					Built with Codebuff
				</a>
				<span class="text-slate-300">•</span>
				<a
					href="https://ko-fi.com/narthur"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-indigo-600 transition-colors flex items-center gap-1 whitespace-nowrap"
				>
					<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
						/>
					</svg>
					Support on Ko-fi
				</a>
			</div>
		</div>
	</footer>
</div>

<style>
	/* Add custom font */
	@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&display=swap');

	:global(.font-serif) {
		font-family: 'Crimson Pro', serif;
	}
</style>
