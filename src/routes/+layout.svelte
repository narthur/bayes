<script>
	import '../app.css';
</script>

<div class="min-h-screen flex flex-col">
	<div class="flex-1">
		<slot />
	</div>

	<footer class="bg-white border-t border-slate-200 py-8">
		<div class="max-w-4xl mx-auto px-4">
			<div class="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
				<a
					href="https://nathanarthur.com"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-indigo-600 transition-colors flex items-center gap-1 whitespace-nowrap"
				>
					<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					nathanarthur.com
				</a>
				<span class="text-slate-300">•</span>
				<a
					href="https://pinepeakdigital.com"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-indigo-600 transition-colors flex items-center gap-1 whitespace-nowrap"
				>
					<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
						/>
					</svg>
					pinepeakdigital.com
				</a>
				<span class="text-slate-300">•</span>
				<a
					href="https://taskratchet.com"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-indigo-600 transition-colors flex items-center gap-1 whitespace-nowrap"
				>
					<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
						/>
					</svg>
					TaskRatchet
				</a>
				<span class="text-slate-300">•</span>
				<a
					href="https://codebuff.com/referrals/ref-6d348d54-80f1-4155-903b-2cc6c57dd12f"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-indigo-600 transition-colors flex items-center gap-1 whitespace-nowrap"
				>
					<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
						/>
					</svg>
					Built with Codebuff
				</a>
				<span class="text-slate-300">•</span>
				<a
					href="https://ko-fi.com/narthur"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-indigo-600 transition-colors flex items-center gap-1 whitespace-nowrap"
				>
					<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
						/>
					</svg>
					Support on Ko-fi
				</a>
				<span class="text-slate-300">•</span>
				<a
					href="/settings"
					class="hover:text-indigo-600 transition-colors flex items-center gap-1 whitespace-nowrap"
				>
					<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					Settings
				</a>
			</div>
		</div>
	</footer>
</div>

<style>
	/* Add custom font */
	@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&display=swap');

	:global(.font-serif) {
		font-family: 'Crimson Pro', serif;
	}
</style>
