<script lang="ts">
	import { onMount } from 'svelte';
	import type { BeeminderConfig } from '$lib/types';
	import { loadHypotheses, saveHypotheses } from '$lib/storage';
	import { BeeminderService } from '$lib/beeminder';

	let beeminderConfig: BeeminderConfig = {
		username: '',
		authToken: '',
		selectedGoal: '',
		observationGoal: ''
	};
	let goalCheckResult = '';
	let observationGoalCheckResult = '';

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
		if (!beeminderConfig.username || !beeminderConfig.authToken || !goalSlug) {
			goalCheckResult = 'Please fill in all fields first';
			return;
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
		} catch (error) {
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
	}
</script>

<main class="min-h-screen bg-slate-50 py-8 px-4">
	<div class="max-w-4xl mx-auto">
		<div class="mb-8">
			<h1 class="text-4xl font-serif text-slate-800 mb-4">Settings</h1>
			<p class="text-slate-600">Configure your preferences and integrations</p>
		</div>

		<div class="space-y-8">
			<div class="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
				<h2 class="text-2xl font-serif text-slate-700 mb-6">Data Management</h2>
				<div class="flex flex-col gap-4">
					<div>
						<h3 class="text-lg font-medium text-slate-700 mb-2">Export Data</h3>
						<p class="text-slate-600 text-sm mb-4">
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
						<h3 class="text-lg font-medium text-slate-700 mb-2">Import Data</h3>
						<p class="text-slate-600 text-sm mb-4">
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
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
				<h2 class="text-2xl font-serif text-slate-700 mb-6">Beeminder Integration</h2>
				<form onsubmit={saveSettings} class="space-y-6">
					<div>
						<label for="username" class="block text-sm font-medium text-slate-700 mb-2"
							>Beeminder Username</label
						>
						<input
							id="username"
							type="text"
							bind:value={beeminderConfig.username}
							class="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
							placeholder="your-username"
						/>
					</div>

					<div>
						<label for="auth-token" class="block text-sm font-medium text-slate-700 mb-2"
							>Auth Token</label
						>
						<input
							id="auth-token"
							type="password"
							bind:value={beeminderConfig.authToken}
							class="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
							placeholder="••••••••••••••••"
						/>
						<p class="mt-2 text-sm text-slate-500">
							Find your auth token in your <a
								href="https://www.beeminder.com/settings/account#account-permissions"
								target="_blank"
								rel="noopener noreferrer"
								class="text-indigo-600 hover:text-indigo-700">Beeminder account settings</a
							>
						</p>
					</div>

					<div>
						<label for="selected-goal" class="block text-sm font-medium text-slate-700 mb-2"
							>New Hypothesis Goal Slug</label
						>
						<div class="flex gap-2">
							<input
								id="selected-goal"
								type="text"
								bind:value={beeminderConfig.selectedGoal}
								class="flex-1 p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
								placeholder="your-goal-slug"
							/>
							<button
								type="button"
								onclick={() => checkGoal(beeminderConfig.selectedGoal, 'goalCheckResult')}
								class="px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
							>
								Check
							</button>
						</div>
						{#if goalCheckResult}
							<p
								class="mt-2 text-sm"
								class:text-emerald-600={goalCheckResult.startsWith('✓')}
								class:text-red-600={goalCheckResult.startsWith('✗')}
							>
								{goalCheckResult}
							</p>
						{:else}
							<p class="mt-2 text-sm text-slate-500">
								Enter the slug of the Beeminder goal to send datapoints to when new hypotheses are
								created
							</p>
						{/if}
					</div>

					<div>
						<label for="observation-goal" class="block text-sm font-medium text-slate-700 mb-2"
							>New Observation Goal Slug</label
						>
						<div class="flex gap-2">
							<input
								id="observation-goal"
								type="text"
								bind:value={beeminderConfig.observationGoal}
								class="flex-1 p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
								placeholder="observation-goal-slug"
							/>
							<button
								type="button"
								onclick={() =>
									checkGoal(beeminderConfig.observationGoal, 'observationGoalCheckResult')}
								class="px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
							>
								Check
							</button>
						</div>
						{#if observationGoalCheckResult}
							<p
								class="mt-2 text-sm"
								class:text-emerald-600={observationGoalCheckResult.startsWith('✓')}
								class:text-red-600={observationGoalCheckResult.startsWith('✗')}
							>
								{observationGoalCheckResult}
							</p>
						{:else}
							<p class="mt-2 text-sm text-slate-500">
								Enter the slug of the Beeminder goal to send datapoints to when new observations are
								added
							</p>
						{/if}
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
