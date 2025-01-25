<script lang="ts">
	import { onMount } from 'svelte';
	import type { CourseProgress } from '$lib/types';
	import { loadCourseProgress } from '$lib/storage';

	let progress: CourseProgress;

	onMount(() => {
		progress = loadCourseProgress();
	});

	const lessons = [
		{
			id: 'introduction',
			title: 'Introduction to Bayesian Reasoning',
			description: 'Learn the fundamental concepts of Bayesian reasoning and how it helps us think better.',
			duration: '5 minutes'
		},
		{
			id: 'lesson-1',
			title: 'Bayes\' Theorem',
			description: 'Understanding the mathematical foundation of Bayesian reasoning.',
			duration: '10 minutes',
			comingSoon: true
		}
	];
</script>

<main class="bg-slate-50 dark:bg-slate-900 py-16">
	<div class="max-w-4xl mx-auto px-4">
		<h1 class="text-4xl font-serif text-slate-800 dark:text-slate-100 mb-8">Learn Bayesian Reasoning</h1>

		<div class="space-y-8">
			{#each lessons as lesson, index}
				<div
					class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6"
				>
					<div class="flex items-start justify-between gap-4">
						<div>
							<div class="flex items-center gap-3">
								<span class="text-sm font-medium text-indigo-600 dark:text-indigo-400">
									Lesson {index + 1}
								</span>
								<h2 class="text-xl font-serif text-slate-800 dark:text-slate-100">
									{lesson.title}
								</h2>
							</div>
							<p class="text-slate-600 dark:text-slate-300 mb-4">{lesson.description}</p>
							<div class="flex items-center gap-4 text-sm">
								<div class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									{lesson.duration}
								</div>
								{#if progress?.completedLessons.find(l => l.id === lesson.id)}
									<div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											/>
										</svg>
										Completed
									</div>
								{/if}
							</div>
						</div>
						{#if lesson.comingSoon}
							<div
								class="px-4 py-2 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 rounded-md"
							>
								Coming Soon
							</div>
						{:else}
							<a
								href="/learn/{lesson.id}"
								class="px-4 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-slate-700 rounded-md transition-colors font-medium"
							>
								{progress?.completedLessons.find(l => l.id === lesson.id) ? 'Review Lesson' : 'Start Lesson'}
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</main>
