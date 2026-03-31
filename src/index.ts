#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { JitbitClient } from "./jitbit-client.js";

const JITBIT_URL = process.env.JITBIT_URL;
const JITBIT_TOKEN = process.env.JITBIT_TOKEN;

if (!JITBIT_URL) {
  console.error("ERROR: JITBIT_URL environment variable is required. Set it to your Jitbit Helpdesk base URL (e.g. https://yourcompany.jitbit.com).");
  process.exit(1);
}

if (!JITBIT_TOKEN) {
  console.error("ERROR: JITBIT_TOKEN environment variable is required. Copy your JWT token from your Jitbit profile page.");
  process.exit(1);
}

const client = new JitbitClient(JITBIT_URL, JITBIT_TOKEN);

const server = new McpServer({
  name: "jitbit-helpdesk-mcp",
  version: "1.0.0",
});

function formatTicketSummary(ticket: { IssueID: number; Subject: string; Status: string; Priority: string; CategoryName: string; SubmitterUserName: string; AssigneeUserName: string; DateCreated: string; DateUpdated: string }): string {
  return [
    `#${ticket.IssueID}: ${ticket.Subject}`,
    `  Status: ${ticket.Status} | Priority: ${ticket.Priority}`,
    `  Category: ${ticket.CategoryName}`,
    `  From: ${ticket.SubmitterUserName} | Assigned: ${ticket.AssigneeUserName || "Unassigned"}`,
    `  Created: ${ticket.DateCreated} | Updated: ${ticket.DateUpdated}`,
  ].join("\n");
}

// --- search_tickets ---

server.registerTool(
  "jitbit_search_tickets",
  {
    title: "Search Jitbit Helpdesk Tickets",
    description: `Search for tickets in Jitbit Helpdesk by keyword or phrase.

Args:
  - query (string): Search query to match against ticket subjects and bodies
  - limit (number): Maximum results to return, 1-100 (default: 25)
  - offset (number): Number of results to skip for pagination (default: 0)

Returns: List of matching tickets with ID, subject, status, priority, category, submitter, and assignee.`,
    inputSchema: {
      query: z.string().min(1, "Query is required").describe("Search query to match against ticket subjects and bodies"),
      limit: z.number().int().min(1).max(100).default(25).describe("Maximum results to return"),
      offset: z.number().int().min(0).default(0).describe("Number of results to skip for pagination"),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async ({ query, limit, offset }) => {
    try {
      const tickets = await client.searchTickets(query, limit, offset);

      if (!tickets.length) {
        return { content: [{ type: "text", text: `No tickets found matching "${query}".` }] };
      }

      const text = [`Found ${tickets.length} ticket(s) matching "${query}":\n`, ...tickets.map(formatTicketSummary)].join("\n\n");

      return { content: [{ type: "text", text }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  }
);

// --- list_tickets ---

server.registerTool(
  "jitbit_list_tickets",
  {
    title: "List Jitbit Helpdesk Tickets",
    description: `List and filter tickets in Jitbit Helpdesk.

Args:
  - mode (string, optional): Filter mode — "all", "unanswered", "updated"
  - status (string, optional): Filter by ticket status, passed to the Jitbit API as-is
  - limit (number): Maximum results to return, 1-100 (default: 25)
  - offset (number): Number of results to skip for pagination (default: 0)

Returns: List of tickets with ID, subject, status, priority, category, submitter, and assignee.`,
    inputSchema: {
      mode: z.string().optional().describe('Filter mode: "all", "unanswered", "updated"'),
      status: z.string().optional().describe("Filter by ticket status"),
      limit: z.number().int().min(1).max(100).default(25).describe("Maximum results to return"),
      offset: z.number().int().min(0).default(0).describe("Number of results to skip for pagination"),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async ({ mode, status, limit, offset }) => {
    try {
      const tickets = await client.listTickets(mode, status, limit, offset);

      if (!tickets.length) {
        return { content: [{ type: "text", text: "No tickets found with the specified filters." }] };
      }

      const text = [`Showing ${tickets.length} ticket(s):\n`, ...tickets.map(formatTicketSummary)].join("\n\n");

      return { content: [{ type: "text", text }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  }
);

// --- get_ticket ---

server.registerTool(
  "jitbit_get_ticket",
  {
    title: "Get Jitbit Helpdesk Ticket",
    description: `Get a single ticket with its full conversation thread from Jitbit Helpdesk.

Args:
  - ticketId (number): The ticket ID to retrieve

Returns: Full ticket details including subject, body, status, priority, category, submitter, assignee, tags, and complete comment history.`,
    inputSchema: {
      ticketId: z.number().int().positive().describe("The ticket ID to retrieve"),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async ({ ticketId }) => {
    try {
      const ticket = await client.getTicket(ticketId);

      const lines = [
        `# Ticket #${ticket.IssueID}: ${ticket.Subject}`,
        "",
        `**Status:** ${ticket.Status} | **Priority:** ${ticket.Priority}`,
        `**Category:** ${ticket.CategoryName}`,
        `**From:** ${ticket.SubmitterUserName} | **Assigned:** ${ticket.AssigneeUserName || "Unassigned"}`,
        `**Created:** ${ticket.DateCreated} | **Updated:** ${ticket.DateUpdated}`,
      ];

      if (ticket.Tags?.length) {
        lines.push(`**Tags:** ${ticket.Tags.join(", ")}`);
      }

      lines.push("", "## Description", "", ticket.Body || "(empty)");

      if (ticket.Comments?.length) {
        lines.push("", "## Conversation", "");
        for (const comment of ticket.Comments) {
          if (comment.IsHidden) continue;
          lines.push(`### ${comment.UserName} — ${comment.DateCreated}`, "", comment.Body, "");
        }
      }

      return { content: [{ type: "text", text: lines.join("\n") }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  }
);

// --- Start server ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Jitbit Helpdesk MCP server running via stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
