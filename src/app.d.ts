// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '*.svx' {
	import { SvelteComponentTyped } from 'svelte';
	export default class extends SvelteComponentTyped {}
}

declare module '*.md' {
	import { SvelteComponentTyped } from 'svelte';
	export default class extends SvelteComponentTyped {}
}

export {};
