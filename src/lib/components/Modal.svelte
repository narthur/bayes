<script lang="ts">
	export let open = false;
	export let title: string;
	export let onClose: () => void;

	let modalElement: HTMLDivElement;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			onClose();
		}
	}

	$: if (open) {
		// Focus trap
		setTimeout(() => {
			modalElement?.focus();
		}, 0);
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
		<!-- Backdrop click handler -->
		<div 
			class="absolute inset-0" 
			on:click={onClose}
			on:keydown={(e) => e.key === 'Escape' && onClose()}
			role="presentation"
		></div>
		
		<div
			bind:this={modalElement}
			class="bg-white rounded-lg shadow-xl w-full max-w-2xl relative"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			tabindex="-1"
		>
			<div class="flex items-center justify-between p-6 border-b border-slate-200">
				<h2 id="modal-title" class="text-2xl font-serif text-slate-700">{title}</h2>
				<button
					on:click={onClose}
					class="text-slate-400 hover:text-slate-500"
					aria-label="Close modal"
				>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
{/if}
