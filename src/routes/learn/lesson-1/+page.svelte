<script lang="ts">
	import { onMount } from 'svelte';
	import type { CourseProgress } from '$lib/types';
	import { loadCourseProgress, saveCourseProgress } from '$lib/storage';

	let progress: CourseProgress;
	let medicalTestAnswer = '';
	let medicalTestFeedback = '';
	let customPrior = '';
	let customLikelihoodTrue = '';
	let customLikelihoodFalse = '';
	let customResult = '';

	onMount(() => {
		progress = loadCourseProgress();
		progress.currentLesson = 'lesson-1';
		progress.lastVisited = Date.now();
		saveCourseProgress(progress);
	});

	function checkMedicalTest() {
		const answer = parseFloat(medicalTestAnswer);
		if (isNaN(answer)) {
			medicalTestFeedback = 'Please enter a valid number';
			return;
		}

		// Calculate correct answer
		const prior = 0.01; // 1%
		const truePositive = 0.95; // 95%
		const falsePositive = 0.05; // 5%
		const evidence = truePositive * prior + falsePositive * (1 - prior);
		const posterior = (truePositive * prior) / evidence;
		const correctAnswer = posterior * 100;

		if (Math.abs(answer - correctAnswer) <= 2) {
			medicalTestFeedback = `Correct! The exact answer is ${correctAnswer.toFixed(1)}%. This surprisingly low probability demonstrates the "base rate fallacy" - even with a highly accurate test, if the condition is rare, most positive results are false positives.`;
		} else {
			medicalTestFeedback = `Not quite. The answer is ${correctAnswer.toFixed(1)}%. Try working through the formula step by step: P(H|E) = P(E|H) × P(H) / P(E)`;
		}
	}

	function calculateCustom() {
		const prior = parseFloat(customPrior) / 100;
		const likelihoodTrue = parseFloat(customLikelihoodTrue) / 100;
		const likelihoodFalse = parseFloat(customLikelihoodFalse) / 100;

		if (isNaN(prior) || isNaN(likelihoodTrue) || isNaN(likelihoodFalse)) {
			customResult = 'Please enter valid numbers for all fields';
			return;
		}

		if (prior < 0 || prior > 1 || likelihoodTrue < 0 || likelihoodTrue > 1 || likelihoodFalse < 0 || likelihoodFalse > 1) {
			customResult = 'All values must be between 0 and 100';
			return;
		}

		const evidence = likelihoodTrue * prior + likelihoodFalse * (1 - prior);
		const posterior = (likelihoodTrue * prior) / evidence;
		customResult = `Updated probability: ${(posterior * 100).toFixed(1)}%`;
	}
</script>

<main class="bg-slate-50 dark:bg-slate-900 py-16">
	<div class="max-w-4xl mx-auto px-4">
		<div class="mb-8">
			<a
				href="/learn"
				class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-2 mb-4"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to Course Overview
			</a>
			<h1 class="text-4xl font-serif text-slate-800 dark:text-slate-100">Bayes' Theorem</h1>
		</div>

		<div class="prose dark:prose-invert max-w-none">
			<h2>Introduction to Bayesian Reasoning</h2>
			<p>
				Bayesian reasoning is a method of thinking that helps us update our beliefs based on new evidence.
				It's named after Thomas Bayes, an 18th-century statistician who first formalized this approach.
			</p>

			<p>
				At its heart, Bayesian reasoning is about starting with what we already believe (our "prior") and
				then updating that belief when we see new evidence. The strength of the update depends on how
				surprising the evidence would be if our belief was true versus if it was false.
			</p>

			<div class="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
				<h3 class="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">Example: The Surprise Party</h3>
				<p>
					Imagine you're trying to figure out if your friend is planning a surprise party for you. You
					start with a guess - maybe there's a 20% chance they are (this is your prior probability).
				</p>

				<p class="mt-4">
					Then you notice your friend asking about your schedule for next weekend. How much should this
					change your belief? It depends on two things:
				</p>

				<ul class="list-disc list-inside mt-4 space-y-2">
					<li>
						How likely would they be to ask about your schedule if they were planning a party? (Pretty
						likely, maybe 80%)
					</li>
					<li>
						How likely would they be to ask about your schedule if they weren't planning a party? (Less
						likely, maybe 20%)
					</li>
				</ul>

				<p class="mt-4">
					Because the evidence (asking about your schedule) is more likely in the world where they're
					planning a party, your belief that they're planning a party should increase.
				</p>
			</div>
			<h2>The Formula</h2>
			<p>
				At the heart of Bayesian reasoning is Bayes' theorem, a mathematical formula that tells us how to
				update our beliefs when we see new evidence. The formula is:
			</p>

			<pre class="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">P(H|E) = P(E|H) × P(H) / P(E)</pre>

			<p>Where:</p>
			<ul>
				<li>P(H|E) is the probability of our hypothesis being true given the evidence (posterior)</li>
				<li>P(E|H) is the probability of seeing this evidence if our hypothesis is true (likelihood)</li>
				<li>P(H) is our initial belief in the hypothesis (prior)</li>
				<li>P(E) is the probability of seeing this evidence in general (normalizing constant)</li>
			</ul>

			<h2>A Practical Example</h2>
			<p>Let's return to our surprise party example:</p>

			<ul>
				<li>Prior P(H): 20% chance they're planning a party</li>
				<li>Likelihood P(E|H): 80% chance they'd ask about schedule if planning a party</li>
				<li>Alternative P(E|¬H): 20% chance they'd ask about schedule if not planning a party</li>
			</ul>

			<p>Using Bayes' theorem:</p>
			<ol>
				<li>P(H) = 0.20 (our prior)</li>
				<li>P(E|H) = 0.80 (likelihood)</li>
				<li>
					P(E) = P(E|H)×P(H) + P(E|¬H)×P(¬H)<br />
					= 0.80×0.20 + 0.20×0.80<br />
					= 0.16 + 0.16<br />
					= 0.32
				</li>
			</ol>

			<p>Therefore:<br />P(H|E) = (0.80 × 0.20) / 0.32 = 0.50</p>

			<p>Our belief in a surprise party should increase from 20% to 50% after seeing this evidence!</p>

			<h2>Practice</h2>
			<p>Try applying this to your own beliefs:</p>
			<ol>
				<li>Start with a hypothesis and assign it a prior probability</li>
				<li>
					When you see new evidence, estimate:
					<ul>
						<li>How likely you'd see this evidence if your hypothesis was true</li>
						<li>How likely you'd see this evidence if your hypothesis was false</li>
					</ul>
				</li>
				<li>Use Bayes' theorem to calculate your new belief</li>
			</ol>

			<h3>Interactive Practice</h3>
			
			<div class="my-8">
				<h4>Medical Test Example</h4>
				<p>A medical test is 90% accurate for detecting a disease that affects 1% of the population. If someone tests positive, what is the probability they have the disease?</p>
				<div class="flex items-center gap-4 mt-4">
					<input
						type="number"
						min="0"
						max="100"
						step="1"
						placeholder="Enter percentage"
						bind:value={medicalTestAnswer}
						class="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-slate-100"
					/>
					<button
						on:click={checkMedicalTest}
						class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
						>Check Answer</button
					>
				</div>
				{#if medicalTestFeedback}
					<div class="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">
						{medicalTestFeedback}
					</div>
				{/if}
			</div>

			<div class="my-8">
				<h4>Custom Calculator</h4>
				<p>Try your own numbers:</p>
				<div class="space-y-4">
					<div class="flex items-center gap-4">
						<label for="custom-prior">Prior probability:</label>
						<input
							id="custom-prior"
							type="number"
							min="0"
							max="100"
							step="1"
							placeholder="Enter percentage"
							bind:value={customPrior}
							class="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-slate-100"
						/>
					</div>
					<div class="flex items-center gap-4">
						<label for="custom-likelihood-true">Likelihood if true:</label>
						<input
							id="custom-likelihood-true"
							type="number"
							min="0"
							max="100"
							step="1"
							placeholder="Enter percentage"
							bind:value={customLikelihoodTrue}
							class="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-slate-100"
						/>
					</div>
					<div class="flex items-center gap-4">
						<label for="custom-likelihood-false">Likelihood if false:</label>
						<input
							id="custom-likelihood-false"
							type="number"
							min="0"
							max="100"
							step="1"
							placeholder="Enter percentage"
							bind:value={customLikelihoodFalse}
							class="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-slate-100"
						/>
					</div>
					<button
						on:click={calculateCustom}
						class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
						>Calculate</button
					>
					{#if customResult}
						<div class="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">
							{customResult}
						</div>
					{/if}
				</div>
			</div>

			<h2>Interactive Practice</h2>

			<div class="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
				<h3 class="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">Question 1: The Medical Test</h3>
				<p class="mb-4">
					A medical test for a rare disease is 95% accurate (it correctly identifies 95% of people who have
					the disease and 95% of people who don't). The disease affects 1% of the population. If someone
					tests positive, what is the probability they have the disease?
				</p>

				<div class="space-y-4 mb-6">
					<div>							<label
								for="medical-test-answer"
								class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
								>Your answer:</label
							>
							<input
								id="medical-test-answer"
							type="number"
							min="0"
							max="100"
							step="1"
							placeholder="Enter percentage"
							class="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700"
						/>
						<span class="ml-2 text-slate-600 dark:text-slate-400">%</span>
					</div>

					<button
						class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
						>Check Answer</button
					>

					<div class="text-sm text-slate-600 dark:text-slate-400">
						<p class="font-medium mb-2">Hint:</p>
						<ul class="list-disc list-inside space-y-1">
							<li>P(H) = 1% = 0.01 (prior)</li>
							<li>P(E|H) = 95% = 0.95 (true positive rate)</li>
							<li>P(E|¬H) = 5% = 0.05 (false positive rate)</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
				<h3 class="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">
					Question 2: Build Your Own
				</h3>
				<p class="mb-4">
					Think of a real-world situation where you're uncertain about something. Fill in the values below
					to calculate the updated probability:
				</p>

				<div class="space-y-4 mb-6">
					<div>							<label
								for="custom-prior"
								class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
								>Prior probability (%):</label
							>
							<input
								id="custom-prior"
							type="number"
							min="0"
							max="100"
							step="1"
							placeholder="Enter percentage"
							class="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700"
						/>
					</div>

					<div>							<label
								for="custom-likelihood-true"
								class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
								>Likelihood if true (%):</label
							>
							<input
								id="custom-likelihood-true"
							type="number"
							min="0"
							max="100"
							step="1"
							placeholder="Enter percentage"
							class="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700"
						/>
					</div>

					<div>							<label
								for="custom-likelihood-false"
								class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
								>Likelihood if false (%):</label
							>
							<input
								id="custom-likelihood-false"
							type="number"
							min="0"
							max="100"
							step="1"
							placeholder="Enter percentage"
							class="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700"
						/>
					</div>

					<button
						class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
						>Calculate</button
					>

					<div class="text-sm text-slate-600 dark:text-slate-400">
						Result will appear here...
					</div>
				</div>
			</div>

			<div class="mt-12 flex justify-end items-center">
				<a
					href="/learn/lesson-2"
					class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium no-underline flex items-center gap-2"
				>
					Next Lesson
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14 5l7 7m0 0l-7 7m7-7H3"
						/>
					</svg>
				</a>
			</div>
		</div>
	</div>
</main>
