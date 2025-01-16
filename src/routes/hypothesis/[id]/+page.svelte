<script lang="ts">
  import { goto } from '$app/navigation';
  import type { Hypothesis, Observation } from '$lib/types';
  import { calculatePosteriorProbability } from '$lib/bayes';
  import { saveHypotheses, loadHypotheses } from '$lib/storage';

  export let data: { hypothesis: Hypothesis };
  let hypothesis = data.hypothesis;
  
  let newObservation = {
    description: '',
    probabilityGivenTrue: 0.5,
    probabilityGivenFalse: 0.5
  };
  let showLikelihoodHelp = false;

  function addObservation() {
    if (!newObservation.description) return;

    const observation: Observation = {
      id: crypto.randomUUID(),
      description: newObservation.description,
      probabilityGivenTrue: newObservation.probabilityGivenTrue,
      probabilityGivenFalse: newObservation.probabilityGivenFalse,
      timestamp: Date.now()
    };

    hypothesis.observations = [...hypothesis.observations, observation];
    
    // Update in storage
    const hypotheses = loadHypotheses();
    const updatedHypotheses = hypotheses.map(h => 
      h.id === hypothesis.id ? hypothesis : h
    );
    saveHypotheses(updatedHypotheses);
    
    newObservation = { description: '', probabilityGivenTrue: 0.5, probabilityGivenFalse: 0.5 };
  }

  function formatProbability(prob: number): string {
    return (prob * 100).toFixed(1) + '%';
  }
</script>

<main class="min-h-screen bg-slate-50 py-8 px-4">
  <div class="max-w-4xl mx-auto">
    <div class="mb-8 flex items-center justify-between">
      <button
        on:click={() => goto('/')}
        class="text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

    <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8">
      <h1 class="text-3xl font-serif text-slate-800 mb-4">{hypothesis.name}</h1>
      <p class="text-slate-600 mb-6">{hypothesis.description}</p>
      <div class="flex items-center gap-4 text-sm text-slate-500">
        <span>Started at {formatProbability(hypothesis.priorProbability)}</span>
        <span>•</span>
        <span>{hypothesis.observations.length} observation{hypothesis.observations.length === 1 ? '' : 's'}</span>
      </div>
    </div>

    <!-- Add new observation -->
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8">
      <h2 class="text-2xl font-serif text-slate-700 mb-2">Add New Evidence</h2>
      <p class="text-sm text-slate-500 mb-6">Record new evidence and estimate how likely it would be under different scenarios</p>
      
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">What did you observe?</label>
          <input
            type="text"
            bind:value={newObservation.description}
            placeholder="Describe the evidence you've found"
            class="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          />
        </div>
        
        <div class="relative">
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-slate-700">Likelihood Ratios</label>
            <button 
              class="text-indigo-600 text-sm hover:text-indigo-700"
              on:click={() => showLikelihoodHelp = !showLikelihoodHelp}
            >
              {showLikelihoodHelp ? 'Hide Help' : 'What are these?'}
            </button>
          </div>
          {#if showLikelihoodHelp}
            <div class="mb-4 p-4 bg-indigo-50 rounded-md text-sm text-slate-700">
              <p class="mb-2">These probabilities help us understand how strong the evidence is:</p>
              <p class="mb-2"><strong>P(E|H)</strong>: How likely would you be to see this evidence if your hypothesis is true?</p>
              <p class="mb-2"><strong>P(E|¬H)</strong>: How likely would you be to see this evidence if your hypothesis is false?</p>
              <p>The more these probabilities differ, the stronger the evidence is for or against your hypothesis.</p>
            </div>
          {/if}
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                If hypothesis is true, how likely is this evidence? 
                <span class="text-indigo-600">{formatProbability(newObservation.probabilityGivenTrue)}</span>
              </label>
              <input
                type="range"
                bind:value={newObservation.probabilityGivenTrue}
                min="0"
                max="1"
                step="0.01"
                class="w-full"
              />
              {#if newObservation.probabilityGivenTrue === 0 || newObservation.probabilityGivenTrue === 1}
                <div class="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
                  <strong>Warning about extreme likelihood:</strong>
                  {#if newObservation.probabilityGivenTrue === 0}
                    Setting this to 0% means this evidence would be impossible if your hypothesis is true.
                    Finding this evidence would completely disprove your hypothesis.
                  {:else}
                    Setting this to 100% means this evidence would be guaranteed if your hypothesis is true.
                    Not finding this evidence would completely disprove your hypothesis.
                  {/if}
                  Consider using a small value like 1% or 99% instead to account for uncertainty.
                </div>
              {/if}
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                If hypothesis is false, how likely is this evidence? 
                <span class="text-indigo-600">{formatProbability(newObservation.probabilityGivenFalse)}</span>
              </label>
              <input
                type="range"
                bind:value={newObservation.probabilityGivenFalse}
                min="0"
                max="1"
                step="0.01"
                class="w-full"
              />
              {#if newObservation.probabilityGivenFalse === 0 || newObservation.probabilityGivenFalse === 1}
                <div class="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
                  <strong>Warning about extreme likelihood:</strong>
                  {#if newObservation.probabilityGivenFalse === 0}
                    Setting this to 0% means this evidence would be impossible if your hypothesis is false.
                    Finding this evidence would completely prove your hypothesis.
                  {:else}
                    Setting this to 100% means this evidence would be guaranteed if your hypothesis is false.
                    Not finding this evidence would completely prove your hypothesis.
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

    <!-- List of observations -->
    {#if hypothesis.observations.length > 0}
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <h2 class="text-2xl font-serif text-slate-700 mb-6">Evidence Timeline</h2>
        <div class="space-y-4">
          {#each hypothesis.observations.sort((a, b) => b.timestamp - a.timestamp) as observation}
            <div class="p-4 bg-slate-50 rounded-md border border-slate-200">
              <p class="text-slate-800 font-medium">{observation.description}</p>
              <div class="mt-2 flex gap-6 text-sm text-slate-600">
                <span>If true: {formatProbability(observation.probabilityGivenTrue)}</span>
                <span>If false: {formatProbability(observation.probabilityGivenFalse)}</span>
                <span class="text-slate-400">{new Date(observation.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          {/each}
        </div>
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
</style>
