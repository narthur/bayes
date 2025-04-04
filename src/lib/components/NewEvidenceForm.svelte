<script lang="ts">
	import type { BeeminderConfig } from '$lib/types';
	import { BeeminderService } from '$lib/beeminder';
	import AutoResizeTextarea from './AutoResizeTextarea.svelte';
	import type { Hypothesis, Observation } from '$lib/types';
	import { saveHypotheses, loadHypotheses } from '$lib/storage';

	export let hypothesis: Hypothesis;
	export let beeminderConfig: BeeminderConfig;
	export let onEvidenceAdded: () => void;

	let newObservation = {
		description: '',
		notes: '',
		probabilityGivenTrue: 0.5,
		probabilityGivenFalse: 0.5
	};
	let showLikelihoodHelp = false;

	async function addObservation() {
		if (!newObservation.description) return;

		const observation: Observation = {
			id: crypto.randomUUID(),
			description: newObservation.description,
			notes: newObservation.notes,
			probabilityGivenTrue: newObservation.probabilityGivenTrue,
			probabilityGivenFalse: newObservation.probabilityGivenFalse,
			timestamp: Date.now()
		};

		hypothesis.observations = [...hypothesis.observations, observation];

		// Update in storage
		const hypotheses = loadHypotheses();
		const updatedHypotheses = hypotheses.map((h) => (h.id === hypothesis.id ? hypothesis : h));
		saveHypotheses(updatedHypotheses);

		newObservation = {
			description: '',
			notes: '',
			probabilityGivenTrue: 0.5,
			probabilityGivenFalse: 0.5
		};

		// Send datapoints to Beeminder if configured
		if (beeminderConfig?.username && beeminderConfig?.authToken) {
			try {
				const service = new BeeminderService(beeminderConfig);

				// Send to global observations goal if configured
				if (beeminderConfig.observationGoal) {
					await service.createDatapoint(beeminderConfig.observationGoal, {
						value: 1,
						comment: `Added observation to "${hypothesis.name}": ${observation.description}`,
						requestid: observation.id
					});
				}

				// Send to hypothesis-specific goal if configured
				if (hypothesis.beeminderGoal) {
					await service.createDatapoint(hypothesis.beeminderGoal, {
						value: 1,
						comment: `Added observation: ${observation.description}`,
						requestid: observation.id
					});
				}
			} catch (error) {
				console.error('Failed to send datapoint to Beeminder:', error);
			}
			onEvidenceAdded();
		}
	}

	function formatProbability(prob: number): string {
		return (prob * 100).toFixed(1) + '%';
	}
</script>

<div class="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8">
	<h2 class="text-2xl font-serif text-slate-700 mb-2">Add New Evidence</h2>
	<p class="text-sm text-slate-500 mb-6">
		Record new evidence and estimate how likely it would be under different scenarios
	</p>

	<div class="space-y-6">
		<div>
			<label class="block text-sm font-medium text-slate-700 mb-2" for="observation-description"
				>What did you observe?</label
			>
			<input
				id="observation-description"
				type="text"
				bind:value={newObservation.description}
				placeholder="What did you observe?"
				class="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-slate-700 mb-2" for="observation-notes"
				>Notes (supports markdown)</label
			>
			<AutoResizeTextarea
				bind:value={newObservation.notes}
				className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
				placeholder="Add any additional notes, context, or analysis..."
			/>
		</div>

		<div class="relative">
			<div class="flex justify-between items-center mb-2">
				<label class="text-sm font-medium text-slate-700" for="likelihood-ratios"
					>Likelihood Ratios</label
				>
				<button
					class="text-indigo-600 text-sm hover:text-indigo-700"
					on:click={() => (showLikelihoodHelp = !showLikelihoodHelp)}
				>
					{showLikelihoodHelp ? 'Hide Help' : 'What are these?'}
				</button>
			</div>
			{#if showLikelihoodHelp}
				<div class="mb-4 p-4 bg-indigo-50 rounded-md text-sm text-slate-700">
					<p class="mb-2">These probabilities help us understand how strong the evidence is:</p>
					<p class="mb-2">
						<strong>P(E|H)</strong>: How likely would you be to see this evidence if your hypothesis
						is true?
					</p>
					<p class="mb-2">
						<strong>P(E|¬H)</strong>: How likely would you be to see this evidence if your
						hypothesis is false?
					</p>
					<p>
						The more these probabilities differ, the stronger the evidence is for or against your
						hypothesis.
					</p>
				</div>
			{/if}

			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-slate-700 mb-2" for="prob-given-true">
						If hypothesis is true, how likely is this evidence?
						<span class="text-indigo-600"
							>{formatProbability(newObservation.probabilityGivenTrue)}</span
						>
					</label>
					<input
						id="prob-given-true"
						type="range"
						bind:value={newObservation.probabilityGivenTrue}
						min="0"
						max="1"
						step="0.01"
						class="w-full"
					/>
					{#if newObservation.probabilityGivenTrue === 0 || newObservation.probabilityGivenTrue === 1}
						<div
							class="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800"
						>
							<strong>Warning about extreme likelihood:</strong>
							{#if newObservation.probabilityGivenTrue === 0}
								Setting this to 0% means this evidence would be impossible if your hypothesis is
								true. Finding this evidence would completely disprove your hypothesis.
							{:else}
								Setting this to 100% means this evidence would be guaranteed if your hypothesis is
								true. Not finding this evidence would completely disprove your hypothesis.
							{/if}
							Consider using a small value like 1% or 99% instead to account for uncertainty.
						</div>
					{/if}
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-700 mb-2" for="prob-given-false">
						If hypothesis is false, how likely is this evidence?
						<span class="text-indigo-600"
							>{formatProbability(newObservation.probabilityGivenFalse)}</span
						>
					</label>
					<input
						id="prob-given-false"
						type="range"
						bind:value={newObservation.probabilityGivenFalse}
						min="0"
						max="1"
						step="0.01"
						class="w-full"
					/>
					{#if newObservation.probabilityGivenFalse === 0 || newObservation.probabilityGivenFalse === 1}
						<div
							class="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800"
						>
							<strong>Warning about extreme likelihood:</strong>
							{#if newObservation.probabilityGivenFalse === 0}
								Setting this to 0% means this evidence would be impossible if your hypothesis is
								false. Finding this evidence would completely prove your hypothesis.
							{:else}
								Setting this to 100% means this evidence would be guaranteed if your hypothesis is
								false. Not finding this evidence would completely prove your hypothesis.
							{/if}
							Consider using a small value like 1% or 99% instead to account for uncertainty.
						</div>
					{/if}
				</div>
			</div>
		</div>

		<button
			on:click={addObservation}
			disabled={!newObservation.description}
			class="w-full py-3 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
		>
			Add Evidence
		</button>
	</div>
</div>

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
