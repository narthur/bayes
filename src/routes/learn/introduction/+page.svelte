<script lang="ts">
	import { onMount } from 'svelte';
	import type { CourseProgress } from '$lib/types';
	import { loadCourseProgress, saveCourseProgress } from '$lib/storage';

	let progress: CourseProgress;

	onMount(() => {
		progress = loadCourseProgress();
		progress.currentLesson = 'introduction';
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
			<h1 class="text-4xl font-serif text-slate-800 dark:text-slate-100">Introduction to Bayesian Reasoning</h1>
		</div>

		<div class="prose dark:prose-invert max-w-none">
			<h2>What is Bayesian Reasoning?</h2>
			<p>
				Bayesian reasoning is a method of thinking that helps us update our beliefs based on new evidence.
				It's named after Thomas Bayes, an 18th-century statistician who first formalized this approach.
			</p>

			<h2>The Core Concept</h2>
			<p>
				At its heart, Bayesian reasoning is about starting with what we already believe (our "prior") and
				then updating that belief when we see new evidence. The strength of the update depends on how
				surprising the evidence would be if our belief was true versus if it was false.
			</p>

			<h2>A Simple Example</h2>
			<p>
				Imagine you're trying to figure out if your friend is planning a surprise party for you. You
				start with a guess - maybe there's a 20% chance they are (this is your prior probability).
			</p>

			<p>
				Then you notice your friend asking about your schedule for next weekend. How much should this
				change your belief? It depends on two things:
			</p>

			<ul>
				<li>
					How likely would they be to ask about your schedule if they were planning a party? (Pretty
					likely, maybe 80%)
				</li>
				<li>
					How likely would they be to ask about your schedule if they weren't planning a party? (Less
					likely, maybe 20%)
				</li>
			</ul>

			<p>
				Because the evidence (asking about your schedule) is more likely in the world where they're
				planning a party, your belief that they're planning a party should increase.
			</p>

			<div class="mt-12 flex justify-between items-center">
				<div></div>
				<a
					href="/learn/lesson-1"
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
