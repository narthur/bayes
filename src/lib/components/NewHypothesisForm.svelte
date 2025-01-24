<script lang="ts">
	import { BeeminderService } from '$lib/beeminder';
	import type { BeeminderConfig } from '$lib/types';
	import { saveHypotheses } from '$lib/storage';

	export let hypotheses: Hypothesis[];
	export let beeminderConfig: BeeminderConfig;

	let newHypothesis = {
		name: '',
		description: '',
		priorProbability: 0.5
	};
	let showPriorHelp = false;

	async function addHypothesis() {
		if (!newHypothesis.name) return;

		const hypothesis: Hypothesis = {
			id: crypto.randomUUID(),
			name: newHypothesis.name,
			description: newHypothesis.description,
			priorProbability: newHypothesis.priorProbability,
			observations: [],
			tags: [],
			createdAt: Date.now(),
			updatedAt: Date.now()
		};

		hypotheses = [...hypotheses, hypothesis];
		saveHypotheses(hypotheses);
		newHypothesis = { name: '', description: '', priorProbability: 0.5 };

		// Send datapoint to Beeminder if configured
		if (beeminderConfig?.hypothesisGoal) {
			try {
				const service = new BeeminderService(beeminderConfig);
				await service.createDatapoint(beeminderConfig.hypothesisGoal, {
					value: 1,
					comment: `Created hypothesis: ${hypothesis.name}`,
					requestid: hypothesis.id
				});
			} catch (error) {
				console.error('Failed to send datapoint to Beeminder:', error);
			}
		}
	}

	function formatProbability(prob: number): string {
		return (prob * 100).toFixed(1) + '%';
	}
</script>

<div class="mb-12 p-8 bg-white rounded-lg shadow-sm border border-slate-200">
	<h2 class="text-2xl font-serif text-slate-700 mb-2">Create New Hypothesis</h2>
	<p class="text-sm text-slate-500 mb-6">
		Begin by stating your hypothesis and estimating its initial probability
	</p>

	<div class="space-y-6">
		<div>
			<label class="block text-sm font-medium text-slate-700 mb-2" for="hypothesis-name"
				>What is your hypothesis?</label
			>
			<input
				id="hypothesis-name"
				type="text"
				bind:value={newHypothesis.name}
				placeholder="e.g., 'Learning a new language will improve my memory'"
				class="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
			/>
		</div>
		<div>
			<label class="block text-sm font-medium text-slate-700 mb-2" for="hypothesis-description"
				>Detailed Description</label
			>
			<textarea
				id="hypothesis-description"
				bind:value={newHypothesis.description}
				placeholder="Describe your hypothesis in detail, including any relevant context or assumptions"
				class="w-full p-3 border border-slate-300 rounded-md shadow-sm h-32 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
			></textarea>
		</div>
		<div class="relative">
			<div class="flex justify-between items-center mb-2">
				<label class="text-sm font-medium text-slate-700" for="prior-probability"
					>Prior Probability</label
				>
				<button
					class="text-indigo-600 text-sm hover:text-indigo-700"
					on:click={() => (showPriorHelp = !showPriorHelp)}
				>
					{showPriorHelp ? 'Hide Help' : 'What is this?'}
				</button>
			</div>
			{#if showPriorHelp}
				<div class="mb-4 p-4 bg-indigo-50 rounded-md text-sm text-slate-700">
					<p class="mb-2">
						<strong>Prior Probability</strong> is your initial belief in the hypothesis before considering
						any evidence.
					</p>
					<ul class="list-disc pl-4 space-y-1">
						<li>50% = Complete uncertainty</li>
						<li>75% = Moderately confident it's true</li>
						<li>90% = Strongly believe it's true</li>
						<li>25% = Moderately confident it's false</li>
						<li>10% = Strongly believe it's false</li>
					</ul>
				</div>
			{/if}
			<input
				id="prior-probability"
				type="range"
				bind:value={newHypothesis.priorProbability}
				min="0"
				max="1"
				step="0.01"
				class="w-full"
			/>
			<div class="space-y-2">
				<div class="flex justify-between items-center">
					<span class="text-sm text-slate-500">0%</span>
					<span class="text-sm font-medium text-indigo-600"
						>{formatProbability(newHypothesis.priorProbability)}</span
					>
					<span class="text-sm text-slate-500">100%</span>
				</div>
				{#if newHypothesis.priorProbability === 0 || newHypothesis.priorProbability === 1}
					<div class="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
						<strong>Warning about extreme probability:</strong>
						{#if newHypothesis.priorProbability === 0}
							Setting a 0% prior probability means you believe this hypothesis is impossible. No
							amount of evidence will be able to increase this probability.
						{:else}
							Setting a 100% prior probability means you believe this hypothesis is absolutely
							certain. No amount of evidence will be able to decrease this probability.
						{/if}
						Consider using a small value like 1% or 99% instead to remain open to evidence.
					</div>
				{/if}
			</div>
		</div>
		<button
			on:click={addHypothesis}
			disabled={!newHypothesis.name}
			class="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
		>
			Create Hypothesis
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
