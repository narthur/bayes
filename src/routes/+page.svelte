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

<main class="p-4 max-w-4xl mx-auto">
  <h1 class="text-3xl font-bold mb-8">Bayesian Reasoning Assistant</h1>

  <!-- Add new hypothesis -->
  <div class="mb-8 p-4 border rounded">
    <h2 class="text-xl font-semibold mb-4">New Hypothesis</h2>
    <div class="space-y-4">
      <div>
        <label class="block mb-1">Name:</label>
        <input
          type="text"
          bind:value={newHypothesis.name}
          class="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label class="block mb-1">Description:</label>
        <textarea
          bind:value={newHypothesis.description}
          class="w-full p-2 border rounded"
        ></textarea>
      </div>
      <div>
        <label class="block mb-1">Prior Probability: {newHypothesis.priorProbability}</label>
        <input
          type="range"
          bind:value={newHypothesis.priorProbability}
          min="0"
          max="1"
          step="0.01"
          class="w-full"
        />
      </div>
      <button
        on:click={addHypothesis}
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Hypothesis
      </button>
    </div>
  </div>

  <!-- List of hypotheses -->
  <div class="mb-8">
    <h2 class="text-xl font-semibold mb-4">Your Hypotheses</h2>
    <div class="space-y-4">
      {#each hypotheses as hypothesis}
        <div
          class="p-4 border rounded cursor-pointer"
          class:bg-blue-50={selectedHypothesis?.id === hypothesis.id}
          on:click={() => selectedHypothesis = hypothesis}
        >
          <h3 class="font-semibold">{hypothesis.name}</h3>
          <p class="text-gray-600">{hypothesis.description}</p>
          <p class="mt-2">
            Current probability: {(calculatePosteriorProbability(hypothesis) * 100).toFixed(1)}%
          </p>
        </div>
      {/each}
    </div>
  </div>

  <!-- Add observation to selected hypothesis -->
  {#if selectedHypothesis}
    <div class="p-4 border rounded">
      <h2 class="text-xl font-semibold mb-4">
        Add Observation to "{selectedHypothesis.name}"
      </h2>
      <div class="space-y-4">
        <div>
          <label class="block mb-1">Observation:</label>
          <input
            type="text"
            bind:value={newObservation.description}
            class="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label class="block mb-1">
            P(E|H) - Probability of this observation if hypothesis is true: {newObservation.probabilityGivenTrue}
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
          <label class="block mb-1">
            P(E|¬H) - Probability of this observation if hypothesis is false: {newObservation.probabilityGivenFalse}
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
        <button
          on:click={addObservation}
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Observation
        </button>
      </div>

      <!-- List of observations -->
      <div class="mt-8">
        <h3 class="font-semibold mb-2">Previous Observations</h3>
        <div class="space-y-2">
          {#each selectedHypothesis.observations as observation}
            <div class="p-2 border rounded">
              <p>{observation.description}</p>
              <p class="text-sm text-gray-600">
                P(E|H): {observation.probabilityGivenTrue} |
                P(E|¬H): {observation.probabilityGivenFalse}
              </p>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, sans-serif;
  }

  input[type="range"] {
    width: 100%;
    height: 25px;
    -webkit-appearance: none;
    background: transparent;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    background: #ddd;
    border-radius: 2px;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #4299e1;
    margin-top: -6px;
    cursor: pointer;
  }
</style>
