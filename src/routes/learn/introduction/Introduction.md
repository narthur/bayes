# Introduction to Bayesian Reasoning

## What is Bayesian Reasoning?

Bayesian reasoning is a method of thinking that helps us update our beliefs based on new evidence.
It's named after Thomas Bayes, an 18th-century statistician who first formalized this approach.

## The Core Concept

At its heart, Bayesian reasoning is about starting with what we already believe (our "prior") and
then updating that belief when we see new evidence. The strength of the update depends on how
surprising the evidence would be if our belief was true versus if it was false.

## A Simple Example

Imagine you're trying to figure out if your friend is planning a surprise party for you. You
start with a guess - maybe there's a 20% chance they are (this is your prior probability).

Then you notice your friend asking about your schedule for next weekend. How much should this
change your belief? It depends on two things:

* How likely would they be to ask about your schedule if they were planning a party? (Pretty
  likely, maybe 80%)
* How likely would they be to ask about your schedule if they weren't planning a party? (Less
  likely, maybe 20%)

Because the evidence (asking about your schedule) is more likely in the world where they're
planning a party, your belief that they're planning a party should increase.

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
