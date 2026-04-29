# Jitbit Helpdesk MCP Server

An MCP (Model Context Protocol) server that lets AI assistants search and read support tickets from [Jitbit Helpdesk](https://www.jitbit.com/helpdesk/). Works with both SaaS and on-premise installations.

[![npm version](https://img.shields.io/npm/v/jitbit-helpdesk-mcp.svg)](https://www.npmjs.com/package/jitbit-helpdesk-mcp)

> ⚠️ **Use the hosted HTTP endpoint when possible.** Jitbit ships a built-in HTTP MCP endpoint at `/api/mcp` on all SaaS and on-premise installs running version 11.21 or later. That is the preferred way to connect AI assistants to Jitbit — no local install, always in sync with Jitbit releases. See the [Jitbit MCP docs](https://www.jitbit.com/docs/mcp/). Starting with **2.x, this npm package is a thin stdio proxy** to that same endpoint, for clients that don't yet support remote HTTP MCP servers. **Jitbit 11.21 or later is required.** If you're on an older on-premise version, stay on `jitbit-helpdesk-mcp@1.x`.

## Setup

Two options:

1. **Hosted HTTP endpoint** (recommended) — connect your MCP client directly to Jitbit's `/api/mcp`. Use this whenever your client supports HTTP MCP transport.
2. **Local npm package (stdio proxy)** — this repo. Use it when your MCP client only supports stdio transport. It forwards every request to `{JITBIT_URL}/api/mcp` and adds nothing of its own.

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

### Option 2: Local npm package (stdio proxy)

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

The proxy exposes whatever tools the connected Jitbit instance advertises at `/api/mcp` — typically ticket search, list, and read, plus anything Jitbit adds in later releases. Use your MCP client's tool listing (or the [Jitbit MCP docs](https://www.jitbit.com/docs/mcp/)) for the up-to-date catalog.

## Development

```bash
npm install
npm run build
```

## License

MIT
