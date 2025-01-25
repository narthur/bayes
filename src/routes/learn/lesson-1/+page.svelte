<script lang="ts">
	import { onMount } from 'svelte';
	import type { CourseProgress } from '$lib/types';
	import { loadCourseProgress, saveCourseProgress } from '$lib/storage';

	let progress: CourseProgress;
	let quizAnswer = '';
	let quizFeedback = '';

	onMount(() => {
		progress = loadCourseProgress();
		progress.currentLesson = 'lesson-1';
		progress.lastVisited = Date.now();
		saveCourseProgress(progress);
	});

	function checkQuizAnswer() {
		const answer = quizAnswer.toLowerCase().trim();
		if (answer === 'b' || answer === '2') {
			quizFeedback = 'Correct! The frequentist approach would tell us the probability of getting these exact test results if the drug truly had no effect. The Bayesian approach directly tells us what we want to know: the probability that the drug works given the evidence we have.';
		} else {
			quizFeedback = 'Not quite. Think about what each approach tells us and which one directly answers the question we care about.';
		}
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
			<h1 class="text-4xl font-serif text-slate-800 dark:text-slate-100">Introduction to Bayesian Thinking</h1>
		</div>

		<div class="prose dark:prose-invert max-w-none">
			<h2>What is Bayesian Thinking?</h2>
			<p>
				Bayesian thinking is a way of reasoning about uncertainty that differs fundamentally from traditional
				statistical approaches. It's based on the idea that probability represents a degree of belief,
				which can be updated as new evidence becomes available.
			</p>

			<h2>Bayesian vs. Frequentist Approaches</h2>
			<p>
				There are two main schools of thought in statistics:
			</p>

			<div class="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
				<h3 class="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">Frequentist Approach</h3>
				<ul>
					<li>Probability is viewed as the long-run frequency of events</li>
					<li>Relies on p-values and confidence intervals</li>
					<li>Cannot assign probabilities to hypotheses (they're either true or false)</li>
					<li>Focuses on "What's the probability of this data if the hypothesis is true?"</li>
				</ul>
			</div>

			<div class="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
				<h3 class="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">Bayesian Approach</h3>
				<ul>
					<li>Probability represents degree of belief</li>
					<li>Uses prior knowledge and updates it with new evidence</li>
					<li>Can assign probabilities to hypotheses</li>
					<li>Answers "What's the probability the hypothesis is true given this data?"</li>
				</ul>
			</div>

			<h2>Basic Probability Concepts</h2>
			
			<h3>Probability Scale</h3>
			<p>
				Probabilities range from 0 (impossible) to 1 (certain), or 0% to 100%. For example:
			</p>
			<ul>
				<li>0% - Impossible event (like rolling a 7 on a six-sided die)</li>
				<li>50% - Equal chance (like getting heads on a fair coin)</li>
				<li>100% - Certain event (like rolling a number ≤ 6 on a six-sided die)</li>
			</ul>

			<h3>Conditional Probability</h3>
			<p>
				The probability of an event occurring given that another event has occurred. Written as P(A|B),
				read as "probability of A given B". For example:
			</p>
			<ul>
				<li>What's the probability it's raining (A) given that there are dark clouds (B)?</li>
				<li>What's the probability someone has a disease (A) given they tested positive (B)?</li>
			</ul>

			<h2>Interactive Practice</h2>
			<div class="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
				<h3 class="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">Question</h3>
				<p class="mb-4">
					A new drug is being tested. After clinical trials, you want to know if the drug is effective.
					Which approach would be more directly useful?
				</p>
				<ol class="mb-4">
					<li>Frequentist approach: "What's the probability of seeing these trial results if the drug had no effect?"</li>
					<li>Bayesian approach: "What's the probability the drug is effective given these trial results?"</li>
				</ol>
				<div class="space-y-4">
					<div class="flex items-center gap-4">
						<input
							type="text"
							placeholder="Enter A or B"
							bind:value={quizAnswer}
							class="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-slate-100"
						/>
						<button
							on:click={checkQuizAnswer}
							class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
						>
							Check Answer
						</button>
					</div>
					{#if quizFeedback}
						<div class="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">
							{quizFeedback}
						</div>
					{/if}
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
