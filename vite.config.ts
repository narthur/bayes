import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

/**
 * DOCS:
 * - https://app.meticulous.ai/docs/how-to/recorder-script?tab=SvelteKit
 * - https://vite.dev/guide/env-and-mode
 * - https://render.com/docs/environment-variables#all-runtimes
 */
function getMode() {
	if (process.env.IS_PULL_REQUEST === 'false') {
		return 'production';
	}

	if (process.env.IS_PULL_REQUEST === 'true') {
		return 'staging';
	}

	if (process.env.MODE) {
		return process.env.MODE;
	}

	return 'development';
}

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	mode: getMode()
});
