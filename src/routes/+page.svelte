<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<main class=" bg-slate-50 dark:bg-slate-900">
	<div class="max-w-4xl mx-auto px-4 py-16 sm:py-24">
		<div class="text-center">
			<h1 class="text-5xl font-serif text-slate-800 dark:text-slate-100 mb-6">
				Bayesian Inference Tool
			</h1>
			<p class="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
				A systematic approach to updating beliefs based on evidence. Track hypotheses and calculate
				probabilities using Bayes' theorem.
			</p>
			<div class="flex justify-center gap-4">
				<button
					on:click={() => goto('/hypotheses')}
					class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
				>
					Get Started
				</button>
				<a
					href="#learn-more"
					class="px-6 py-3 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
				>
					Learn More
				</a>
			</div>
		</div>

		<div class="mt-24" id="learn-more">
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				<div
					class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
				>
					<div class="text-indigo-600 dark:text-indigo-400 mb-4">
						<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
					</div>
					<h3 class="text-xl font-serif text-slate-800 dark:text-slate-100 mb-2">
						Track Hypotheses
					</h3>
					<p class="text-slate-600 dark:text-slate-300">
						Create and manage hypotheses about anything. Assign initial probabilities based on your
						prior beliefs.
					</p>
				</div>

				<div
					class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
				>
					<div class="text-indigo-600 dark:text-indigo-400 mb-4">
						<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h3 class="text-xl font-serif text-slate-800 dark:text-slate-100 mb-2">
						Record Evidence
					</h3>
					<p class="text-slate-600 dark:text-slate-300">
						Add observations and evidence as you encounter them. Rate how likely each piece of
						evidence would be under different scenarios.
					</p>
				</div>

				<div
					class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
				>
					<div class="text-indigo-600 dark:text-indigo-400 mb-4">
						<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
							/>
						</svg>
					</div>
					<h3 class="text-xl font-serif text-slate-800 dark:text-slate-100 mb-2">Update Beliefs</h3>
					<p class="text-slate-600 dark:text-slate-300">
						Watch as probabilities update automatically using Bayes' theorem. Make better decisions
						based on evidence.
					</p>
				</div>

				<div
					class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
				>
					<div class="text-indigo-600 dark:text-indigo-400 mb-4">
						<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
					</div>
					<h3 class="text-xl font-serif text-slate-800 dark:text-slate-100 mb-2">
						Private & Local
					</h3>
					<p class="text-slate-600 dark:text-slate-300">
						No sign up required. All data is stored locally in your browser. Your hypotheses stay
						private and under your control.
					</p>
				</div>

				<div
					class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
				>
					<div class="text-indigo-600 dark:text-indigo-400 mb-4">
						<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
					</div>
					<h3 class="text-xl font-serif text-slate-800 dark:text-slate-100 mb-2">
						Beeminder Integration
					</h3>
					<p class="text-slate-600 dark:text-slate-300">
						Optional integration with Beeminder to track your hypothesis creation and evidence
						gathering habits.
					</p>
				</div>
			</div>
		</div>
	</div>
</main>
