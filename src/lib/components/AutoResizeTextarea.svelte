<script lang="ts">
	export let value: string;
	export let placeholder = '';
	export let className = '';

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		// Add non-breaking space after every newline
		const contentWithSpaces = target.value.replace(/\n/g, '\n\u00a0');
		// Store cursor position
		const cursorPos = target.selectionStart;
		// Temporarily set value to include spaces for height calculation
		target.value = contentWithSpaces;
		// Reset height to auto to get the correct scrollHeight
		target.style.height = 'auto';
		// Set the height to match the content
		target.style.height = target.scrollHeight + 'px';
		// Restore original value and cursor position
		target.value = value;
		target.setSelectionRange(cursorPos, cursorPos);
	}
</script>

<textarea
	bind:value
	on:input={handleInput}
	on:change
	on:blur
	{placeholder}
	class="resize-none overflow-hidden {className}"
	rows="1"
></textarea>
