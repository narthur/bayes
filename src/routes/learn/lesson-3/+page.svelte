<script lang="ts">
	import { onMount } from 'svelte';
	import type { CourseProgress } from '$lib/types';
	import { loadCourseProgress, saveCourseProgress } from '$lib/storage';

	let progress: CourseProgress;

	onMount(() => {
		progress = loadCourseProgress();
		progress.currentLesson = 'lesson-3';
		progress.lastVisited = Date.now();
		saveCourseProgress(progress);
	});
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
			<h1 class="text-4xl font-serif text-slate-800 dark:text-slate-100">Prior and Posterior Distributions</h1>
		</div>

		<div class="prose dark:prose-invert max-w-none">
			<h2>Types of Priors</h2>
			<p>
				When applying Bayesian reasoning, we start with a prior probability - our initial belief before
				seeing new evidence. There are different types of priors we can use:
			</p>

			<div class="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
				<h3 class="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">Informative Priors</h3>
				<ul>
					<li>Based on previous knowledge or expert opinion</li>
					<li>Incorporate specific information about the situation</li>
					<li>Example: Using historical disease rates to set prior probability for a medical diagnosis</li>
					<li>More influential on the final result when evidence is limited</li>
				</ul>
			</div>

			<div class="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
				<h3 class="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">Non-informative Priors</h3>
				<ul>
					<li>Used when we have little or no prior knowledge</li>
					<li>Attempt to be "objective" or minimize influence on posterior</li>
					<li>Example: Using 50% when we're completely uncertain between two possibilities</li>
					<li>Let the data speak for itself</li>
				</ul>
			</div>

			<h2>Updating Beliefs with Data</h2>
			<p>
				As we gather evidence, we update our prior beliefs to form posterior distributions. This process
				can be repeated, using the posterior from one update as the prior for the next.
			</p>

			<div class="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
				<h3 class="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">Example: Weather Prediction</h3>
				<p>Imagine predicting if it will rain tomorrow:</p>
				<ol>
					<li class="mb-2">
						<strong>Initial Prior:</strong> Based on historical data, it rains 30% of days in your area
						(informative prior)
					</li>
					<li class="mb-2">
						<strong>First Update:</strong> You see dark clouds (evidence). After applying Bayes' theorem,
						your belief increases to 70%
					</li>
					<li class="mb-2">
						<strong>Second Update:</strong> The weather radar shows no precipitation (new evidence). Using
						70% as your new prior, you update your belief to 40%
					</li>
				</ol>
			</div>

			<h2>Visualizing Distributions</h2>
			<p>
				Probability distributions help us visualize our uncertainty. Instead of just a single number, we
				can see the range of possible values and their relative likelihoods.
			</p>

			<div class="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
				<h3 class="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">Common Distribution Shapes</h3>
				<ul>
					<li>
						<strong>Bell Curve (Normal):</strong> Symmetric, centered on the most likely value, common
						for natural phenomena
					</li>
					<li>
						<strong>Uniform:</strong> Flat line, used for non-informative priors when any value is
						equally likely
					</li>
					<li>
						<strong>Beta:</strong> Flexible shape, good for probabilities between 0 and 1, often used
						for updating beliefs about proportions
					</li>
				</ul>
			</div>

			<h2>Interactive Practice</h2>
			<div class="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
				<h3 class="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">
					Exercise: Choosing Appropriate Priors
				</h3>
				<p class="mb-4">For each scenario, what type of prior would be most appropriate and why?</p>
				<ol class="space-y-4">
					<li>
						<strong>Scenario 1:</strong> Testing a new drug that's similar to existing drugs in the same
						class
						<div class="mt-2 text-slate-600 dark:text-slate-400">
							<em>
								Answer: Informative prior - we can use data from similar drugs to form reasonable
								expectations
							</em>
						</div>
					</li>
					<li>
						<strong>Scenario 2:</strong> Investigating a completely new phenomenon never observed before
						<div class="mt-2 text-slate-600 dark:text-slate-400">
							<em>
								Answer: Non-informative prior - with no previous knowledge, we should let the data drive
								our conclusions
							</em>
						</div>
					</li>
				</ol>
			</div>

			<div class="mt-12 flex justify-between items-center">
				<a
					href="/learn/lesson-2"
					class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium no-underline flex items-center gap-2"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					Previous Lesson
				</a>
				<a
					href="/learn/lesson-4"
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
