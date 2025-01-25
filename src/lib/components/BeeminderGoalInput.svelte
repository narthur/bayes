<script lang="ts">
	import { BeeminderService } from '$lib/beeminder';
	import type { BeeminderConfig } from '$lib/types';

	export let beeminderConfig: BeeminderConfig;
	export let value: string | undefined;
	export let placeholder = 'Enter goal slug';
	export let label = '';
	export let helpText = '';

	let checkResult = '';
	let isChecking = false;

	function debounce<T extends unknown[], R>(
		fn: (...args: T) => R,
		wait: number
	): (...args: T) => void {
		let timeoutId: ReturnType<typeof setTimeout>;
		return (...args: T) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => fn(...args), wait);
		};
	}

	async function checkGoal(goalSlug: string | undefined) {
		isChecking = true;
		checkResult = '';

		try {
			if (!beeminderConfig.username || !beeminderConfig.authToken || !goalSlug) {
				checkResult = 'Please fill in all fields first';
				return;
			}

			const service = new BeeminderService(beeminderConfig);
			const goals = await service.getGoals();
			const goal = goals.find((g) => g.slug === goalSlug);

			if (goal) {
				checkResult = `✓ Found goal "${goal.slug}"`;
			} else {
				checkResult = '✗ Goal not found';
			}
		} catch {
			checkResult = '✗ Failed to check goal';
		} finally {
			isChecking = false;
		}
	}

	const debouncedCheck = debounce(checkGoal, 500);

	$: if (beeminderConfig?.username && beeminderConfig?.authToken) {
		debouncedCheck(value);
	}
</script>

<div class="relative">
	{#if label}
		<label
			class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
			for="goal-input">{label}</label
		>
	{/if}
	<input
		id="goal-input"
		type="text"
		bind:value
		{placeholder}
		class="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-md"
		on:change
	/>
	<div class="absolute top-1/2 -translate-y-1/2 right-0 pr-3">
		{#if isChecking}
			<svg
				class="animate-spin h-5 w-5 text-slate-400"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
		{:else if checkResult.startsWith('✓')}
			<svg class="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
				></path>
			</svg>
		{:else if checkResult.startsWith('✗')}
			<svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				></path>
			</svg>
		{/if}
	</div>
	{#if helpText}
		<div class="text-xs text-slate-500 dark:text-slate-400 mt-1">
			{helpText}
		</div>
	{/if}
</div>
