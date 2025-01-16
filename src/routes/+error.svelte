<script>
  import { page } from '$app/stores';
</script>

<main class="min-h-screen bg-slate-50 py-8 px-4">
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="text-4xl font-serif text-slate-800 mb-4">
      {$page.status === 404 ? 'Page Not Found' : 'Error'}
    </h1>
    <p class="text-slate-600 mb-8">
      {$page.error?.message || "Sorry, we couldn't find what you were looking for."}
    </p>
    <a
      href="/"
      class="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Return Home
    </a>
  </div>
</main>
