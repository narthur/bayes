<script lang="ts">
	import { onMount } from 'svelte';
	import type { CourseProgress } from '$lib/types';
	import { loadCourseProgress, saveCourseProgress } from '$lib/storage';

	let progress: CourseProgress;

	onMount(() => {
		progress = loadCourseProgress();
		progress.currentLesson = 'lesson-1';
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
			<h1 class="text-4xl font-serif text-slate-800 dark:text-slate-100">Bayes' Theorem</h1>
		</div>

		<div class="prose dark:prose-invert max-w-none">
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

			<div class="mt-12 flex justify-between items-center">
				<a
					href="/learn/introduction"
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
