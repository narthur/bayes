<script lang="ts">
	import { onMount } from 'svelte';
	import type { CourseProgress } from '$lib/types';
	import { loadCourseProgress, saveCourseProgress } from '$lib/storage';
	import Introduction from './Introduction.md';

	let progress: CourseProgress;

	onMount(() => {
		progress = loadCourseProgress();
		progress.currentLesson = 'introduction';
		progress.lastVisited = Date.now();
		saveCourseProgress(progress);
	});
</script>

<main class="bg-slate-50 dark:bg-slate-900 py-16">
	<Introduction />
</main>
