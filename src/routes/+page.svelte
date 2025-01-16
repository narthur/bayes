<script lang="ts">
  import { onMount } from 'svelte';
  import type { Hypothesis } from '$lib/types';
  import { calculatePosteriorProbability } from '$lib/bayes';
  import { saveHypotheses, loadHypotheses } from '$lib/storage';

  let hypotheses: Hypothesis[] = [];
  let newHypothesis = {
    name: '',
    description: '',
    priorProbability: 0.5
  };
  let showPriorHelp = false;

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

  function formatProbability(prob: number): string {
    return (prob * 100).toFixed(1) + '%';
  }
</script>

<main class="min-h-screen bg-slate-50 py-8 px-4">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-serif text-slate-800 mb-4 text-center">Bayesian Inference Tool</h1>
    <p class="text-slate-600 text-center mb-4 font-light">A systematic approach to updating beliefs based on evidence</p>
    <p class="text-sm text-slate-500 text-center mb-12 max-w-2xl mx-auto">
      Track your hypotheses and update their probabilities as you gather evidence.
      Start by creating a hypothesis below or explore your existing ones.
    </p>

    <!-- Add new hypothesis -->
    <div class="mb-12 p-8 bg-white rounded-lg shadow-sm border border-slate-200">
      <h2 class="text-2xl font-serif text-slate-700 mb-2">Create New Hypothesis</h2>
      <p class="text-sm text-slate-500 mb-6">Begin by stating your hypothesis and estimating its initial probability</p>
      
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">What is your hypothesis?</label>
          <input
            type="text"
            bind:value={newHypothesis.name}
            placeholder="e.g., 'Learning a new language will improve my memory'"
            class="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Detailed Description</label>
          <textarea
            bind:value={newHypothesis.description}
            placeholder="Describe your hypothesis in detail, including any relevant context or assumptions"
            class="w-full p-3 border border-slate-300 rounded-md shadow-sm h-32 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          ></textarea>
        </div>
        <div class="relative">
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-slate-700">Prior Probability</label>
            <button 
              class="text-indigo-600 text-sm hover:text-indigo-700"
              on:click={() => showPriorHelp = !showPriorHelp}
            >
              {showPriorHelp ? 'Hide Help' : 'What is this?'}
            </button>
          </div>
          {#if showPriorHelp}
            <div class="mb-4 p-4 bg-indigo-50 rounded-md text-sm text-slate-700">
              <p class="mb-2"><strong>Prior Probability</strong> is your initial belief in the hypothesis before considering any evidence.</p>
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
              <span class="text-sm font-medium text-indigo-600">{formatProbability(newHypothesis.priorProbability)}</span>
              <span class="text-sm text-slate-500">100%</span>
            </div>
            {#if newHypothesis.priorProbability === 0 || newHypothesis.priorProbability === 1}
              <div class="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
                <strong>Warning about extreme probability:</strong>
                {#if newHypothesis.priorProbability === 0}
                  Setting a 0% prior probability means you believe this hypothesis is impossible.
                  No amount of evidence will be able to increase this probability.
                {:else}
                  Setting a 100% prior probability means you believe this hypothesis is absolutely certain.
                  No amount of evidence will be able to decrease this probability.
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

    <!-- List of hypotheses -->
    <div>
      <h2 class="text-2xl font-serif text-slate-700 mb-6">Your Hypotheses</h2>
      {#if hypotheses.length === 0}
        <div class="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p class="text-slate-600">No hypotheses yet. Create one above to get started!</p>
        </div>
      {:else}
        <div class="space-y-3">
          {#each hypotheses as hypothesis}
            <a
              href="/hypothesis/{hypothesis.id}"
              class="block bg-white rounded-lg border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 group"
            >
              <div class="p-6">
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-xl font-medium text-slate-800 group-hover:text-indigo-600 transition-colors mb-1 truncate">
                      {hypothesis.name}
                    </h3>
                    <p class="text-slate-600 text-sm line-clamp-2">{hypothesis.description}</p>
                  </div>
                  <div class="ml-6 flex items-center gap-8">
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
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(hypothesis.observations[hypothesis.observations.length - 1]?.timestamp || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div class="flex items-center gap-2 text-slate-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{hypothesis.observations.length} observation{hypothesis.observations.length === 1 ? '' : 's'}</span>
                  </div>
                  <div class="flex items-center gap-2 text-slate-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>
                      {hypothesis.observations.length > 0 
                        ? ((calculatePosteriorProbability(hypothesis) - hypothesis.priorProbability) * 100).toFixed(1) + '% change'
                        : 'No change'}
                    </span>
                  </div>
                </div>
              </div>
              <div class="px-6 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500 rounded-b-lg">
                Click to view details and add observations
              </div>
            </a>
          {/each}
        </div>
      {/if}
    </div>
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
</style>
