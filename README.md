# Jitbit Helpdesk MCP Server

An MCP (Model Context Protocol) server that lets AI assistants search and read support tickets from [Jitbit Helpdesk](https://www.jitbit.com/helpdesk/). Works with both SaaS and on-premise installations.

[![npm version](https://img.shields.io/npm/v/jitbit-helpdesk-mcp.svg)](https://www.npmjs.com/package/jitbit-helpdesk-mcp)

## Quick Start

```bash
npx -y jitbit-helpdesk-mcp
```

## Configuration

Add to your MCP client config (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "jitbit-helpdesk": {
      "command": "npx",
      "args": ["-y", "jitbit-helpdesk-mcp"],
      "env": {
        "JITBIT_URL": "https://yourcompany.jitbit.com",
        "JITBIT_TOKEN": "your-jwt-token"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `JITBIT_URL` | Yes | Base URL of your Jitbit instance (SaaS: `https://yourcompany.jitbit.com`, on-prem: your server URL) |
| `JITBIT_TOKEN` | Yes | JWT token — copy from your Jitbit profile page |

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
