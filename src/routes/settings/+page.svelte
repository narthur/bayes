<script lang="ts">
	import { onMount } from 'svelte';
	import type { BeeminderConfig } from '$lib/types';
	import { loadHypotheses, saveHypotheses } from '$lib/storage';
	import { BeeminderService } from '$lib/beeminder';

	// Debounce function
	function debounce<T extends (...args: unknown[]) => unknown>(
		fn: T,
		wait: number
	): (...args: Parameters<T>) => void {
		let timeoutId: ReturnType<typeof setTimeout>;
		return (...args: Parameters<T>) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => fn(...args), wait);
		};
	}

	let beeminderConfig: BeeminderConfig = {
		username: '',
		authToken: '',
		hypothesisGoal: '',
		observationGoal: ''
	};
	let goalCheckResult = '';
	let observationGoalCheckResult = '';
	let isCheckingGoal = false;
	let isCheckingObservationGoal = false;

	onMount(() => {
		const stored = localStorage.getItem('beeminder-config');
		if (stored) {
			beeminderConfig = JSON.parse(stored);
		}
	});

	async function checkGoal(
		goalSlug: string | undefined,
		resultVar: 'goalCheckResult' | 'observationGoalCheckResult'
	) {
		if (resultVar === 'goalCheckResult') {
			isCheckingGoal = true;
		} else {
			isCheckingObservationGoal = true;
		}

		try {
			if (!beeminderConfig.username || !beeminderConfig.authToken || !goalSlug) {
				if (resultVar === 'goalCheckResult') {
					goalCheckResult = 'Please fill in all fields first';
				} else {
					observationGoalCheckResult = 'Please fill in all fields first';
				}
				return;
			}

			const service = new BeeminderService(beeminderConfig);
			const goals = await service.getGoals();
			const goal = goals.find((g) => g.slug === goalSlug);
			if (goal) {
				if (resultVar === 'goalCheckResult') {
					goalCheckResult = `✓ Found goal "${goal.slug}"`;
				} else {
					observationGoalCheckResult = `✓ Found goal "${goal.slug}"`;
				}
			} else {
				if (resultVar === 'goalCheckResult') {
					goalCheckResult = '✗ Goal not found';
				} else {
					observationGoalCheckResult = '✗ Goal not found';
				}
			}
		} catch {
			if (resultVar === 'goalCheckResult') {
				goalCheckResult = '✗ Failed to check goal';
			} else {
				observationGoalCheckResult = '✗ Failed to check goal';
			}
		} finally {
			if (resultVar === 'goalCheckResult') {
				isCheckingGoal = false;
			} else {
				isCheckingObservationGoal = false;
			}
		}

		const service = new BeeminderService(beeminderConfig);
		try {
			const goals = await service.getGoals();
			const goal = goals.find((g) => g.slug === goalSlug);
			if (goal) {
				if (resultVar === 'goalCheckResult') {
					goalCheckResult = `✓ Found goal "${goal.slug}"`;
				} else {
					observationGoalCheckResult = `✓ Found goal "${goal.slug}"`;
				}
			} else {
				if (resultVar === 'goalCheckResult') {
					goalCheckResult = '✗ Goal not found';
				} else {
					observationGoalCheckResult = '✗ Goal not found';
				}
			}
		} catch {
			if (resultVar === 'goalCheckResult') {
				goalCheckResult = '✗ Failed to check goal';
			} else {
				observationGoalCheckResult = '✗ Failed to check goal';
			}
		}
	}

	async function saveSettings(e: Event) {
		e.preventDefault();
		localStorage.setItem('beeminder-config', JSON.stringify(beeminderConfig));
		// Show feedback to user
		alert('Settings saved successfully!');
	}
</script>

<main class="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
	<div class="max-w-4xl mx-auto">
		<div class="mb-8">
			<h1 class="text-4xl font-serif text-slate-800 dark:text-slate-100 mb-4">Settings</h1>
			<p class="text-slate-600 dark:text-slate-300">Configure your preferences and integrations</p>
		</div>

		<div class="space-y-8">
			<div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
				<h2 class="text-2xl font-serif text-slate-700 dark:text-slate-100 mb-6">Data Management</h2>
				<div class="flex flex-col gap-4">
					<div>
						<h3 class="text-lg font-medium text-slate-700 dark:text-slate-100 mb-2">Export Data</h3>
						<p class="text-slate-600 dark:text-slate-300 text-sm mb-4">
							Download your hypotheses and observations as a JSON file for backup or transfer.
						</p>
						<button
							onclick={() => {
								const data = JSON.stringify(loadHypotheses(), null, 2);
								const blob = new Blob([data], { type: 'application/json' });
								const url = URL.createObjectURL(blob);
								const a = document.createElement('a');
								a.href = url;
								a.download = `bayes-hypotheses-${new Date().toISOString().split('T')[0]}.json`;
								document.body.appendChild(a);
								a.click();
								document.body.removeChild(a);
								URL.revokeObjectURL(url);
							}}
							class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
							Export Data
						</button>
					</div>

					<div class="border-t border-slate-200 pt-4">
						<h3 class="text-lg font-medium text-slate-700 dark:text-slate-100 mb-2">Import Data</h3>
						<p class="text-slate-600 dark:text-slate-300 text-sm mb-4">
							Import previously exported data. This will replace your current hypotheses.
						</p>
						<label
							class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
								/>
							</svg>
							Import Data
							<input
								type="file"
								accept="application/json"
								class="hidden"
								onchange={(e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
									const file = e.currentTarget.files?.[0];
									if (!file) return;

									const reader = new FileReader();
									reader.onload = (event) => {
										try {
											const importedHypotheses = JSON.parse(
												(event.target?.result as string) || '[]'
											);
											if (confirm('This will replace all your current hypotheses. Are you sure?')) {
												saveHypotheses(importedHypotheses);
												alert('Data imported successfully!');
											}
										} catch {
											alert('Invalid JSON file');
										}
									};
									reader.readAsText(file);
									e.currentTarget.value = ''; // Reset input
								}}
							/>
						</label>
					</div>

					<div class="border-t border-slate-200 pt-4">
						<h3 class="text-lg font-medium text-slate-700 dark:text-slate-100 mb-2">Delete All Data</h3>
						<p class="text-slate-600 dark:text-slate-300 text-sm mb-4">
							Delete all your hypotheses and settings. This action cannot be undone.
						</p>
						<button
							onclick={() => {
								if (
									confirm(
										'Are you sure you want to delete all your data? This action cannot be undone.'
									)
								) {
									localStorage.clear();
									beeminderConfig = {
										username: '',
										authToken: '',
										hypothesisGoal: '',
										observationGoal: ''
									};
									saveHypotheses([]);
									alert('All data has been deleted');
								}
							}}
							class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
							Delete All Data
						</button>
					</div>
				</div>
			</div>

			<div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
				<h2 class="text-2xl font-serif text-slate-700 dark:text-slate-100 mb-6">Beeminder Integration</h2>
				<form onsubmit={saveSettings} class="space-y-6">
					<div>
						<label for="username" class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
							>Beeminder Username</label
						>
						<input
							id="username"
							type="text"
							bind:value={beeminderConfig.username}
							class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
							placeholder="your-username"
						/>
					</div>

					<div>
						<label for="auth-token" class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
							>Auth Token</label
						>
						<input
							id="auth-token"
							type="password"
							bind:value={beeminderConfig.authToken}
							class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
							placeholder="••••••••••••••••"
						/>
						<p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
							Find your auth token in your <a
								href="https://www.beeminder.com/settings/account#account-permissions"
								target="_blank"
								rel="noopener noreferrer"
								class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">Beeminder account settings</a
							>
						</p>
					</div>

					<div>
						<label for="selected-goal" class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
							>New Hypothesis Goal Slug</label
						>
						<div class="relative">							<input
								id="hypothesis-goal"
								type="text"
								bind:value={beeminderConfig.hypothesisGoal}
								oninput={debounce(() => checkGoal(beeminderConfig.hypothesisGoal, 'goalCheckResult'), 500)}
								class="w-full p-3 pr-10 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
								placeholder="your-goal-slug"
							/>
							<div class="absolute inset-y-0 right-0 flex items-center pr-3">
								{#if isCheckingGoal}
									<svg
										class="animate-spin h-5 w-5 text-slate-400"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								{:else if goalCheckResult.startsWith('✓')}
									<svg
										class="h-5 w-5 text-emerald-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										></path>
									</svg>
								{:else if goalCheckResult.startsWith('✗')}
									<svg
										class="h-5 w-5 text-red-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										></path>
									</svg>
								{/if}
							</div>
						</div>
						<p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
							Enter the slug of the Beeminder goal to send datapoints to when new hypotheses are
							created
						</p>
					</div>

					<div>
						<label for="observation-goal" class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
							>New Observation Goal Slug</label
						>
						<div class="relative">
							<input
								id="observation-goal"
								type="text"
								bind:value={beeminderConfig.observationGoal}
								oninput={debounce(
									() => checkGoal(beeminderConfig.observationGoal, 'observationGoalCheckResult'),
									500
								)}
								class="w-full p-3 pr-10 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
								placeholder="observation-goal-slug"
							/>
							<div class="absolute inset-y-0 right-0 flex items-center pr-3">
								{#if isCheckingObservationGoal}
									<svg
										class="animate-spin h-5 w-5 text-slate-400"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								{:else if observationGoalCheckResult.startsWith('✓')}
									<svg
										class="h-5 w-5 text-emerald-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										></path>
									</svg>
								{:else if observationGoalCheckResult.startsWith('✗')}
									<svg
										class="h-5 w-5 text-red-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										></path>
									</svg>
								{/if}
							</div>
						</div>
						<p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
							Enter the slug of the Beeminder goal to send datapoints to when new observations are
							added
						</p>
					</div>

					<button
						type="submit"
						class="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
					>
						Save Settings
					</button>
				</form>
			</div>
		</div>
	</div>
</main>
