<script lang="ts">
	import { onMount } from 'svelte';
	import type { BeeminderConfig } from '$lib/types';

	let beeminderConfig: BeeminderConfig = {
		username: '',
		authToken: ''
	};

	onMount(() => {
		const stored = localStorage.getItem('beeminder-config');
		if (stored) {
			beeminderConfig = JSON.parse(stored);
		}
	});

	function saveSettings() {
		localStorage.setItem('beeminder-config', JSON.stringify(beeminderConfig));
	}
</script>

<main class="min-h-screen bg-slate-50 py-8 px-4">
	<div class="max-w-4xl mx-auto">
		<div class="mb-8">
			<h1 class="text-4xl font-serif text-slate-800 mb-4">Settings</h1>
			<p class="text-slate-600">Configure your preferences and integrations</p>
		</div>

		<div class="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
			<h2 class="text-2xl font-serif text-slate-700 mb-6">Beeminder Integration</h2>
			<form on:submit|preventDefault={saveSettings} class="space-y-6">
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

				<button
					type="submit"
					class="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
				>
					Save Settings
				</button>
			</form>
		</div>
	</div>
</main>
