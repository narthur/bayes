<script lang="ts">
  import { onMount } from 'svelte';
  import type { Hypothesis, Observation } from '$lib/types';
  import { calculatePosteriorProbability } from '$lib/bayes';
  import { saveHypotheses, loadHypotheses } from '$lib/storage';

  let hypotheses: Hypothesis[] = [];
  let newHypothesis = {
    name: '',
    description: '',
    priorProbability: 0.5
  };
  let selectedHypothesis: Hypothesis | null = null;
  let newObservation = {
    description: '',
    probabilityGivenTrue: 0.5,
    probabilityGivenFalse: 0.5
  };

  onMount(() => {
    hypotheses = loadHypotheses();
  });

  function addHypothesis() {
    if (!newHypothesis.name) return;

    const hypothesis: Hypothesis = {
      id: crypto.randomUUID(),
      name: newHypothesis.name,
      description: newHypothesis.description,
      priorProbability: newHypothesis.priorProbability,
      observations: []
    };

    hypotheses = [...hypotheses, hypothesis];
    saveHypotheses(hypotheses);
    newHypothesis = { name: '', description: '', priorProbability: 0.5 };
  }

  function addObservation() {
    if (!selectedHypothesis || !newObservation.description) return;

    const observation: Observation = {
      id: crypto.randomUUID(),
      description: newObservation.description,
      probabilityGivenTrue: newObservation.probabilityGivenTrue,
      probabilityGivenFalse: newObservation.probabilityGivenFalse,
      timestamp: Date.now()
    };

    selectedHypothesis.observations = [...selectedHypothesis.observations, observation];
    hypotheses = hypotheses.map(h => 
      h.id === selectedHypothesis.id ? selectedHypothesis : h
    );
    saveHypotheses(hypotheses);
    newObservation = { description: '', probabilityGivenTrue: 0.5, probabilityGivenFalse: 0.5 };
  }
</script>

<main class="min-h-screen bg-slate-50 py-8 px-4">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-serif text-slate-800 mb-4 text-center">Bayesian Inference Tool</h1>
    <p class="text-slate-600 text-center mb-12 font-light">A systematic approach to updating beliefs based on evidence</p>

    <!-- Add new hypothesis -->
    <div class="mb-12 p-8 bg-white rounded-lg shadow-sm border border-slate-200">
      <h2 class="text-2xl font-serif text-slate-700 mb-6">Create New Hypothesis</h2>
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Hypothesis Name</label>
          <input
            type="text"
            bind:value={newHypothesis.name}
            placeholder="Enter your hypothesis"
            class="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
          <textarea
            bind:value={newHypothesis.description}
            placeholder="Describe your hypothesis in detail"
            class="w-full p-3 border border-slate-300 rounded-md shadow-sm h-32 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Prior Probability: {(newHypothesis.priorProbability * 100).toFixed(1)}%
          </label>
          <input
            type="range"
            bind:value={newHypothesis.priorProbability}
            min="0"
            max="1"
            step="0.01"
            class="w-full"
          />
          <div class="flex justify-between text-xs text-slate-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        <button
          on:click={addHypothesis}
          class="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
        >
          Create Hypothesis
        </button>
      </div>
    </div>

    <!-- List of hypotheses -->
    <div class="mb-12">
      <h2 class="text-2xl font-serif text-slate-700 mb-6">Current Hypotheses</h2>
      <div class="space-y-4">
        {#each hypotheses as hypothesis}
          <div
            class="p-6 bg-white rounded-lg border border-slate-200 shadow-sm cursor-pointer transition-all hover:shadow-md"
            class:ring-2={selectedHypothesis?.id === hypothesis.id}
            class:ring-indigo-500={selectedHypothesis?.id === hypothesis.id}
            on:click={() => selectedHypothesis = hypothesis}
          >
            <h3 class="text-xl font-medium text-slate-800">{hypothesis.name}</h3>
            <p class="text-slate-600 mt-2 text-sm">{hypothesis.description}</p>
            <div class="mt-4 flex items-center justify-between">
              <span class="text-sm text-slate-500">
                {hypothesis.observations.length} observation{hypothesis.observations.length === 1 ? '' : 's'}
              </span>
              <span class="text-lg font-medium text-indigo-600">
                {(calculatePosteriorProbability(hypothesis) * 100).toFixed(1)}% probable
              </span>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Add observation to selected hypothesis -->
    {#if selectedHypothesis}
      <div class="p-8 bg-white rounded-lg shadow-sm border border-slate-200">
        <h2 class="text-2xl font-serif text-slate-700 mb-6">
          New Observation for "{selectedHypothesis.name}"
        </h2>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Observation Description</label>
            <input
              type="text"
              bind:value={newObservation.description}
              placeholder="Describe what you observed"
              class="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              P(E|H) - Likelihood if hypothesis is true: {(newObservation.probabilityGivenTrue * 100).toFixed(1)}%
            </label>
            <input
              type="range"
              bind:value={newObservation.probabilityGivenTrue}
              min="0"
              max="1"
              step="0.01"
              class="w-full"
            />
            <div class="flex justify-between text-xs text-slate-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              P(E|¬H) - Likelihood if hypothesis is false: {(newObservation.probabilityGivenFalse * 100).toFixed(1)}%
            </label>
            <input
              type="range"
              bind:value={newObservation.probabilityGivenFalse}
              min="0"
              max="1"
              step="0.01"
              class="w-full"
            />
            <div class="flex justify-between text-xs text-slate-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          <button
            on:click={addObservation}
            class="w-full py-3 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium"
          >
            Add Observation
          </button>
        </div>

        <!-- List of observations -->
        {#if selectedHypothesis.observations.length > 0}
          <div class="mt-8 pt-8 border-t border-slate-200">
            <h3 class="text-lg font-medium text-slate-700 mb-4">Previous Observations</h3>
            <div class="space-y-3">
              {#each selectedHypothesis.observations as observation}
                <div class="p-4 bg-slate-50 rounded-md border border-slate-200">
                  <p class="text-slate-800">{observation.description}</p>
                  <div class="mt-2 flex gap-4 text-sm text-slate-600">
                    <span>P(E|H): {(observation.probabilityGivenTrue * 100).toFixed(1)}%</span>
                    <span>P(E|¬H): {(observation.probabilityGivenFalse * 100).toFixed(1)}%</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</main>

<style>
  /* Custom slider styling */
  input[type="range"] {
    @apply w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer;
  }

  input[type="range"]::-webkit-slider-thumb {
    @apply w-4 h-4 bg-indigo-600 rounded-full border-2 border-white appearance-none cursor-pointer shadow-md hover:bg-indigo-700 transition-colors;
    margin-top: -6px;
  }

  input[type="range"]::-moz-range-thumb {
    @apply w-4 h-4 bg-indigo-600 rounded-full border-2 border-white appearance-none cursor-pointer shadow-md hover:bg-indigo-700 transition-colors;
  }

  /* Add custom font */
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&display=swap');

  :global(.font-serif) {
    font-family: 'Crimson Pro', serif;
  }
</style>
