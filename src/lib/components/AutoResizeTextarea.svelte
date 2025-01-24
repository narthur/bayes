<script lang="ts">
  import { onMount } from 'svelte';
  
  export let value: string = '';
  export let placeholder = '';
  export let className = '';
  export let autofocus = false;

  let textarea: HTMLTextAreaElement;

  function adjustHeight(textareaElement: HTMLTextAreaElement) {
    // Add non-breaking space after every newline
    const contentWithSpaces = textareaElement.value.replace(/\n/g, '\n\u00a0');
    // Store cursor position
    const cursorPos = textareaElement.selectionStart;
    // Temporarily set value to include spaces for height calculation
    textareaElement.value = contentWithSpaces;
    // Reset height to auto to get the correct scrollHeight
    textareaElement.style.height = 'auto';
    // Set the height to match the content
    textareaElement.style.height = textareaElement.scrollHeight + 'px';
    // Restore original value and cursor position
    textareaElement.value = value;
    textareaElement.setSelectionRange(cursorPos, cursorPos);
  }

  function handleInput(e: Event) {
    adjustHeight(e.target as HTMLTextAreaElement);
  }

  onMount(() => {
    if (textarea) {
      adjustHeight(textarea);
      if (autofocus) {
        textarea.focus();
      }
    }
  });
</script>

<textarea
  bind:this={textarea}
  bind:value
  on:input={handleInput}
  on:change
  on:blur
  {placeholder}
  class="resize-none overflow-hidden {className}"
  rows="1"
></textarea>