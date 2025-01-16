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

  let showPriorHelp = false;
  let showLikelihoodHelp = false;

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

  function formatProbability(prob: number): string {
    return (prob * 100).toFixed(1) + '%';
  }
</script>

<main class="min-h-screen bg-slate-50 py-8 px-4">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-serif text-slate-800 mb-4 text-center">Bayesian Inference Tool</h1>
    <p class="text-slate-600 text-center mb-4 font-light">A systematic approach to updating beliefs based on evidence</p>
    <p class="text-sm text-slate-500 text-center mb-12 max-w-2xl mx-auto">
      Use this tool to track hypotheses and update their probabilities as you gather evidence. 
      Start by creating a hypothesis, then add observations to refine your beliefs.
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
          <div class="flex justify-between items-center mt-1">
            <span class="text-sm text-slate-500">0%</span>
            <span class="text-sm font-medium text-indigo-600">{formatProbability(newHypothesis.priorProbability)}</span>
            <span class="text-sm text-slate-500">100%</span>
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
    <div class="mb-12">
      <h2 class="text-2xl font-serif text-slate-700 mb-6">Your Hypotheses</h2>
      {#if hypotheses.length === 0}
        <div class="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p class="text-slate-600">No hypotheses yet. Create one above to get started!</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each hypotheses as hypothesis}
            <div
              class="p-6 bg-white rounded-lg border border-slate-200 shadow-sm cursor-pointer transition-all hover:shadow-md"
              class:ring-2={selectedHypothesis?.id === hypothesis.id}
              class:ring-indigo-500={selectedHypothesis?.id === hypothesis.id}
              on:click={() => selectedHypothesis = hypothesis}
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-xl font-medium text-slate-800">{hypothesis.name}</h3>
                  <p class="text-slate-600 mt-2 text-sm">{hypothesis.description}</p>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-medium text-indigo-600">
                    {formatProbability(calculatePosteriorProbability(hypothesis))}
                  </div>
                  <div class="text-sm text-slate-500">probability</div>
                </div>
              </div>
              <div class="mt-4 flex items-center gap-4 text-sm text-slate-500">
                <span>Started at {formatProbability(hypothesis.priorProbability)}</span>
                <span>•</span>
                <span>{hypothesis.observations.length} observation{hypothesis.observations.length === 1 ? '' : 's'}</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Add observation to selected hypothesis -->
    {#if selectedHypothesis}
      <div class="p-8 bg-white rounded-lg shadow-sm border border-slate-200">
        <h2 class="text-2xl font-serif text-slate-700 mb-2">
          Add Evidence for "{selectedHypothesis.name}"
        </h2>
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

        <!-- List of observations -->
        {#if selectedHypothesis.observations.length > 0}
          <div class="mt-8 pt-8 border-t border-slate-200">
            <h3 class="text-lg font-medium text-slate-700 mb-4">Previous Evidence</h3>
            <div class="space-y-3">
              {#each selectedHypothesis.observations as observation}
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
