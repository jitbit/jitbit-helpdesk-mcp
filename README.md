# Jitbit Helpdesk MCP Server

An MCP (Model Context Protocol) server that lets AI assistants search and read support tickets from [Jitbit Helpdesk](https://www.jitbit.com/helpdesk/). Works with both SaaS and on-premise installations.

[![npm version](https://img.shields.io/npm/v/jitbit-helpdesk-mcp.svg)](https://www.npmjs.com/package/jitbit-helpdesk-mcp)

## Setup

Two options:

1. **Hosted HTTP endpoint** (recommended) — built into Jitbit, no installation required. Available on SaaS and on-premise installs running version 11.21 or later. See the [Jitbit MCP docs](https://www.jitbit.com/docs/mcp/).
2. **Local npm package** — this repo, runs locally via `npx`. Use this if your on-premise Jitbit is older than 11.21.

### Option 1: Hosted HTTP endpoint

#### Claude Code

```bash
claude mcp add --transport http jitbit-helpdesk https://yourcompany.jitbit.com/api/mcp \
  --header "Authorization: Bearer your-api-token"
```

#### Claude Desktop, Cursor, Windsurf

```json
{
  "mcpServers": {
    "jitbit-helpdesk": {
      "type": "http",
      "url": "https://yourcompany.jitbit.com/api/mcp",
      "headers": {
        "Authorization": "Bearer your-api-token"
      }
    }
  }
}
```

### Option 2: Local npm package

#### Claude Code

```bash
claude mcp add jitbit-helpdesk \
  -e JITBIT_URL=https://yourcompany.jitbit.com \
  -e JITBIT_TOKEN=your-api-token \
  -- npx -y jitbit-helpdesk-mcp
```

#### Claude Desktop, Cursor, Windsurf

Add to your config file:
- Claude Desktop: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows)
- Cursor: Settings > MCP Servers
- Windsurf: Settings > MCP Servers

```json
{
  "mcpServers": {
    "jitbit-helpdesk": {
      "command": "npx",
      "args": ["-y", "jitbit-helpdesk-mcp"],
      "env": {
        "JITBIT_URL": "https://yourcompany.jitbit.com",
        "JITBIT_TOKEN": "your-api-token"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `JITBIT_URL` | Yes | Base URL of your Jitbit instance (SaaS: `https://yourcompany.jitbit.com`, on-prem: your server URL) |
| `JITBIT_TOKEN` | Yes | API token — see below |

### Getting your API token

1. Log in to your Jitbit Helpdesk
2. Go to your **User Profile** (click your avatar in the top right)
3. Click the **"API Token"** button
4. Copy the token and use it as the `JITBIT_TOKEN` value

## Tools

### `jitbit_search_tickets`

Search tickets by keyword or phrase.

**Parameters:**
- `query` (string, required) — search query
- `limit` (number, default 25) — max results (1–100)
- `offset` (number, default 0) — pagination offset

### `jitbit_list_tickets`

List and filter tickets.

**Parameters:**
- `mode` (string, optional) — `"all"`, `"unanswered"`, or `"updated"`
- `status` (string, optional) — filter by ticket status
- `limit` (number, default 25) — max results (1–100)
- `offset` (number, default 0) — pagination offset

### `jitbit_get_ticket`

Get a single ticket with its full conversation thread.

**Parameters:**
- `ticketId` (number, required) — the ticket ID

## Development

```bash
npm install
npm run build
```

## License

MIT
