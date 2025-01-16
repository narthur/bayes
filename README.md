# Bayesian Inference Tool

A web application for applying Bayesian reasoning to everyday life. Track hypotheses, record observations, and update probabilities based on evidence.

## Features

- Create and manage hypotheses with prior probabilities
- Add observations with likelihood ratios
- Automatic calculation of posterior probabilities using Bayes' theorem
- Local-first: all data stored in browser localStorage
- Responsive design
- Keyboard accessible

## Getting Started

### Prerequisites

- Node.js 16+
- pnpm

### Installation

1. Clone the repository
```bash
git clone [your-repo-url]
cd bayes
```

2. Install dependencies
```bash
pnpm install
```

3. Start the development server
```bash
pnpm dev
```

4. Build for production
```bash
pnpm build
```

## Development

- Built with SvelteKit
- Styled with TailwindCSS
- TypeScript for type safety
- Local storage for data persistence

## Deployment

This is a SvelteKit application that can be deployed to any platform that supports Node.js or static site hosting.

1. Build the application:
```bash
pnpm build
```

2. Preview the production build:
```bash
pnpm preview
```

## License

MIT

## Author

Nathan Arthur
- Website: [nathanarthur.com](https://nathanarthur.com)
- Pine Peak Digital: [pinepeakdigital.com](https://pinepeakdigital.com)
