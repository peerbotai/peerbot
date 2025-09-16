# Peerbot

A powerful Slack bot built with Next.js and TypeScript.

## Features

- 🤖 Interactive Slack bot with slash commands
- 📋 Task management functionality
- 🎨 Beautiful UI with Tailwind CSS
- 🚀 Built with Next.js 15 and TypeScript
- ⚡ Socket mode for real-time events

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up your Slack app:
   - Create a new Slack app at [api.slack.com](https://api.slack.com/apps)
   - Enable Socket Mode
   - Add the required bot scopes:
     - `chat:write`
     - `commands`
     - `im:history`
     - `channels:history`
   - Install the app to your workspace

4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Slack credentials.

5. Run the development server:
   ```bash
   bun run dev:all
   ```

## Available Scripts

- `bun run dev` - Start Next.js development server
- `bun run bot` - Start Slack bot only
- `bun run dev:all` - Start both Next.js and Slack bot
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Prettier

## Project Structure

```
├── app/              # Next.js app directory
│   └── api/         # API routes
├── lib/             # Shared libraries
│   └── slack/       # Slack bot configuration
├── scripts/         # Utility scripts
└── public/          # Static assets
```

## License

MIT
