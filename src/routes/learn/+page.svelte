<script lang="ts">
</script>

<main class="bg-slate-50 dark:bg-slate-900 py-16">
	<div class="max-w-4xl mx-auto px-4">
		<h1 class="text-4xl font-serif text-slate-800 dark:text-slate-100 mb-8">Learn About Bayesian Inference</h1>

		<div class="prose dark:prose-invert max-w-none">
			<h2>What is Bayesian Inference?</h2>
			<p>
				Bayesian inference is a method of statistical inference that allows you to update your beliefs
				about a hypothesis as you gather new evidence. It's based on Bayes' theorem, which provides a
				mathematical framework for combining prior beliefs with new evidence.
			</p>

			<h2>How It Works</h2>
			<p>
				The process involves three key components:
			</p>
			<ol>
				<li>
					<strong>Prior Probability</strong> - Your initial belief about a hypothesis before seeing
					any evidence
				</li>
				<li>
					<strong>Likelihood Ratio</strong> - How much more likely you are to see the evidence if
					your hypothesis is true versus if it's false
				</li>
				<li>
					<strong>Posterior Probability</strong> - Your updated belief after considering the
					evidence
				</li>
			</ol>

			<h2>Using This Tool</h2>
			<p>
				This tool helps you apply Bayesian reasoning to your own hypotheses:
			</p>
			<ol>
				<li>Create a hypothesis and set your prior probability</li>
				<li>Add observations as you encounter evidence</li>
				<li>For each observation, estimate:</li>
				<ul>
					<li>How likely you'd see this evidence if your hypothesis is true</li>
					<li>How likely you'd see this evidence if your hypothesis is false</li>
				</ul>
				<li>The tool automatically calculates your updated probability</li>
			</ol>

			<h2>Example</h2>
			<p>
				Let's say you have a hypothesis: "My friend Alice is planning a surprise party for me."
			</p>
			<ul>
				<li>Prior probability: 20% (based on it being your birthday month)</li>
				<li>
					Evidence: You overhear Alice asking about your schedule next weekend
					<ul>
						<li>If planning a party (true): 80% likely to ask about schedule</li>
						<li>If not planning a party (false): 20% likely to ask about schedule</li>
					</ul>
				</li>
				<li>
					The tool would calculate your new probability, showing how this evidence should affect
					your belief
				</li>
			</ul>

			<h2>Tips for Good Bayesian Reasoning</h2>
			<ul>
				<li>Be explicit about your assumptions in the prior probability</li>
				<li>Consider alternative explanations when estimating likelihoods</li>
				<li>Update gradually as evidence accumulates</li>
				<li>Document your reasoning to review and improve over time</li>
			</ul>

			<div class="mt-12 flex justify-center">
				<a
					href="/hypotheses"
					class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium no-underline"
				>
					Start Using the Tool
				</a>
			</div>
		</div>
	</div>
</main>
