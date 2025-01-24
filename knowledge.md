# Bayes Project Knowledge

## Mission
A web application for applying Bayesian reasoning to everyday life. Track hypotheses, record observations, and update probabilities based on evidence.

## Architecture
- Built with SvelteKit
- Local-first: data stored in browser localStorage
- Static site deployment
- TypeScript for type safety
- TailwindCSS for styling
- Dark mode support with system preference detection and user toggle

## Page Structure
- `/`: Marketing landing page with feature overview
- `/hypotheses`: Main list view of all hypotheses
- `/hypothesis/[id]`: Individual hypothesis view with evidence
- `/settings`: Configuration and data management

## Key Features
- Create and manage hypotheses
- Add observations with likelihood ratios
- Automatic probability updates using Bayes' theorem
- Export/import data
- Markdown support in observation notes
- Duplicate hypotheses
- Delete hypotheses

## Style Guide
- Use semantic HTML
- Ensure accessibility (labels, ARIA attributes)
- Consistent spacing with TailwindCSS
- Indigo as primary color, emerald for success actions
- Subtle transitions and hover states
- Responsive design

### Modal Accessibility
- Use role="dialog" and aria-modal="true"
- Add aria-labelledby pointing to modal title
- Trap focus within modal when open
- Support Escape key to close
- Backdrop click handler needs role="presentation"

## Development Practices
- Run `pnpm build` to validate changes
- Fix all accessibility warnings
- Add IDs to form controls and associate with labels
- Keep components focused and reusable
- Use TypeScript types consistently
- Preserve whitespace in descriptions with `whitespace-pre-line`

## URLs & References
- [SvelteKit Documentation](https://kit.svelte.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Marked Documentation](https://marked.js.org/) - Used for markdown rendering

## Future Features
- Tags/categories
- Search function
- Sorting/filtering
- Probability change graph
- Hypothesis comparison
- Evidence linking
- Keyboard shortcuts

## Common Issues
- Always import functions from storage.ts before using them
- Ensure proper typing for all components and functions
- Handle empty states and loading states
- Preserve user data during updates

## Integrations
### Beeminder
- Sends datapoints to configured goals when new hypotheses or observations are created
- Configured in settings page with username, auth token, and goal slugs
- Validates goal slugs before saving
- Uses requestid to prevent duplicate datapoints (hypothesis.id or observation.id)
