<script lang="ts">
	import { goto } from '$app/navigation';
	import AutoResizeTextarea from '$lib/components/AutoResizeTextarea.svelte';

	import type { Hypothesis, Observation } from '$lib/types';
	import { calculatePosteriorProbability } from '$lib/bayes';
	import { saveHypotheses, loadHypotheses } from '$lib/storage';
	import { marked } from 'marked';
	import { BeeminderService } from '$lib/beeminder';
	import type { BeeminderConfig } from '$lib/types';

	export let data: { hypothesis: Hypothesis };
	let beeminderConfig: BeeminderConfig = {
		username: '',
		authToken: '',
		hypothesisGoal: '',
		observationGoal: ''
	};

	let hypothesis = data.hypothesis;

	import NewEvidenceForm from '$lib/components/NewEvidenceForm.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let showNewEvidenceModal = false;

	function deleteObservation(observationId: string) {
		hypothesis.observations = hypothesis.observations.filter((o) => o.id !== observationId);

		// Update in storage
		const hypotheses = loadHypotheses();
		const updatedHypotheses = hypotheses.map((h) => (h.id === hypothesis.id ? hypothesis : h));
		saveHypotheses(updatedHypotheses);
	}

	function editObservation(observation: Observation) {
		const index = hypothesis.observations.findIndex((o) => o.id === observation.id);
		if (index === -1) return;

		hypothesis.observations[index] = {
			...observation,
			notes: observation.notes, // Preserve notes when editing
			timestamp: Date.now() // Update timestamp when edited
		};
		hypothesis.observations = [...hypothesis.observations]; // Trigger reactivity

		// Update in storage
		const hypotheses = loadHypotheses();
		const updatedHypotheses = hypotheses.map((h) => (h.id === hypothesis.id ? hypothesis : h));
		saveHypotheses(updatedHypotheses);
	}

	let editingObservation: Observation | null = null;
	let editingDescription = false;

	function formatProbability(prob: number): string {
		return (prob * 100).toFixed(1) + '%';
	}

	function saveChanges() {
		const hypotheses = loadHypotheses();
		const updatedHypotheses = hypotheses.map((h) => (h.id === hypothesis.id ? hypothesis : h));
		saveHypotheses(updatedHypotheses);
	}
</script>

<main class="bg-slate-50 dark:bg-slate-900 py-8 px-4">
	<div class="max-w-4xl mx-auto">
		<div class="mb-8 flex items-center justify-between">
			<button
				on:click={() => goto('/')}
				class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-2"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to Hypotheses
			</button>
			<div class="text-right">
				<div class="text-3xl font-medium text-indigo-600">
					{formatProbability(calculatePosteriorProbability(hypothesis))}
				</div>
				<div class="text-sm text-slate-500">current probability</div>
			</div>
		</div>

		<div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-8">
			<div class="flex items-start justify-between mb-6">
				<div class="flex-1 space-y-4">
					<div class="relative group">
						<input
							type="text"
							bind:value={hypothesis.name}
							on:change={saveChanges}
							class="text-3xl font-serif text-slate-800 dark:text-slate-100 w-full bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700 px-2 py-1 rounded -mx-2 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500 focus:outline-none"
						/>
						<div
							class="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:block text-xs text-slate-400"
						>
							Click to edit
						</div>
					</div>
					<div class="relative group">
						{#if editingDescription}
							<AutoResizeTextarea
								bind:value={hypothesis.description}
								on:change={() => {
									saveChanges();
									editingDescription = false;
								}}
								on:blur={() => (editingDescription = false)}
								className="text-slate-600 dark:text-slate-300 w-full bg-white dark:bg-slate-700 px-2 py-1 -mx-2 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500 focus:outline-none"
								autofocus
							/>
						{:else}
							<button
								class="text-slate-600 dark:text-slate-300 w-full px-2 py-1 -mx-2 min-h-[28px] text-left"
								on:click={() => (editingDescription = true)}
								type="button"
							>
								{#if hypothesis.description}
									<div class="whitespace-pre-line">{hypothesis.description}</div>
								{:else}
									<span class="text-slate-400">Add a description...</span>
								{/if}
							</button>
						{/if}
						{#if !editingDescription}
							<div class="absolute right-0 top-0 hidden group-hover:block text-xs text-slate-400">
								Click to edit
							</div>
						{/if}
					</div>
				</div>
			</div>
			<div class="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
				<span>Started at {formatProbability(hypothesis.priorProbability)}</span>
				<span>•</span>
				<span
					>{hypothesis.observations.length} observation{hypothesis.observations.length === 1
						? ''
						: 's'}</span
				>
			</div>
		</div>

		<Modal
			open={showNewEvidenceModal}
			title="Add New Evidence"
			onClose={() => (showNewEvidenceModal = false)}
		>
			<NewEvidenceForm
				{hypothesis}
				{beeminderConfig}
				on:evidenceAdded={() => (showNewEvidenceModal = false)}
			/>
		</Modal>

		<!-- List of observations -->
		{#if hypothesis.observations.length > 0}
			<div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-2xl font-serif text-slate-700 dark:text-slate-100">Evidence Timeline</h2>
					<button
						on:click={() => (showNewEvidenceModal = true)}
						class="px-4 py-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors font-medium flex items-center gap-2 border border-emerald-200 dark:border-emerald-700"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Add New Evidence
					</button>
				</div>
				<div class="space-y-4">
					{#each hypothesis.observations.sort((a, b) => b.timestamp - a.timestamp) as observation}<div
							class="group p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm hover:shadow-md"
						>
							{#if editingObservation?.id === observation.id}
								<div
									class="bg-slate-50/70 dark:bg-slate-800/70 rounded-lg border border-slate-200 dark:border-slate-700 border-dashed p-4 space-y-3"
								>
									<div>
										<input
											type="text"
											bind:value={editingObservation.description}
											class="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-md"
											placeholder="What did you observe?"
										/>
									</div>
									<div class="space-y-1">
										<label
											class="block text-sm font-medium text-slate-700 dark:text-slate-300"
											for="edit-observation-notes">Notes</label
										>
										<AutoResizeTextarea
											bind:value={editingObservation.notes}
											className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-md"
											placeholder="Add notes (supports markdown)..."
										/>
									</div>
									<div>
										<label
											class="block text-sm font-medium text-slate-700 mb-1"
											for="edit-prob-given-true"
										>
											If hypothesis is true: {formatProbability(
												editingObservation.probabilityGivenTrue
											)}
										</label>
										<input
											id="edit-prob-given-true"
											type="range"
											bind:value={editingObservation.probabilityGivenTrue}
											min="0"
											max="1"
											step="0.01"
											class="w-full"
										/>
									</div>
									<div>
										<label
											class="block text-sm font-medium text-slate-700 mb-1"
											for="edit-prob-given-false"
										>
											If hypothesis is false: {formatProbability(
												editingObservation.probabilityGivenFalse
											)}
										</label>
										<input
											id="edit-prob-given-false"
											type="range"
											bind:value={editingObservation.probabilityGivenFalse}
											min="0"
											max="1"
											step="0.01"
											class="w-full"
										/>
									</div>
									<div class="flex items-center justify-between gap-4 pt-2">
										<div class="text-xs text-slate-500">Supports markdown formatting</div>
										<div class="flex gap-2">
											<button
												on:click={() => (editingObservation = null)}
												class="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
											>
												Cancel
											</button>
											<button
												on:click={() => {
													if (editingObservation) {
														editObservation(editingObservation);
													}
													editingObservation = null;
												}}
												class="px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm"
											>
												Save
											</button>
										</div>
									</div>
								</div>
							{:else}
								<div class="flex justify-between gap-4">
									<div class="flex-1 space-y-4">
										<div class="flex items-start justify-between gap-4">
											<p class="text-slate-800 dark:text-slate-100 font-medium leading-snug">
												{observation.description}
											</p>
											<div
												class="flex gap-2 shrink-0 pt-0.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-all"
											>
												<button
													on:click={() =>
														(editingObservation = {
															...observation,
															notes: observation.notes || ''
														})}
													class="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
													title="Edit observation"
													aria-label="Edit observation"
												>
													<svg
														class="w-5 h-5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
														/>
													</svg>
												</button>
												<button
													on:click={() => {
														if (confirm('Are you sure you want to delete this observation?')) {
															deleteObservation(observation.id);
														}
													}}
													class="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
													title="Delete observation"
													aria-label="Delete observation"
												>
													<svg
														class="w-5 h-5"
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
										<div class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
											<div class="flex items-center gap-2">
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
												<span>If true: {formatProbability(observation.probabilityGivenTrue)}</span>
											</div>
											<div class="flex items-center gap-2">
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
												<span>If false: {formatProbability(observation.probabilityGivenFalse)}</span
												>
											</div>
											<div class="flex items-center gap-2 text-slate-400">
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												<span>{new Date(observation.timestamp).toLocaleDateString()}</span>
											</div>
										</div>

										{#if observation.notes}
											<div
												class="prose prose-sm prose-slate dark:prose-invert max-w-none border-t border-slate-200 dark:border-slate-700 pt-4 mt-4"
											>
												<!-- eslint-disable-next-line svelte/no-at-html-tags -->
												{@html marked(observation.notes)}
											</div>
										{/if}
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	/* Custom slider styling */
	input[type='range'] {
		@apply w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer;
	}

	input[type='range']::-webkit-slider-thumb {
		@apply w-4 h-4 bg-indigo-600 rounded-full border-2 border-white appearance-none cursor-pointer shadow-md hover:bg-indigo-700 transition-colors;
		margin-top: -6px;
	}

	input[type='range']::-moz-range-thumb {
		@apply w-4 h-4 bg-indigo-600 rounded-full border-2 border-white appearance-none cursor-pointer shadow-md hover:bg-indigo-700 transition-colors;
	}
</style>
