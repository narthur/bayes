<script lang="ts">
  export let open = false;
  export let title: string;
  export let onClose: () => void;
</script>

{#if open}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl" role="dialog" aria-modal="true">
      <div class="flex items-center justify-between p-6 border-b border-slate-200">
        <h2 class="text-2xl font-serif text-slate-700">{title}</h2>
        <button
          onclick={onClose}
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
